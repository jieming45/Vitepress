# 任務：自動化遷移與驗證 `vue3-wrt-project` Login 流程與安全防護矩陣

## 1. 任務核心目標與背景 (Core Objective & Context)

- **目標：** 將舊專案的登入邏輯（位於 `C:\Users\Jieming\Documents\GitHub\www\sysdep\FUNCTION\UI4\Main_Login.asp`）完整萃取，並精準遷移至 Vue 3 專案中的共用組件庫（目標檔案：`C:\Users\Jieming\Documents\GitHub\vue3-wrt-project\packages\shared\src\views\Login.vue`），同時建立針對登入流程的端到端 (E2E) 與單元測試防護網。
- **背景：** Login 是系統的第一道安全防線。除了基本的帳密驗證，本次遷移需嚴格確保舊版的安全機制（如：密碼規則、錯誤次數累計、CAPTCHA 圖形驗證觸發機制、防暴力破解的冷卻倒數計時器）被完美移植到現代化的 Vue 3 (Composition API + TypeScript) 架構中，且 UI/UX 狀態切換流暢、錯誤提示精準。

---

## 2. 操作環境與可用工具 (Environment & Tools)

- **舊專案參考路徑 (Legacy ASP)：** `C:\Users\Jieming\Documents\GitHub\www\sysdep\FUNCTION\UI4\Main_Login.asp`
- **新專案目標路徑 (Vue 3 Target)：** `C:\Users\Jieming\Documents\GitHub\vue3-wrt-project\packages\shared\src\views\Login.vue`
- **專案根目錄（指令執行點）：** `C:\Users\Jieming\Documents\GitHub\vue3-wrt-project`
- **技術棧：** Vue 3, Vite, Vitest/Playwright/Cypress, TypeScript, Pinia。
- **可用指令（請於新專案根目錄執行）：**
- **型別檢查：** `npm run type-check` 或 `npx tsc --noEmit`
- **單元/組件測試：** `npm run test:unit` 或 `npx vitest run`
- **E2E 流程測試：** `npm run test:e2e`

---

## 3. 自主執行步驟與自我修正引導 (Autonomous Workflow - LOOP)

請依序循環執行以下步驟。**注意：若在任何步驟遇到報錯（型別錯誤、狀態機不同步、倒數計時失效、或測試斷言失敗），請啟動自我修正機制：讀取 Error Log ➔ 分析前端組件/狀態機失敗原因 ➔ 修改程式碼或測試腳本 ➔ 再次執行驗證，直到完全通過。**

```text
 ┌────────────────────────────────────────────────────────┐
 │ 步驟一：舊版邏輯萃取與狀態機設計 (Analyze Legacy & State)│
 └───────────────────────────┬────────────────────────────┘
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │ 步驟二：實作 Login UI 組件與防護邏輯 (Implement Vue 3) │
 └───────────────────────────┬────────────────────────────┘
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │ 步驟三：實作邊界測資與流程測試 (E2E & Unit Test Matrix)│
 └───────────────────────────┬────────────────────────────┘
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │ 步驟四：自動驗證與修復 (Auto-Verification & Hotfix)  │
 └───────────────────────────▲────────────────────────────┘
                             │ (若有 Fail 則修正並重跑)
                             └──────── 測試是否 100% Pass?

```

### 步驟一（舊版邏輯萃取與狀態機設計）

1. 讀取並分析 `C:\Users\Jieming\Documents\GitHub\www\sysdep\FUNCTION\UI4\Main_Login.asp`。
2. 盤點以下核心規則並記錄於腦中或暫存檔：

- **密碼規則：** 長度限制、允許/阻擋的特殊字元。
- **錯誤閾值 A (CAPTCHA)：** 連續輸入錯誤達 `X` 次時，需顯示 CAPTCHA。
- **錯誤閾值 B (冷卻鎖定)：** 連續輸入錯誤達 `Y` 次時，觸發冷卻時間限制。
- **API 規格：** 解析舊版送出登入、驗證 CAPTCHA、以及錯誤回傳的 Payload/Response 結構。

3. 在 Vue 3 專案中設計對應的狀態管理（如 `loginStore` 或組件內的 `ref`/`reactive` 狀態機）。

### 步驟二（實作 Login UI 組件與防護邏輯）

鎖定並修改目標檔案 `packages/shared/src/views/Login.vue` 及其相關組件，必須實現以下機制：

- **基礎登入與錯誤提示：** 實作帳密輸入框。當密碼規則不符或後端回傳錯誤時，需即時在 UI 顯示對應的**錯誤提示字串 (Error Messages)**。
- **CAPTCHA 動態顯示：** 當錯誤次數達到閾值，透過 `v-if`/`v-show` 顯示 CAPTCHA 輸入框與圖片/驗證碼組件，並實作刷新機制。
- **冷卻倒數計時 (Cooldown UI)：** 當錯誤次數達到鎖定閾值，需禁用登入按鈕與輸入框，並在畫面上渲染「剩餘倒數時間 (如：請等待 59 秒後再試)」。需妥善處理 `setInterval` 資源釋放 (onUnmounted) 及跨頁面/重新整理時的狀態保持（可搭配 LocalStorage 或 Store）。

### 步驟三（實作邊界測資與流程測試）

針對 `packages/shared/src/views/Login.vue` 撰寫單元測試與 E2E 測試，必須涵蓋以下矩陣：

- **情境 A：正常登入流程**
- 輸入正確帳密 ➔ 驗證成功 ➔ 路由跳轉至 Dashboard。

- **情境 B：密碼規則與基礎錯誤驗證**
- 驗證長度不足、非法字元時，UI 是否正確阻擋並顯示紅色警告字串。
- 輸入錯誤帳密 ➔ 檢查是否正確顯示 API 定義的錯誤訊息。

- **情境 C：CAPTCHA 觸發與驗證流程**
- 模擬連續 `X` 次登入失敗 ➔ 斷言 CAPTCHA 區塊是否成功渲染 (DOM visible)。
- 輸入包含帳/密/CAPTCHA 的資料 ➔ 驗證 CAPTCHA 錯誤時的提示 ➔ 驗證成功時的跳轉。

- **情境 D：暴力破解防護與冷卻倒數機制**
- 模擬連續 `Y` 次登入失敗 ➔ 斷言輸入框與 Submit 按鈕進入 `disabled` 狀態。
- 驗證畫面上是否出現倒數計時文字，且數字隨時間遞減。
- 倒數歸零後 ➔ 斷言 UI 狀態恢復，可重新進行輸入與登入。

### 步驟四（自動化驗證）

1. 在終端機執行型別檢查 (`npx tsc --noEmit`)。
2. 執行 Login 專屬測試命令。讀取錯誤 Stack Trace，特別留意：非同步倒數計時是否導致測試 Timeout、CAPTCHA 狀態機是否因組件重繪而遺失。持續修正邏輯，直到所有測資亮綠燈。

---

## 4. 自動化觀測與驗證機制 (Observation & Verification)

你必須透過以下兩個步驟來確認你的行動結果：

1. **靜態檢查：** 執行 `npx tsc --noEmit` 或 `npm run type-check`。終端機不可輸出任何 TypeScript 型別錯誤（確保 Vue 組件與 Store 的型別安全）。
2. **動態測試：** 檢視測試報告，確保登入狀態機 (Normal ➔ Warning ➔ CAPTCHA Required ➔ Locked/Cooldown ➔ Normal) 的每一次轉換都具備完整的 DOM 狀態斷言。

---

## 5. 完成定義 (Definition of Done, DoD)

當滿足以下所有條件時，方可回報任務完成：

- [ ] 舊版 `Main_Login.asp` 的所有核心防護邏輯已 100% 移植至 `packages/shared/src/views/Login.vue`。
- [ ] `npx tsc --noEmit` 檢查 100% 無錯誤。
- [ ] 所有 Login 相關之單元與 E2E 測試案例皆 **100% Pass**。
- [ ] **測試矩陣完整覆蓋以下 6 種關鍵情境：**

1. **【密碼規則校驗】** 針對過短、過長、特殊符號等不合法輸入，能在前端第一時間阻擋並顯示精確的提示字串。
2. **【一般錯誤提示】** 帳號或密碼輸入錯誤時，UI 上能清晰顯示對應的紅字錯誤訊息。
3. **【CAPTCHA 觸發】** 精準控制錯誤次數，達標時動態顯示 CAPTCHA 欄位與圖片，並驗證其刷新邏輯。
4. **【CAPTCHA 驗證】** 帶有 CAPTCHA 的登入請求，能正確處理驗證碼輸入錯誤與成功的不同回饋。
5. **【冷卻時間倒數 (Lockout Countdown)】** 錯誤次數達上限後，成功觸發鎖定機制（Input/Button Disabled），UI 顯示準確的倒數計時，且倒數結束後能自動解除鎖定。
6. **【狀態重置 (State Reset)】** 驗證在登入成功，或是冷卻時間結束後，錯誤次數、錯誤訊息提示等狀態皆能正確清空歸零。
