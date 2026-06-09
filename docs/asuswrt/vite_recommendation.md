# Vite 工作方式與開發流程最佳實踐建議

為了將 Vite 在 `vue3-wrt-project` 中的潛力發揮到極致，並確保整個團隊能在穩定、高效的環境中開發 ASUS 路由器的前端架構，我們針對「打包、檢查、測試與 Proxy 代理」提出以下最佳實踐。

## 1. Vite 打包與優化最佳實踐

1. **落實 Code Splitting (代碼分割) 原則**:
   - 目前在 `vite.config.ts` 中已經設定了 `manualChunks` 來將 Quasar、Vue 生態系統與業務邏輯分割。團隊成員在引入新的大型第三方套件時（如圖表庫 ECharts 等），應主動評估是否需在 `manualChunks` 加入新的獨立 Chunk。
   - 避免將所有資源打包進 `index.js`，這將嚴重影響設備端的初始載入速度。
2. **充分利用原生的 ESM 開發模式**:
   - 嚴格遵守 `import / export` 語法，盡量避免在專案中混用或寫出會被編譯為 CommonJS 的代碼，以確保 HMR (熱更新) 能在毫秒級完成。
3. **區分環境變數的用途**:
   - 打包指令應利用 `--mode` 來區別測試打包與生產打包。切忌將測試環境的變數（如 `VITE_ROUTER_URL`）打包進將被燒錄至路由器硬體中的生產版韌體內。

## 2. ESLint 檢查與格式化最佳實踐

1. **依賴 `lint` 腳本的雙層架構**:
   - 開發時與 CI/CD 流程中，應優先執行 `pnpm lint`（底層執行 `npm-run-all2 lint:oxlint lint:eslint`）。不要直接修改這個流程。
   - `Oxlint` 能以極快的速度捕捉基礎錯誤，減輕後續強型別檢查的負擔。
2. **遵守 Prettier 與 ESLint 職責分離**:
   - 格式問題（縮排、單雙引號）交給 Prettier 處理，語法錯誤與潛在 Bug 由 ESLint 捕捉。專案已配置 `eslint-config-prettier` 以避免規則衝突，請勿在 ESLint 中額外寫入排版相關配置。

## 3. 單元測試與 E2E 測試最佳實踐

1. **測試配置與 Vite 高度同步**:
   - 使用 Vitest 作為測試框架的優勢在於能直接共享 `vite.config.ts`。所有在 Vite 設定的 Alias 映射 (如 `@/`) 都會在測試中生效。
   - 在開發新功能組件時，建議一併撰寫對應的 `.test.ts` 檔。利用 Vitest 的 HMR，可以達成「改代碼即刻跑完測試」的 Test-Driven Development (TDD) 體驗。
2. **隔離 E2E 與 Unit Test**:
   - Unit 測試 (Vitest) 著重於單個函數或單個 Vue 組件在 `jsdom` 環境下的行為。
   - E2E 測試 (Playwright) 應著重於完整的「點擊 -> 發送 API -> 頁面跳轉」等整合流程。Playwright 的配置應獨立於 `e2e` 目錄，專注於整體使用體驗的驗證。

## 4. Dev Proxy Server 代理最佳實踐

1. **本地配置分離 (`.env.development`)**:
   - 不要把自己的開發設備 IP 寫死在代碼庫的 `vite.config.ts` 裡。請善用 `VITE_ROUTER_URL=http://192.168.x.x` 並放在本地的 `.env.development.local`，以防 Git 衝突。
2. **守護遺留系統的「容錯防線」**:
   - 關於 Node.js 處理舊設備 304 狀態碼崩潰的問題，`InsecureHttpAgent` 與 `stripConditionalHeaders` 是**不可移除的基礎防線**。
   - 團隊若需添加其他被攔截的 Proxy 路由規則，務必套用與 CGI API 相同的 `agent` 與 `configure` 設定。
3. **維持 Cookie Domain Rewrite**:
   - 開發時請一律使用 `localhost` 進行存取（不要用 `127.0.0.1`，因為部分 Cookie 設定可能對 IP 不兼容），以確保 Proxy 能成功將硬體回傳的 Session 綁定到開發者瀏覽器中。