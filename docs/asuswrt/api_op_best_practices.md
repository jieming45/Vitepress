# Vite 工作方式與 Dev Proxy Server 最佳實踐建議

基於我們對 Vite 核心工作原理以及本專案 (`vue3-wrt-project`) 中 Dev Proxy 的分析，為確保團隊能夠最大化地利用 Vite 的特性，並優化前後端的開發流程與專案性能，提出以下最佳實踐建議：

## 1. Vite 開發階段的最佳實踐

### 1.1 遵循 ESM 規範與依賴管理
- **避免直接使用 CommonJS**: 由於 Vite 在開發模式下依賴瀏覽器的原生 ESM，請確保自己編寫的代碼均使用 `import / export` 語法。
- **最佳化依賴引入**: 避免全量引入大型 UI 庫（目前 Quasar 配合 Vite Plugin 已支援按需引入）。這可以顯著降低 esbuild 在「依賴預構建 (Pre-bundling)」階段的耗時。

### 1.2 狀態與熱更新 (HMR) 維護
- **保持組件純粹性**: 為了讓 HMR 能夠無縫熱替換且不遺失狀態，請確保 Vue 組件內的狀態 (如 `ref`, `reactive`) 沒有不必要的全域副作用。如果使用了全域事件監聽，務必在 `onUnmounted` 階段清理。
- **避免更改配置檔的頻繁重啟**: 修改 `vite.config.ts` 或 `.env` 會導致 Vite Dev Server 完整重啟。團隊應將可變的測試參數盡量從設定檔中抽離，或者統一定義好之後再行開發。

## 2. Dev Proxy Server 的最佳實踐

### 2.1 代理規則的細化與範圍控制
- **精準匹配 API 路徑**: 在 `vite.config.ts` 中，使用具體的路由陣列或精確的正則表達式（如 `['/appGet.cgi', '/apply.cgi']` 或 `^/.*\\.json`）來配置代理，避免使用過於泛用的通配符（如 `/`），以免誤將本地靜態資源或路由組件攔截轉發至後端。
- **環境變數抽離目標地址**: 維持透過 `.env.development` 變數 (`VITE_ROUTER_URL`) 控制代理目標的做法。團隊成員可以各自配置自己的硬體測試 IP（如 `http://192.168.50.1/`），不需修改源碼，降低 Git 衝突風險。

### 2.2 網路請求行為與安全
- **維持 Cookie 與登入狀態**: 目前已採用 `cookieDomainRewrite: 'localhost'`，請團隊確保開發時使用 `localhost` 而非 `127.0.0.1` 訪問 Dev Server，以保證路由器回傳的 Cookie 能正確綁定並攜帶在後續請求中。
- **模擬真實 Referer**: 由於硬體設備可能有簡單的防禦機制，繼續維持在 Proxy Headers 中注入 `Referer: routerUrl` 是必要的，這能保證開發環境發出的請求被路由器視為合法。

### 2.3 針對遺留系統 (Legacy 設備) 的容錯機制
- **保留硬體容錯設定**: `vite.config.ts` 內處理了 ASUS 路由器 304 狀態碼帶 Body 導致 Node.js `Parse Error` 的問題。請將 `InsecureHttpAgent` 及移除 `if-none-match` / `if-modified-since` 的邏輯視為**核心不可移除的基礎建設**。未來若新增其他代理規則，務必套用相同的 `configure: stripConditionalHeaders` 及 `agent: insecureAgent` 屬性。
- **日誌追蹤**: 建議在 Proxy 配置的 `configure` 事件中加入簡單的日誌攔截（例如監聽 `proxyRes` 或 `error` 事件），當設備未回應或回應異常時，能第一時間在終端機輸出錯誤，幫助團隊迅速定位是前端問題還是設備當機。

## 3. 生產打包 (Production Build) 最佳實踐
- **Chunk 分割策略 (Code Splitting)**: 專案目前已經配置了細緻的 `manualChunks`。請團隊在後續新增依賴或模組時，定期檢查 Rollup 輸出的 chunk 大小。若單個 JavaScript 檔案超過 500KB，應考慮進一步在 `manualChunks` 中將其剝離，或是利用 Vue Router 的 `defineAsyncComponent` 進行動態加載。
- **環境隔離**: 確認 Proxy 的所有機制僅存在於 `mode === 'development'` 區塊內。在生產環境下（放置於路由器硬體中運行），API 請求與前端代碼處於同源狀態，不需要且不應包含任何 Proxy 相關的代理與容錯邏輯。