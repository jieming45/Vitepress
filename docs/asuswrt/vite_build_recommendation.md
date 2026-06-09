# Vite 打包流程與 JS 合法性檢查最佳調整建議

基於對 `vue3-wrt-project` 中 `vite.config.ts` 與 Linting 工具鏈的深入分析，目前專案的配置已相當完善，尤其是對舊版路由器 HTTP 協定的代理處理與 `manualChunks` 代碼分割都非常專業。以下提供進階的最佳實踐與調整建議，以確保專案能應對未來的擴充與效能要求。

## 1. Vite 打包流程最佳調整建議

### 1.1 PWA (Progressive Web App) 與 Service Worker 預先快取
- **現狀**: 目前 `manualChunks` 已經完美拆分了代碼，但每次載入仍需依賴瀏覽器的 HTTP 快取策略。
- **建議**: 針對路由器的 Web UI 特性（使用者可能會頻繁訪問管理介面），強烈建議引入 `vite-plugin-pwa`。
  - **優勢**: 透過 Service Worker，可以將 `vendor-quasar`, `vendor-vue-ecosystem` 等幾乎不變的第三方核心程式碼安裝到使用者的 Cache Storage 中。即使網路連線不穩定，UI 也能瞬間呈現 (Offline First 體驗)。

### 1.2 資源壓縮 (Compression)
- **現狀**: 路由器本身的儲存空間與頻寬通常有限，傳輸未經壓縮的 JS/CSS 會拖慢首屏載入速度。
- **建議**: 引入 `vite-plugin-compression`。
  - **設定**: 針對 `.js`, `.css`, `.svg` 資源生成 `gzip` 或 `brotli` 格式。若 ASUS HTTPd 支援傳輸壓縮檔案，這將能讓檔案體積大幅縮小 (通常能縮小 60-70%)。

### 1.3 `manualChunks` 的動態化管理
- **現狀**: 目前 `manualChunks` 內有多個 `if (id.includes('...'))` 判斷式。隨著專案增長，這裡會變得冗長。
- **建議**: 可以將 Vendor 列表抽離為設定檔，或是針對特定大小的依賴包使用更智慧的分割套件 (如 `rollup-plugin-visualizer` 產出報表後再決定)。

## 2. JavaScript 代碼合法性檢查最佳調整建議

### 2.1 引入 Git Hooks (Husky + lint-staged)
- **現狀**: 目前依賴開發者自覺執行 `pnpm lint` 或在 CI/CD 中進行檢查。
- **建議**: 配置 `husky` 與 `lint-staged`。
  - **執行邏輯**: 在 `git commit` 被觸發時，自動對「這次有修改的檔案」執行 `oxlint`, `eslint` 與 `prettier`。
  - **優勢**: 避免不合法的代碼被推送 (Push) 到遠端倉庫，強制所有成員遵守專案規範，並節省 CI 伺服器的運算資源。

### 2.2 強化 TypeScript 的嚴格模式 (Strict Mode)
- **現狀**: 在 `tsconfig.json` 中，TypeScript 已經啟用了推薦配置。
- **建議**: 檢視並確保 `tsconfig.json` 中的 `compilerOptions.strict` 為 `true`，並特別檢查以下屬性：
  - `noImplicitAny: true`：防止任何未明確定義型別的變數。
  - `strictNullChecks: true`：確保 API 回傳可能為 `null` 或 `undefined` 時，在 Store 或 Vue 組件中被正確處理 (Fallback)。
  - 這對於從原生 JS 重構過來的專案尤為重要，能徹底消除執行期的 Null Reference Exception。

### 2.3 統一編輯器設定 (VS Code Settings)
- **現狀**: `eslint.config.ts` 與 Prettier 已經設置完畢。
- **建議**: 確保 `.vscode/settings.json` 與 `.vscode/extensions.json` 已經提交到 Git 儲存庫。
  - 設定 `"editor.formatOnSave": true` 以及預設 Formatter 為 Prettier。
  - 設定 `"editor.codeActionsOnSave": { "source.fixAll.eslint": true }`。
  - 這樣能確保新加入的團隊成員，不需要任何設定就能「開箱即用」合法性檢查工具，實現「開發即檢查」的流暢體驗。