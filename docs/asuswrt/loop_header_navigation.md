# 任務：自動化驗證 `vue3-wrt-project` Header 與 Navigation 組件

## 1. 任務核心目標與背景 (Core Objective & Context)

- **目標：** 完整驗證專案中共用佈局組件 `Header.vue` 與 `Navigation.vue` 的 UI 渲染邏輯、響應式行為 (RWD) 以及路由狀態同步，並確保在不同裝置視窗尺寸下的端到端 (E2E) / 單元測試驗證皆符合預期。
- **背景：** `Header` 與 `Navigation` 是系統中最常被存取的全域 UI 元素。兩者之間通常存在連動關係（例如：行動版尺寸下，點擊 Header 的漢堡選單展開 Navigation）。透過自動化測試與嚴格的 TypeScript 型別檢查，確保高頻次操作的穩定性、DOM 結構的正確性與選單導航的使用者體驗。

---

## 2. 操作環境與可用工具 (Environment & Tools)

- **組件路徑：**
- `C:\Users\Jieming\Documents\GitHub\vue3-wrt-project\packages\shared\src\layouts\Header.vue`
- `C:\Users\Jieming\Documents\GitHub\vue3-wrt-project\packages\shared\src\layouts\Navigation.vue`

- **技術棧：** Vue 3, Vite, Vitest, Vue Test Utils, TypeScript (以及相應的 E2E 工具)。
- **可用指令（請於專案根目錄或 shared package 目錄執行）：**
- **型別檢查：** `npm run type-check` 或 `npx tsc --noEmit`
- **單元/組件測試：** `npm run test:unit` 或 `npx vitest run` (針對選單展開、路由 Active 狀態)
- **E2E 流程/視覺迴歸測試：** E2E 指令依專案設定而定 (針對不同 Viewport 尺寸的佈局驗證)

---

## 3. 自主執行步驟與自我修正引導 (Autonomous Workflow - LOOP)

請依序循環執行以下步驟。**注意：若遇到型別報錯、DOM 元素斷言失敗、或 RWD 狀態未如預期切換，請啟動自我修正機制：讀取 Error Log ➔ 分析組件 Props/Emits 或狀態管理 (Pinia) 同步失敗原因 ➔ 修改程式碼或測試腳本 ➔ 再次執行驗證，直到完全通過。**

```text
 ┌────────────────────────────────────────────────────────┐
 │ 步驟一：組件依賴與狀態結構確認 (Verify Setup & Store)  │
 └───────────────────────────┬────────────────────────────┘
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │ 步驟二：撰寫與實作狀態與路由測資 (State & Route Tests) │
 └───────────────────────────┬────────────────────────────┘
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │ 步驟三：實作 RWD 與跨組件互動測試 (RWD & Interaction)  │
 └───────────────────────────┬────────────────────────────┘
                             ▼
 ┌────────────────────────────────────────────────────────┐
 │ 步驟四：自動驗證與修復 (Auto-Verification & Hotfix)    │
 └───────────────────────────▲────────────────────────────┘
                             │ (若有 Fail 則修正並重跑)
                             └──────── 測試是否 100% Pass?

```

### 步驟一（組件依賴與狀態結構確認）

1. 切換至 `packages/shared/src/layouts/` 目錄。
2. 查閱 `Header.vue` 與 `Navigation.vue`，釐清兩者的通訊方式：

- 是透過 Props/Emits 直接控制（例如 `<Navigation :is-collapsed="sidebarState" />`）？
- 還是透過全域狀態管理（如 Pinia 中的 `layoutStore`）共用 Sidebar 折疊狀態？

3. 確認兩組件對 `vue-router` 的依賴（如 `useRoute`, `router-link`）。

### 步驟二（實作狀態與路由同步測試程式碼）

撰寫 `Header` 與 `Navigation` 的單元測試（例如 `tests/layouts/navigation.spec.ts`），涵蓋：

- **路由 Active 狀態驗證：** 模擬切換至不同 URL（如 `/dashboard`, `/network-settings`），驗證 `Navigation.vue` 中對應的選單項目是否有正確加上 `active` CSS class。
- **Header 功能驗證：** 測試 Header 上的常規功能（例如：語系切換、使用者帳號下拉選單）的展開與收起邏輯。

### 步驟三（實作 RWD 與 UI/UX 互動測試）

撰寫 E2E 或整合測試腳本，模擬使用者在不同裝置下的 DOM 互動：

- **情境 A：Desktop View (桌面版寬度)**
- `Navigation` 應預設展開（或依據使用者設定為側邊攔縮圖模式）。
- 點擊 Header 的折疊按鈕，驗證 Navigation 寬度或 DOM 結構的過渡變化（Transition/Collapse）。

- **情境 B：Mobile/Tablet View (行動版寬度)**
- `Navigation` 應預設隱藏（Off-canvas 或隱藏狀態）。
- 點擊 `Header` 上的漢堡選單 (Hamburger Icon)，驗證 `Navigation` 抽屜 (Drawer) 正確滑出/顯示。
- 點擊遮罩層 (Overlay) 或任意選單連結，驗證 `Navigation` 正確收起。

### 步驟四（自動化驗證）

1. 執行型別檢查 (`tsc --noEmit`)，確保從 `shared` package 匯出的型別無誤。
2. 執行 Component / Unit 測試。如有失敗，檢驗 `v-if`/`v-show` 邏輯、CSS 類別綁定，或依賴的 Mock Router/Store 設定。

---

## 4. 自動化觀測與驗證機制 (Observation & Verification)

1. **靜態檢查：** 執行 TypeScript 編譯檢查。由於涉及 Monorepo 的 `packages/shared`，需確保模組匯出路徑與型別定義在全域解析無誤。
2. **動態測試：** 執行 Vitest / UI 測試。重點觀測 `Header` 與 `Navigation` 在掛載 (Mount) 後的 DOM 渲染，以及觸發 Click 事件後的響應式資料變化。

---

## 5. 完成定義 (Definition of Done, DoD)

當滿足以下所有條件時，方可回報任務完成：

- [ ] `npx tsc --noEmit` 檢查 100% 無錯誤（特別檢查 Vue 組件的 Script Setup 型別）。
- [ ] 所有 Header 與 Navigation 的測試案例皆 **100% Pass**。
- [ ] **測試矩陣完整覆蓋以下 5 種關鍵情境：**

1. **【路由同步】** `Navigation` 的高亮選單能精準對應當前應用的 Active Route，包含子路由（Nested Routes）的展開狀態。
2. **【桌面版狀態切換】** 點擊 `Header` 側欄切換按鈕，`Navigation` 能正確在「完全展開」與「圖示模式/收縮」間切換。
3. **【行動版 RWD 互動】** 在窄螢幕模式下，`Navigation` 預設隱藏；由 `Header` 漢堡選單觸發後正確展開，且點擊連結後自動收起。
4. **【Header 獨立功能】** `Header` 內的非導航元素（如 Logo 連結回首頁、登出按鈕、狀態指示燈）點擊行為與功能觸發正常。
5. **【無障礙與過場】** 驗證選單展開/收合時的過場動畫無破圖，且 `v-if` / `v-show` 的切換沒有導致記憶體洩漏或重複掛載的警告。
