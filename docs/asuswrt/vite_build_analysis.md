# Vite 打包流程分析報告

本報告針對 `vue3-wrt-project` 中的 Vite 構建流程 (`apps/web/vite.config.ts`) 進行深入分析，說明其配置功能、打包優化策略以及與專案需求的適配度。

## 1. 核心設定與伺服器代理 (Dev Server Proxy)

為了讓現代化的 Vite 開發環境能順利與舊版的 ASUS 路由器韌體溝通，配置中加入了複雜且具針對性的 Proxy 設定：

- **功能**: 將本地開發環境的 CGI 請求 (如 `/appGet.cgi`, `/applyapp.cgi`) 與部分靜態資源 (`.asp`, `.json`) 代理到實際的路由器 (`VITE_ROUTER_URL`)。
- **針對性修復 (`InsecureHttpAgent` & `stripConditionalHeaders`)**:
  - ASUS 路由器的 HTTPd 實作在處理 `If-None-Match` 或 `If-Modified-Since` (條件式請求) 時，會回傳 HTTP 304 狀態碼，但違規地附加了完整的 HTML Body。這會導致 Node.js 底層解析失敗 (`Parse Error: Expected HTTP/`)。
  - **解決方案**: Vite 配置中攔截了 `proxyReq` 事件，手動移除條件式請求標頭，強制路由器回傳 200 OK，並使用 `insecureHTTPParser: true` 來容忍不規範的 HTTP 回應。

## 2. 打包入口與輸出結構 (Rollup Options)

Vite 依賴 Rollup 進行生產環境的打包，專案中自訂了 `build.rollupOptions` 以符合特定的檔案結構需求：

- **入口檔案 (Input)**: 指定 `asus: resolve(__dirname, 'asus.html')` 作為入口。
- **輸出命名規則 (Output Names)**:
  - `entryFileNames`: 若 Chunk 名稱為 `asus`，則固定輸出為 `assets/asus.js` (去除 hash，方便舊系統整合)；其餘則加上 hash 以利快取。
  - `assetFileNames`: 透過正則表達式，自動將打包的資源分門別類存放到 `fonts/`、`assets/images/`、`assets/css/` 目錄下，確保輸出結構乾淨。

## 3. Chunk 大小調整與快取優化策略 (`manualChunks`)

為了避免單一 JS 檔案過大導致首屏載入過慢，專案配置了細緻的 `manualChunks` 拆分策略：

- **Vendor Chunks (第三方套件)**:
  - `vendor-quasar`: 獨立抽離 UI 框架 Quasar。
  - `vendor-vue-ecosystem`: 抽離 Vue 核心、Vue Router、Pinia、I18n 等生態系。
  - `vendor-axios`: 獨立 HTTP 客戶端。
  - `vendor`: 其餘 node_modules 套件。
- **業務邏輯 Chunks**:
  - `views-qis`: 首次設定精靈 (Quick Internet Setup) 相關頁面。
  - `views-main`: 路由器管理主介面。
  - `locales`: 語系翻譯檔。
- **優勢分析**: 這種拆分方式能最大化瀏覽器的 HTTP 快取效益。當業務邏輯修改時，使用者不需重新下載龐大的 `vendor` 檔案，有效提升了專案的載入效能。

## 4. 插件生態 (Plugins)

- `@vitejs/plugin-vue`: 支援 Vue SFC (單一檔案元件)。
- `@quasar/vite-plugin`: 整合 Quasar 框架，並配置了客製化的 `sassVariables` 路徑 (`../../packages/shared/src/assets/quasar-variables.scss`)。
- `vite-plugin-vue-devtools`: 增強開發體驗。

## 5. 總結

目前的 Vite 打包配置已經高度成熟，完美解決了前端新架構與後端舊版 HTTPd 伺服器整合的通訊痛點。在打包效能上，`manualChunks` 的策略非常合理，有效控制了 JS Chunk 大小，完全符合現代化開發標準與專案需求。