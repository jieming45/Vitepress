# Vite 打包流程與 JS 合法性分析 (NotebookLM 來源素材)

> **使用說明**：請將以下全部文字複製並貼上 / 上傳至 Google NotebookLM 作為「來源 (Source)」，然後在 NotebookLM 的對話框中要求它為您生成簡報講稿、FAQ 或 Podcast 摘要。

---

## 1. 專案重構背景與目標
- **背景**: 團隊正將舊版 ASUS Router Web UI 遷移至 Vue 3 現代化前端架構。
- **目標**: 全面分析 Vite 打包流程與 JavaScript / TypeScript 代碼合法性檢查機制，確保開發體驗流暢、打包效能最佳化，且完全符合專案與現代化標準。
- **技術棧**: Vue 3 (Composition API), Quasar, Vite, TypeScript, Pinia, Oxlint, ESLint, Prettier。

## 2. Vite 打包流程與伺服器代理 (Proxy) 分析
為了相容 ASUS 路由器舊版 HTTPd 伺服器，專案在 Vite 的開發環境做了極具針對性的配置：
- **痛點**: 舊版 HTTPd 在處理條件式請求 (`If-None-Match`) 時，會回傳 HTTP 304 狀態碼卻違規附帶完整 HTML Body，導致 Node.js 解析崩潰 (`Parse Error`)。
- **解決方案**: 
  1. 實作自訂的 `InsecureHttpAgent`，容忍非標準 HTTP 回應。
  2. 攔截 `proxyReq`，強制移除條件式請求標頭，確保路由器永遠回傳 200 OK 狀態。

## 3. Rollup 打包優化與 Chunk 大小調整
Vite 底層使用 Rollup 進行生產環境打包，專案對輸出檔名與 Chunk 大小進行了精細的拆分 (`manualChunks`)：
- **入口與輸出**: 固定入口為 `asus.html`，靜態資源依類型 (`fonts`, `images`, `css`) 分門別類。
- **代碼分割策略 (Code Splitting)**:
  - **第三方依賴 (Vendors)**: 拆分為 `vendor-quasar`、`vendor-vue-ecosystem`、`vendor-axios`。
  - **業務邏輯**: 拆分為 `views-qis` (初次設定) 與 `views-main` (主畫面)。
  - **優勢**: 模組化拆分最大化了瀏覽器 HTTP 快取效益，更新業務代碼時，用戶不需重新下載龐大的核心框架，大幅提升載入速度。

## 4. JS/TS 代碼合法性檢查 (Linting & Formatting)
本專案採用了「雙引擎 Linter」搭配 TypeScript 的三層防禦架構：
- **第一層：極速掃描 (Oxlint)**: 使用 Rust 編寫的 Oxlint，在毫秒級內捕捉基本語法錯誤與無效變數。
- **第二層：深度規範 (ESLint Flat Config)**: 負責 Vue 語法糖、E2E 測試 (Playwright) 與 TypeScript 的進階規範檢查，防止潛在邏輯錯誤。
- **第三層：型別與風格 (TypeScript & Prettier)**: `vue-tsc` 在打包前進行嚴格型別檢查，杜絕執行期 Runtime Error；Prettier 則負責統一全團隊程式碼風格 (Clean Code)。

## 5. 未來優化與最佳調整建議
根據分析結果，提出以下能進一步提升效能與開發體驗的最佳實踐：
- **前端打包效能優化**:
  1. **引入 PWA / Service Worker**: 預先快取 (Pre-cache) 不常變動的 `vendor` 檔案，實現幾乎零延遲的 Offline First 載入體驗。
  2. **資源壓縮 (Compression)**: 針對打包後的 JS/CSS 啟用 Gzip/Brotli 壓縮插件，降低路由器頻寬壓力。
- **代碼合法性檢查優化**:
  1. **導入 Git Hooks (Husky + lint-staged)**: 在 `git commit` 時自動對「修改過的檔案」執行 Linter，防止瑕疵代碼推送到遠端倉庫。
  2. **強化 TS 嚴格模式**: 確保啟用 `strictNullChecks`，徹底根除 Null Reference 錯誤。
  3. **統一 VS Code 設定**: 提交 `.vscode/settings.json` 以確保團隊成員享有「儲存即自動格式化」的無縫體驗。

## 6. 總結
本專案的 Vite 配置完美克服了新舊架構交替時的網路通訊障礙，且其打包分割策略非常精準。搭配目前業界頂規的 Oxlint + ESLint 雙引擎檢查機制，不僅保障了程式碼品質，也為未來的迭代開發提供了安全、穩定的基石。