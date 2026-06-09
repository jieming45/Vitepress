# Vite 工作方式與 Dev Proxy Server 總結與建議

經過對 `vue3-wrt-project` 中 Vite 的架構與 Dev Proxy 伺服器的深度分析，我們總結了其核心機制並提出了相應的優化建議，幫助團隊在從舊版架構遷移至 Vue 3 現代化開發流程時，能達到最佳的開發體驗與穩定的硬體相容性。

## 1. 核心總結

1. **Vite 賦能現代化開發體驗**: 
   - 透過原生 ESM 與預構建技術，Vite 大幅縮短了專案啟動時間。
   - 依賴單文件組件的 HMR (熱更新)，開發者可以更流暢地調試樣式與狀態，擺脫了以往 jQuery / 原生 JS 時代繁重的全局刷新。
2. **Dev Proxy 的關鍵橋樑角色**:
   - 由於開發環境 (`localhost`) 與目標硬體路由器 (如 `192.168.50.1`) 存在跨域問題，Vite 的 Dev Proxy 完美地承擔了請求轉發的角色。
   - 不只是單純的轉發，更藉由 Cookie 域名重寫與 Referer 偽裝，解決了複雜的身份驗證阻擋。
3. **針對硬體遺留 (Legacy) 系統的深度相容**:
   - 路由器舊版 httpd 的 `304 狀態碼違規附帶 Body` 問題，是傳統前端工具少見的挑戰。
   - 專案透過自訂 Node.js 的 `InsecureHttpAgent` 及移除條件請求標頭 (`if-none-match`, `if-modified-since`) 的兩層防禦，成功穩定地接起了本地端與設備間的橋樑。

## 2. 給團隊的開發建議

- **遵守現有 Proxy 護欄**: 團隊在新增任何 API 請求或開發新功能模塊時，應直接透過相對路徑（如 `/appGet.cgi`）發起請求，放心地交由 Vite Proxy 處理。請勿在代碼中寫死後端 IP 或硬體域名，也切勿移除 `vite.config.ts` 中的容錯機制 (`InsecureHttpAgent` 與 `stripConditionalHeaders`)。
- **配置分離與本地化**: 確保使用 `.env.development` 來自定義測試路由器的目標 IP。將代碼邏輯與環境配置解耦，確保跨團隊合作與 CI/CD 流程的順暢。
- **組件狀態與 HMR**: 充分享受 Vite 的熱更新優勢，但同時在編寫 Vue 3 Composition API 時，要有良好的副作用清理習慣 (`onUnmounted`)，避免因狀態污染導致開發中需要頻繁手動重整瀏覽器。
- **持續監控打包體積**: 雖然 Vite 開發體驗極佳，但團隊應時刻關注 Rollup 在生產構建 (`build`) 時輸出的 chunk 體積，配合 `manualChunks` 確保首屏載入速度達到最佳化。

透過這套完整的分析與最佳實踐準則，團隊將能夠在 `vue3-wrt-project` 中最大化 Vite 帶來的效能紅利，穩健且高效地完成舊版 Web UI 向現代化 Vue 3 架構的遷移任務。