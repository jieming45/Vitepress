# Vite 核心工作方式與 Dev Proxy Server 分析報告

## 1. Vite 的核心工作方式分析

Vite 是一個現代化的前端構建工具，其核心理念為「快速冷啟動」與「即時模組熱更新 (HMR)」。

### 1.1 開發伺服器 (Dev Server)
- **原生 ESM 驅動**: Vite 在開發階段不對源代碼進行全量打包，而是直接利用瀏覽器原生的 ES Module (ESM) 支援。當瀏覽器請求特定模組時，Vite Dev Server 才會動態編譯並提供該模組，實現了近乎瞬間的冷啟動。
- **依賴預構建 (Dependency Pre-bundling)**: Vite 使用 esbuild 將 CommonJS / UMD 格式的依賴項預先轉換為 ESM 格式，並將多個內部模組依賴合併為單一模組，減少瀏覽器的網路請求數量，提升載入速度。

### 1.2 模組熱更新 (HMR)
- **精確更新**: 藉由原生 ESM 的特性，Vite 的 HMR 僅更新被修改的模組及其直接依賴，不受專案整體規模的影響，讓更新速度保持在毫秒級。
- **無縫替換**: 結合 Vue 的單文件組件 (SFC)，修改樣式或模板能夠在不丟失當前組件狀態的情況下即時反映在瀏覽器上。

### 1.3 生產編譯過程 (Production Build)
- **Rollup 打包**: 在生產環境中，Vite 使用 Rollup 進行打包，以確保輸出高度優化的靜態資源（支援 Tree-Shaking、代碼分割等）。在當前專案中，也對 Rollup 的 `manualChunks` 進行了細緻配置，將第三方依賴 (vendor)、路由頁面分割成獨立的 chunk，有助於瀏覽器快取。

---

## 2. Vite Dev Proxy Server 運作分析 (針對 vue3-wrt-project)

在現代前端開發中，與後端 API 交互時常遇到跨域 (CORS) 問題。Vite 提供了內建的 proxy 伺服器代理機制，攔截前端向特定路徑發出的請求，將其轉發至後端伺服器。

在 `vue3-wrt-project/apps/web/vite.config.ts` 的配置中，針對 ASUS 路由器的傳統 Web UI 及硬體設備，我們特別設計了以下的代理策略：

### 2.1 請求轉發機制與目標端點
專案的代理目標 (`VITE_ROUTER_URL`) 預設指向硬體路由器 `http://www.asusrouter.com/`。主要的轉發對象包含：
- **CGI 接口**: `/appGet.cgi`, `/apply.cgi`, `/login.cgi` 等（用於狀態獲取與路由器設置）。
- **舊版頁面與資源**: `*.asp` (傳統 WebUI 頁面)、`*.json` (狀態數據)、以及路由器輸出的 `*.cfg`, `*.log`, `*.ico`。
- **特定資源驗證**: 例如 `/captcha.gif` 驗證碼圖片需要帶著 session cookie 轉發至設備端，否則會收到 Vite 回傳的 `index.html`。

### 2.2 跨域與身份驗證支援
- **`changeOrigin: true`**: 隱藏本機的來源，讓目標伺服器認為請求是直接發給它的，避免被目標伺服器的跨域防護阻擋。
- **`cookieDomainRewrite: 'localhost'`**: 確保設備端回傳的認證 Cookie 能夠正確地寫入開發者的瀏覽器 `localhost` 中，使登入狀態與 Session 能夠維持。
- **`Referer` 欺騙**: 在發送請求時手動加上 `Referer: routerUrl`，以繞過某些簡單的跨站請求偽造 (CSRF) 檢查或路由器內建的來源驗證。

### 2.3 針對非標準 HTTP 回應的硬體相容處理 (Critical)
ASUS 路由器內嵌的 `httpd` 存在不符合標準 HTTP 規範的行為：
> 當收到帶有條件式標頭 (`If-None-Match` 或 `If-Modified-Since`) 的請求時，設備會回傳 `304 Not Modified`，但卻**違規附帶了完整的 HTML Body**。Node.js 的原生 HTTP 解析器會將這個未預期的 Body 視為下一個回應的開頭，從而導致 "Parse Error" 讓 Proxy 伺服器崩潰。

為了解決此硬體遺留問題，專案採取了兩層防禦機制的配置：
1. **移除條件請求標頭 (`stripConditionalHeaders`)**: 攔截 Proxy 請求事件 (`proxyReq`)，主動移除 `if-none-match` 和 `if-modified-since`，強迫路由器每次都回傳 `200 OK`，避免觸發帶有 Body 的 304 錯誤。
2. **開啟 `insecureHTTPParser`**: 自定義 `InsecureHttpAgent` (繼承自 `http.Agent`) 並開啟 `insecureHTTPParser = true`，提升 Node.js 解析器對其他可能的非標準或舊式 HTTP 回應格式的容錯能力。