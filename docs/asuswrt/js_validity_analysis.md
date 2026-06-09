# JavaScript / TypeScript 代碼合法性分析報告

本報告針對 `vue3-wrt-project` 中用來確保 JavaScript/TypeScript 代碼語法正確、符合專案規範與型別安全的檢查機制進行分析。

## 1. 靜態分析與 Linter 架構

本專案採用了「雙引擎」的 Linter 架構來兼顧檢查速度與深度。在 `package.json` 中的 `lint` 指令為：`run-s lint:oxlint lint:eslint`。

### 1.1 Oxlint (`lint:oxlint`)
- **功能**: 使用以 Rust 編寫的 `oxlint` 進行第一階段的語法與錯誤檢查。
- **配置**: 依賴 `.oxlintrc.json` 規則。
- **優勢**: 檢查速度極快，能瞬間捕捉語法錯誤、未使用的變數等基本錯誤，作為第一層的快速防線，大幅縮短開發者的等待時間。

### 1.2 ESLint (Flat Config 架構)
- **功能**: 採用最新的 ESLint Flat Config 格式 (`eslint.config.ts`)，進行更深入的 Vue、TypeScript 以及專案特定規範的檢查。
- **核心套件與規則**:
  - `@vue/eslint-config-typescript`: 整合 TypeScript 的類型檢查規範。
  - `eslint-plugin-vue`: 針對 Vue 單一檔案組件 (.vue) 提供如 `v-model` 使用、`setup` 語法糖的合法性檢查。
  - `eslint-plugin-playwright` / `@vitest/eslint-plugin`: 確保 E2E 測試與單元測試代碼的合法性。
  - `eslint-config-prettier`: 關閉與 Prettier 衝突的規則，確保程式碼風格 (Formatting) 與 Linter (Linting) 職責分離。
- **優勢**: 提供了細緻且強大的業務邏輯級別語法檢查。

## 2. 型別安全與 TypeScript (tsc)

- **功能**: 作為 Vue 3 Composition API 的基石，確保所有的變數、API 請求與回傳資料、元件 Props / Emits 在編譯期間型別正確。
- **配置**: 透過 `tsconfig.json`, `tsconfig.node.json` 以及 `@vue/tsconfig`。
- **運行方式**: 除了在 IDE (如 VS Code 搭配 Vue Volar) 即時提示型別錯誤外，打包過程 `build:web` (呼叫 `vue-tsc --noEmit` 或 Vite build) 時會嚴格檢查。若介面或參數類型不匹配 (例如 API 回傳的欄位有變更卻未更新 Interface)，編譯將直接失敗。

## 3. 代碼風格自動格式化 (Prettier)

- **功能**: 保持 Clean Code 原則，統一全團隊的程式碼風格。
- **指令**: `prettier --write --experimental-cli "packages/**" "apps/**"`。
- **邏輯處理**: 確保縮排、引號、結尾逗號等格式一致，降低 Code Review 的溝通成本。

## 4. 分析總結與專案需求對比

當前專案的 JS/TS 檢查機制達到了業界最高標準：
1. **速度與準確度的平衡**: 先用 Oxlint 秒速掃描，再用 ESLint Flat Config 進行深度檢查。
2. **全面的生態系覆蓋**: 從主程式 (Vue)、型別 (TS) 到測試檔 (Vitest, Playwright)，皆有對應的 Plugin 把關。
3. **符合型別安全約束**: 嚴格的 TS 配置確保了在處理 API 請求、Store State 與 Props/Emits 時不會產生預期外的執行期 (Runtime) 錯誤。