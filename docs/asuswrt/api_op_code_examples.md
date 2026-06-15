# Vite 工作方式與 Dev Proxy Server 代碼示例

本文件展示在 `vue3-wrt-project` 專案中，如何透過 Vite 的代理伺服器 (Dev Proxy Server) 解決與硬體路由器 (ASUS Router) 之間的跨域與非標準 HTTP 回應問題。

## 1. 解決非標準 HTTP 回應的容錯配置

ASUS 路由器內嵌的 `httpd` 在遇到條件式請求時會違規回傳帶有 Body 的 304 狀態碼，導致 Node.js 解析崩潰。以下是專案中使用的核心修復代碼：

```typescript
// vite.config.ts 節錄
import http from 'node:http';

/**
 * 自訂 Http Agent 開啟 insecureHTTPParser
 * 用以容忍路由器不符合標準的 HTTP 回應格式
 */
class InsecureHttpAgent extends http.Agent {
    addRequest(req: http.ClientRequest, options: http.ClientRequestArgs) {
        (req as unknown as { insecureHTTPParser: boolean }).insecureHTTPParser = true;
        // @ts-expect-error addRequest 為 Node 內部 API
        return super.addRequest(req, options);
    }
}
const insecureAgent = new InsecureHttpAgent();

/**
 * 攔截 Proxy 請求，移除條件式請求標頭
 * 確保硬體路由器永遠回傳 200 OK 且附帶 Body，而不再回傳 304 導致 Parse Error
 */
const stripConditionalHeaders = (proxy: {
    on: (event: string, cb: (proxyReq: { removeHeader: (name: string) => void }) => void) => void;
}) => {
    proxy.on('proxyReq', (proxyReq) => {
        proxyReq.removeHeader('if-none-match');
        proxyReq.removeHeader('if-modified-since');
    });
};
```

## 2. Dev Proxy Server 轉發設定示例

將特定的 API 與靜態資源請求轉發至開發環境目標路由器，並維持認證與繞過跨站防護的配置。

```typescript
// vite.config.ts 節錄
import { defineConfig, loadEnv } from 'vite';

export default defineConfig(({ mode }) => {
    const env = loadEnv(mode, process.cwd(), '');
    
    // 從環境變數讀取目標位址，方便各開發者自定義硬體 IP
    const routerUrl = env.VITE_ROUTER_URL || 'http://www.asusrouter.com/';

    // 需被 Proxy 攔截並轉發的 CGI API 列表
    const routerProxyPatterns = [
        '/appGet.cgi',
        '/apply.cgi',
        '/login.cgi',
        '/captcha.gif' // Captcha 圖片需由設備產出並綁定 Session
    ];

    const proxyConfig: Record<string, object> = {};

    if (mode === 'development') {
        // 設定 CGI 轉發規則
        for (const pattern of routerProxyPatterns) {
            proxyConfig[pattern] = {
                target: routerUrl,             // 轉發目標
                changeOrigin: true,            // 變更 origin 以防跨域阻擋
                secure: false,                 // 允許非 HTTPS 轉發
                agent: insecureAgent,          // 使用上方自訂的容錯 Agent
                configure: stripConditionalHeaders, // 移除會導致硬體回報錯誤的 Headers
                cookieDomainRewrite: 'localhost',   // 確保留在開發環境能存取 Cookie
                headers: {
                    Referer: routerUrl,        // 欺騙 Referer 檢查
                },
            };
        }

        // 針對硬體的配置檔、日誌檔、以及 Legacy 頁面進行轉發
        proxyConfig['^/.*\\.asp'] = { /* 與上方相同的屬性配置 */ };
        proxyConfig['^/.*\\.json'] = { /* 與上方相同的屬性配置 */ };
        proxyConfig['^/.*\\.(cfg|log|ico)'] = { /* 與上方相同的屬性配置 */ };
    }

    return {
        // ...其他設定
        server: {
            proxy: proxyConfig, // 啟用配置
        },
    };
});
```

## 3. 環境變數的配置 (`.env.development`)

透過環境變數檔案定義開發時所需的變數，使組員不需修改代碼即可切換測試目標：

```ini
# .env.development
# 可以是實際硬體 IP，或是 ASUS Router 預設域名
VITE_ROUTER_URL=http://192.168.50.1/
```

透過這些配置，開發者在本地端 (如 `http://localhost:5173`) 開發 Vue 3 畫面時，可以直接呼叫 `/appGet.cgi`，Vite 伺服器會自動無縫轉發至 `http://192.168.50.1/appGet.cgi`，解決了前後端分離在與 Legacy 設備串接時最常見的問題。