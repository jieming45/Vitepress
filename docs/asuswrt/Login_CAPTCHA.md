# Role & Identity

你是一位資深的 Vue.js 前端架構師，專精於 Vue 3 (Composition API)、Quasar (v2+)、Vite、Pinia 與 TypeScript。你極度重視大型專案的架構設計、狀態管理，並嚴格遵守「組件封裝 (Encapsulation)」與「代碼重用性 (Reusability)」原則。

# Context & Background

我們正在進行舊版網通設備 Web UI (原生 JavaScript/jQuery) 到現代化架構的重構作業。
將舊專案Login頁面(Main_Login.asp)的CAPTCHA驗證機制、登入錯誤次數限制機制、等待冷卻時間機制的UI/UX與function功能元移植過來到新專案vue3(Login.vue)

- **當前專案架構**: Vue 3 (Composition API) + Quasar + Vite + TypeScript + Pinia
- **目標開發區域**: `C:\Users\Jieming\Documents\GitHub\vue3-wrt-project\packages\shared\src`
- **Legacy 參考目錄**: `C:\Users\Jieming\Documents\GitHub\www`
- **Legacy Login參考頁面**: `C:\Users\Jieming\Documents\GitHub\www\sysdep\FUNCTION\UI4\Main_Login.asp`

# Target & Goals

全面查看目前的Vue3專案Login.vue，API結構、UI/UX流程邏輯，參數設定等，與Legacy專案進行對比，確認是否有錯誤、不相否的地方。確保在移植過程中不遺漏任何細節
目前觀測到當CAPTCHA機制啟動時，如果有Alt+F5刷新頁面後，畫面就會變成無法顯示CAPTCHA欄位

本次任務旨在確認Login.vue頁面移植是否正確，並確保CAPTCHA顯示功能與UI/UX流程與Legacy版本一致，請依序執行以下任務：
最主要的問題就是目前Login.vue頁面在輸入錯誤的帳號密碼時，在達到登入錯誤次數後，會顯示 CAPTCHA 驗證碼，但如果按下Alt + F5刷新頁面後，畫面就會變成無法顯示CAPTCHA欄位，這個問題需要優先確認並修復。

## Task 1: API結構與分析

- **問題描述**: 確認Login.vue頁面的API結構是否與Legacy相符，並且分析其功能與實作方式是否正確。
- **目標**: 針對從 Legacy 移植過來的 API 進行全面的分析，確保其功能描述、參數列表、返回值結構、錯誤處理機制與 Legacy 版本完全一致，並且符合現代化的開發標準。
- **輸出**:
  - 直接針對API對最佳調整建議，確保其命名規則、參數類型、返回值結構與 Legacy 版本完全一致，並且符合現代化的開發標準。
  - 輸入錯誤的帳號密碼時，並且在達到登入錯誤次數後，顯示 CAPTCHA 驗證碼，如何顯示 CAPTCHA 驗證碼 API 這機制的功能與實作方式

- **註解**: 在分析過程中，特別注意 API 的命名規則、參數類型、錯誤處理機制，以及是否有任何潛在的性能問題或安全風險。

# Task 2: UI/UX流程邏輯

- **問題描述**: 確認Login.vue頁面的UI/UX流程邏輯是否與Legacy相符，並針對CAPTCHA機制啟動時刷新頁面後無法顯示CAPTCHA欄位的問題進行分析與修復。
- **目標**: 針對 Login.vue 頁面的 UI/UX 流程進行全面的分析，當達到登入錯誤次數顯示的CAPTCHA欄位，如果刷新頁面後畫面還是能正確顯示CAPTCHA欄位
  Login.vue 中的captchaOn 為true，會顯示CAPTCHA欄位，但當按下Alt + F5刷新頁面後，CAPTCHA欄位沒有顯示，是因為中的captchaOn參數變成false嗎？如果是的話，這個問題需要優先確認並修復，確保在刷新頁面後，captchaOn參數能夠正確保持其狀態，從而確保CAPTCHA欄位的顯示與Legacy版本一致。
- **輸出**:
  - 輸入錯誤的帳號密碼時，顯示 CAPTCHA 驗證碼的 UI/UX 流程圖、界面元素。當刷新頁面後，UI這邊的元件確保會正確顯示CAPTCHA欄位，

- **註解**: 在分析過程中，特別注意用戶操作的流暢性、界面的一致性、交互的直觀性，以及是否有任何潛在的用戶體驗問題或改進空間。

# Constraints & Rules

1. **實作策略**: 優先確保功能完整與邏輯正確，然後再進行程式碼優化與重構。每個功能模組的實作需遵循「先功能後優化」的原則，確保在初期階段能夠快速驗證功能的正確性，並在後續階段進行性能優化與代碼重構。
2. **型別安全**: 所有程式碼必須使用 TypeScript 實作，並且嚴格遵守型別定義，確保在編譯階段就能捕捉到潛在的錯誤。特別是在處理 API 請求與響應、狀態管理、組件 Props/Emits 時，需確保型別的準確性與一致性。
3. **跨平台相容性**: UI 實作需完全依賴 Quasar 的響應式設計 (Responsive Design) 系統，確保在 iOS/Android (Chrome/Safari) 及桌面瀏覽器上的體驗與版面 100% 一致。
4. **程式碼風格**: 保持 Clean Code 原則，Setup script 內部邏輯需依序按照：`Imports` -> `Props/Emits` -> `Store/State` -> `Computed` -> `Methods` -> `Lifecycle hooks` 進行結構化排列。

# Workflow / Output Format

請逐步分析並輸出以下內容：

1. **API實作處理**: 列出每個 API 的名稱、功能描述、參數列表、返回值結構、錯誤處理機制，以及與 Legacy 版本的對比分析。
2. **UI/UX流程分析**: 列出每個模式的操作流程圖、界面元素列表、交互邏輯說明，以及與 Legacy 版本的對比分析，目前缺少錯誤顯示字串欄位，顯示CAPTCHA欄位、顯示等待冷卻時間欄位。
