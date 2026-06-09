# Vite 打包與代碼檢查流程圖

本文檔使用 Mermaid.js 呈現 `vue3-wrt-project` 中 Vite 的打包流程 (開發與生產環境) 以及 JavaScript 代碼的合法性檢查流程。

## 1. Vite 打包與運行流程

### 1.1 開發環境 (Dev Server + Proxy)

這張圖展示了 Vite 開發伺服器如何啟動，以及它如何處理並代理對 ASUS 路由器後端的 CGI 請求，解決 304 狀態碼造成的 Node 解析錯誤。

```mermaid
sequenceDiagram
    participant Dev as 開發者 (Browser)
    participant Vite as Vite Dev Server (localhost)
    participant Proxy as HttpProxy (InsecureHttpAgent)
    participant Router as ASUS Router (VITE_ROUTER_URL)

    Dev->>Vite: 請求頁面 / HMR
    Vite-->>Dev: 回傳 Vue 元件 / 靜態資源

    Dev->>Vite: API 請求 (如 /appGet.cgi)
    activate Vite
    Vite->>Proxy: 攔截 CGI 請求
    activate Proxy
    Proxy->>Proxy: 觸發 'proxyReq' 事件<br/>移除 'If-None-Match'<br/>與 'If-Modified-Since' 標頭
    Proxy->>Router: 轉發請求 (無條件式標頭)
    activate Router
    Router-->>Proxy: 強制回傳 200 OK (含 Body)
    deactivate Router
    Proxy-->>Vite: 接收回應 (容忍 Insecure HTTP)
    deactivate Proxy
    Vite-->>Dev: 回傳 JSON / 資料
    deactivate Vite
```

### 1.2 生產環境打包流程 (Rollup Build)

這張圖說明了執行 `build:web` 時，Vite 底層的 Rollup 如何依據配置進行代碼分割 (Code Splitting)。

```mermaid
flowchart TD
    A[執行 pnpm build:web] --> B(Vite / Rollup 啟動)
    B --> C{讀取 vite.config.ts}
    
    C -->|Input| D(入口: asus.html)
    C -->|Plugins| E(套用 @vitejs/plugin-vue <br/> Quasar 等插件編譯 SFC)
    
    E --> F{manualChunks 代碼分割}
    F -->|包含 node_modules| G[Vendor Chunks]
    G --> G1(vendor-quasar)
    G --> G2(vendor-vue-ecosystem)
    G --> G3(vendor-axios)
    G --> G4(vendor-others)
    
    F -->|業務邏輯| H[App Chunks]
    H --> H1(views-qis)
    H --> H2(views-main)
    H --> H3(locales)
    
    G --> I(套用 Output 命名規則)
    H --> I
    
    I --> J((輸出至 dist/assets 目錄))
```

---

## 2. JavaScript 代碼合法性檢查流程

這張圖說明了在專案中，代碼如何經過雙引擎 Linter (Oxlint + ESLint) 以及 TypeScript (tsc) 的層層把關。

```mermaid
flowchart LR
    A([開發者撰寫/修改代碼]) --> B{提交前或執行 pnpm lint}
    
    subgraph 第一道防線：極速語法掃描
        B --> C[Oxlint]
        C -->|發現語法錯誤/無效變數| D((阻擋並提示修正))
    end
    
    subgraph 第二道防線：深度邏輯與規範檢查
        C -->|Oxlint 通過| E[ESLint Flat Config]
        E --> F1(@vue/eslint-config-typescript)
        E --> F2(eslint-plugin-vue)
        E --> F3(eslint-plugin-playwright)
        
        F1 --> G{是否符合規範?}
        F2 --> G
        F3 --> G
        G -->|否| D
    end
    
    subgraph 第三道防線：型別與風格
        G -->|是| H[TypeScript tsc 類型檢查]
        H -->|發現型別不符| D
        H -->|通過| I[Prettier 自動格式化]
    end
    
    I --> J([代碼合法，允許合併/打包])
```