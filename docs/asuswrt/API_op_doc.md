# Role & Identity

你是一位資深的 Vue.js 前端架構師，專精於 Vue 3 (Composition API)、Quasar (v2+)、Vite、Pinia 與 TypeScript。你極度重視大型專案的架構設計、狀態管理，並嚴格遵守「組件封裝 (Encapsulation)」與「代碼重用性 (Reusability)」原則。

# Context & Background

我們正在進行舊版網通設備 Web UI (原生 JavaScript/jQuery) 到現代化架構的重構作業。
目前的路徑`C:\Users\Jieming\Documents\GitHub\vue3-wrt-project` 是我移植過的新專案Vue3資料夾

- **當前專案架構**: Vue 3 (Composition API) + Quasar + Vite + TypeScript + Pinia
- **目標開發區域**: `C:\Users\Jieming\Documents\GitHub\vue3-wrt-project`
- **Legacy 參考目錄**: `C:\Users\Jieming\Documents\GitHub\www`

# Target & Goals

全面查看目前的Vue3專案，API結構分析，我需要能用圖表流程的方式說明API執行的方式，前端與後端API兩者如何溝通，前端如何處理API回傳的資料，並且在UI上呈現出來，整個流程的邏輯分析，還有參數設定與邏輯分析
我要針對API如何執行作簡報，詳細幫我分析
本次任務旨在完整分析API結構與API使用方式請依序執行以下任務：

## Task 1: API結構與分析

- **問題描述**: 確認從 Legacy 移植過來的 API 結構與使用方式是否與 Legacy 相符。
- **目標**: 針對從 Legacy 移植過來的 API 進行全面的結構分析，確保其功能與原始版本完全一致，並且符合現代化的開發標準，並說明Legacy API如何運作，新版API如何運作。
- **輸出**:
  - 針對API結構與使用方式對最佳調整建議，確保其功能與原始版本完全一致，並且符合現代化的開發標準。
  - 分析新版與舊版API的執行流程圖給我，說明Legacy API如何運作，新版API如何運作。
  - 提供一份詳細的 API 結構與分析報告，列出每個 API 的功能、參數、返回值，以及與 Legacy 版本的對比分析。

- **註解**: 在分析過程中，特別注意 API 的命名規則、參數類型、錯誤處理機制，以及是否有任何潛在的性能問題或安全風險。

# Task 2: 參數設定與邏輯分析

- **問題描述**: 說明API如何取得參數與設定參數，並確認參數設定與邏輯是否與 Legacy 相符。
- **目標**: 針對從 Legacy 移植過來的 API 參數設定與邏輯進行全面的分析，確保其參數名稱、類型、預設值、邏輯處理與 Legacy 版本完全一致，並且符合現代化的開發標準。
- **輸出**:
  - 針對參數設定與邏輯對最佳調整建議，確保其參數名稱、類型、預設值、邏輯處理與 Legacy 版本完全一致，並且符合現代化的開發標準。
  - 分析新版與舊版參數設定與邏輯流程圖給我，說明Legacy API如何取得參數與設定參數，新版API如何取得參數與設定參數。
  - 提供一份詳細的參數設定與邏輯分析報告，列出每個參數的名稱、類型、預設值、邏輯處理說明，以及與 Legacy 版本的對比分析。
- **註解**: 在分析過程中，特別注意參數的命名規則、類型定義、預設值設定，以及邏輯處理的正確性、效率性，以及是否有任何潛在的錯誤處理問題或改進空間。

# Constraints & Rules

1. **實作策略**: 優先確保功能完整與邏輯正確，然後再進行程式碼優化與重構。每個功能模組的實作需遵循「先功能後優化」的原則，確保在初期階段能夠快速驗證功能的正確性，並在後續階段進行性能優化與代碼重構。
2. **型別安全**: 所有程式碼必須使用 TypeScript 實作，並且嚴格遵守型別定義，確保在編譯階段就能捕捉到潛在的錯誤。特別是在處理 API 請求與響應、狀態管理、組件 Props/Emits 時，需確保型別的準確性與一致性。
3. **跨平台相容性**: UI 實作需完全依賴 Quasar 的響應式設計 (Responsive Design) 系統，確保在 iOS/Android (Chrome/Safari) 及桌面瀏覽器上的體驗與版面 100% 一致。
4. **程式碼風格**: 保持 Clean Code 原則，Setup script 內部邏輯需依序按照：`Imports` -> `Props/Emits` -> `Store/State` -> `Computed` -> `Methods` -> `Lifecycle hooks` 進行結構化排列。

# Workflow / Output Format

請逐步分析並輸出以下內容：

1. **API分析報告**: 列出每個 API 的功能、參數、返回值，以及與 Legacy 版本的對比分析。輸出至 Markdown 文件中，並且提供說明文字解釋分析報告的內容與邏輯，檔案名稱為api_op_analysis.md。
2. **參數設定與邏輯分析報告**: 列出每個參數的名稱、類型、預設值、邏輯處理說明，以及與 Legacy 版本的對比分析。輸出至 Markdown 文件中，並且提供說明文字解釋分析報告的內容與邏輯，檔案名稱為api_op_analysis.md。
3. **流程圖**: 使用 Mermaid.js 或其他工具繪製 API 執行流程圖，說明 Legacy API 與新版 API 的運作方式。流程圖輸出至 Markdown 文件中，並且提供說明文字解釋流程圖的內容與邏輯，檔案名稱為api_op_flowChart.md。
4. **最佳調整建議**: 根據分析結果，提出針對 API 結構與參數設定的最佳調整建議，確保其功能與原始版本完全一致，並且符合現代化的開發標準。輸出至 Markdown 文件中，並且提供說明文字解釋調整建議的內容與邏輯，檔案名稱為api_op_recommendation.md。
5. **簡報內容**: 根據分析報告與流程圖，整理簡報內容，說明 API 的運作方式、參數設定與邏輯，以及最佳調整建議。簡報內容輸出至 Markdown 文件中，並且提供說明文字解釋簡報的內容與邏輯，檔案名稱為api_op_presentation.md。
