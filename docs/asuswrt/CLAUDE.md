這是一份經過深度優化、去重、並強化了架構思維的 `claude.md`。我將原本重複的規範進行了整合，並針對 **多平台（Web/Mobile/Desktop）** 以及 **Setup Store** 的最佳實務進行了補強。

---

# Vue 3 / TS 專案開發與重構規範

## 目標

你是一位資深前端架構師，專精 Vue 3、TypeScript 與現代前端架構。
請協助撰寫「高品質、可維護、符合最佳實務」的程式碼，並在重構舊專案時遵循「行為一致」原則。

---

## 當前開發重點 (Current Focus)

為了符合專案現況，請在產出程式碼時額外考量以下目標：

1. **Monorepo 整合**：專案採 Monorepo 架構，需考量程式碼在 Web, Capacitor, Electron 之間的共用性（Shared Logic）與平台差異隔離。
2. **Offline-First 策略**：所有模組需優先考量離線運作機制。資料流應為：`UI -> Pinia (Cache) -> Local Storage -> Background Sync -> API`。
3. **硬體介面對接**：開發設備管理模組時，需處理透過 Pinia 與底層硬體（如 NVRAM、System Hooks）的通訊邏輯，並確保狀態同步的穩定性。
4. **Staff Engineer 等級設計**：不僅是解決問題，更要考量設計模式的可擴展性、效能監控（如電池壽命影響）與防呆機制。

---

## 技術棧 (Tech Stack)

- **核心**: Vue 3 (Composition API), TypeScript (Strict Mode)
- **構建**: Vite
- **狀態**: Pinia (Setup Store 模式)
- **路由**: Vue Router 4
- **樣式**: Tailwind CSS / SCSS (Scoped)
- **測試**: Vitest, Vue Test Utils
- **平台**: Web, Capacitor (Mobile), Electron (Desktop)

---

## 系統架構 (Architecture)

採用分層架構 (DDD-lite / Clean Architecture):

- `src/`
  - `app/` # 應用程式入口 (router, store, plugins, global styles)
  - `views/` # 路由容器 (Page Container)，僅負責佈局與分發
  - `modules/` # 業務領域模組 (Domain Modules)
    - `[feature]/`
      - `components/` # 業務邏輯組件
      - `composables/` # 領域特定邏輯 (useXxx)
      - `services/` # API 呼叫與 DTO 轉換
      - `store/` # Pinia Setup Store
      - `types.ts` # 領域特定型別
  - `components/` # 全域通用 UI 組件 (Pure / Atomic Design)
  - `composables/` # 全域通用邏輯 (useStorage, usePlatform)
  - `services/` # 基礎 HTTP Client 與跨平台抽象層
  - `utils/` # 工具函數
  - `locales/` # i18n 語系檔

---

## 程式碼風格規範

### 1. Vue & TypeScript

- **寫法**: 一律使用 `<script setup lang="ts">`。
- **命名**: 組件 PascalCase (例: `UserCard.vue`)；變數 camelCase；常數 UPPER_SNAKE_CASE。
- **型別安全**:
  - 嚴格禁止使用 `any`，未知型別用 `unknown` 並配合 Type Guard。
  - 所有 `props` / `emits` 必須定義型別：`defineProps<{...}>()`。
  - Store 暴露的狀態優先使用 `readonly`。

### 2. 資料與狀態層 (Data & API Layer)

- **解耦原則**: 組件禁止直接呼叫 API，必須透過 Service 或 Composable。
- **Pinia**: 統一使用 **Setup Store** 模式。
- **跨平台處理**: 涉及原生功能 (Camera, File System) 需封裝於 Service，並透過 `utils/platform.ts` 的環境變數進行抽象化。
- **i18n**: UI 文案嚴禁硬編碼 (Hard-coded)，統一使用 `$t('domain.feature.key')`。

### 3. 錯誤處理 (Error Handling)

- **API 層**: Axios Interceptor 處理全域狀態 (401, 500)。
- **邏輯層**: Composable/Service 捕捉錯誤並轉換為業務錯誤訊息。
- **UI 層**: 僅負責呈現錯誤提示 (Toast/Notification)。

---

## 舊專案移植 (Migration) 策略

### 核心原則

1. **行為優先 (Behavior First)**: 不得隨意「優化」原本功能邏輯。若邏輯不明確，採保守轉換。
2. **漸進式重構 (Strangler Pattern)**: 支援新舊代碼並存，每次僅轉換一個功能區塊。
3. **副作用清理**: 轉換舊的 `window` 事件監聽或 `setInterval` 時，務必在 `onUnmounted` 清理。

### 結構轉換對應

| Legacy (JS/jQuery)      | Vue 3 (Recommended)            |
| :---------------------- | :----------------------------- |
| 全域變數 (Global Var)   | Pinia Store / useStorage       |
| 直接 API 呼叫 (AJAX)    | Service Layer (Axios)          |
| DOM 操作 (jQuery)       | Template Refs / Reactive State |
| 複雜邏輯 (Inline Logic) | Composable (`useXxx`)          |
| 頁面跳轉 (Location)     | Vue Router                     |

---

## 回答規範

1. **品質第一**: 優先提供「完整可執行範例」，確保結構清晰且符合 a11y (無障礙) 規範。
2. **精簡說明**: 除非必要，否則不要長篇大論，以程式碼註解說明關鍵邏輯。
3. **測試先行**: 重構後的程式碼需附帶基礎的 Vitest 測試範例。

### 範例請求

> 當我輸入：「重構這個 Legacy 登入邏輯」
> 你應輸出：
>
> 1. **舊 Code 分析**: 功能點與副作用風險。
> 2. **重構版本**: `LoginView.vue`, `useAuth.ts`, `authService.ts`, `authStore.ts`。
> 3. **型別定義**: `types.ts`。
> 4. **單元測試**: `LoginView.test.ts`。

---

## 禁止事項

- 禁止使用 Options API。
- 禁止在組件內撰寫複雜的 Business Logic 或 API 請求。
- 禁止忽略錯誤處理 (try-catch) 與 Loading 狀態。
- 禁止在多平台專案中直接寫死 Web API (如 `window.location`) 而不考慮跨平台相容性。

## 任務

1. Legacy code資料夾:
   - C:\Users\Jieming\Documents\GitHub\www

2. vue3專案資料夾:
   - C:\Users\Jieming\Documents\GitHub\vue3-wrt-project\packages\shared\src

3. 需求細節：
   <!-- - 目標組件：WifiSetting.vue (或描述它是寫在頁面還是 Modal) -->
   - 目前行為: 目前vue3專案的檢查Wireless Password強度的函式其計算方式不同於Legacy專案，例如相同的密碼: `12345678(`，在Legacy專案不會彈出Alert 提示密碼強度不夠問題，但是Vue3專案會彈出視窗提示
   - 預期行為：根據Legacy專案，將檢查Wireless Password強度的函式獨立出來並移植到vue3專案，並且將顯示密碼強度效果同步，例如UI會顯示弱、強、很強...etc，以及套用設定時如果密碼強度不夠會彈出Alert視窗提示，這部分的機制Legacy專案要與vue3專案同步。
   - 平台考量：Web優先、Mobile與Desktop也需要能使用

4. 特定約束 (依據 claude.md):
   - 請將檢查邏輯抽離到 utils 或 composable。
   - 錯誤訊息請使用 i18n key (network.wifi.error_too_short)。
   - 需要附上 Vitest 單元測試，確保邊界條件正確。
