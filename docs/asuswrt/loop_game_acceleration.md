# 任務：自動化遷移與重構 vue3-wrt-project「三段電競加速 (Game Acceleration)」流程與組件化 (SPA 優化升級版)

## 1. 任務核心目標與背景 (Core Objective & Context)

- **目標：** 將舊專案的「三段電競加速」功能完整移植至 Vue 3 專案中，包含 Terms 服務條款簽署流程、靜態圖檔與 UI/UX 佈局，以及各階段加速按鈕的互動邏輯，並完全採用 Vue 3 Composition API 進行重構。
- **背景：** 從 jQuery/Legacy 轉換至 Vue 3 SPA 時，經常發生圖檔路徑遺失、Terms 狀態未與路由同步，或按鈕事件綁定失效等問題。本次任務要求徹底解耦舊專案 DOM 操作，將 Terms 狀態檢查整合至 Router 或 Store 中，並確保三段加速的 UI 佈局與舊版保持 100% 視覺一致性。

---

## 2. 操作環境與可用工具 (Environment & Tools)

- **舊專案參考路徑 (Legacy Sources)：**
  - 頁面結構：`C:\Users\Jieming\Documents\GitHub\www\dashboard\pages\game_acceleration.html`
  - 核心邏輯：需自行於舊專案尋找對應的 JS 檔 (如 `game_acceleration.js` 或定義該頁面邏輯的 module)。
  - 圖檔資源：舊專案中與 Game Acceleration 相關的 `images/` 或 `assets/` 目錄。

- **新專案目標路徑 (Vue 3 Target)：**
  - 主頁面視圖：`packages/shared/src/views/GameAcceleration/GameAcceleration.vue` (新增目錄與檔案)
  - 子組件目錄：`packages/shared/src/components/game_acceleration/`
  - 狀態管理中心：`packages/shared/src/stores/gameAcceleration.ts`
  - 路由設定檔：`packages/shared/src/router/index.ts` (或其他定義路由的位置)
  - 靜態圖檔目錄：`packages/shared/src/assets/images/game_acceleration/`

- **專案根目錄（指令執行點）：** `C:\Users\Jieming\Documents\GitHub\vue3-wrt-project`
- **可用驗證指令：** `npm run type-check`、`npm run test:unit`

---

## 3. 自主執行步驟與自我修正引導 (Autonomous Workflow - LOOP)

### 步驟一：Vue Router 設定與 Terms 簽署狀態機設計 (Router & State Setup)

1. **更新 Vue Router 配置**：
   - 於路由設定檔中，新增一組路徑指向 `GameAcceleration.vue`，確保左側選單或導覽列的「電競加速」選項能正確導向此視圖。
2. **設計 Terms 簽署狀態機 (Pinia)**：
   - 建立 `gameAccelerationStore`。
   - 解析舊版判定「是否已簽署 Terms」的 API 或 LocalStorage 邏輯。
   - **實作攔截機制**：若使用者尚未簽署，必須強制顯示 Terms 簽署 UI（可作為彈出 Modal 或佔滿畫面的獨立視圖），在 API 確認同意前，禁止渲染或操作背後的三段加速按鈕。

### 步驟二：靜態資源遷移與 UI 佈局 100% 復原 (Assets & Layout Migration)

1. **圖檔資源精準搬移**：
   - 將舊專案 `game_acceleration.html` 內引用的所有圖片（如電競設備、加速示意圖、背景圖等）複製到新專案的 `assets/images/game_acceleration/` 目錄下。
   - 確保在 Vue 組件中使用 `@/assets/...` 或 Vite 支援的 `import` 方式引入圖檔，避免打包後出現 404 破圖。
2. **UI Layout 一致性重建**：
   - 解析舊 HTML/CSS，將其轉換為 Vue SFC (Single File Component) 的 `<template>` 與 `<style scoped>`。
   - 保留原有的 RWD 響應式設計與排版，視覺上必須與舊版毫無二致。

### 步驟三：拆解並實作核心子組件與互動功能 (Componentization & Functions)

主頁面 `GameAcceleration.vue` 應負責排版與載入狀態管理，具體的區塊必須拆分為以下子組件（位於 `components/game_acceleration/`），所有邏輯皆需使用 **Vue 3 Composition API (`<script setup>`)** 撰寫：

- **1. 服務條款簽署組件 (`TermsAgreement.vue`)**
  - 負責呈現條款內容、Checkbox（如有）以及「同意/拒絕」按鈕。
  - 同意後需發送 API 更新狀態，並通知父組件解鎖加速功能介面。

- **2. 第一段加速：遊戲設備優先 (`GameDeviceLevel.vue`)**
  - 遷移對應的 UI 圖案與功能說明。
  - 實作開啟/關閉的 Toggle 按鈕，綁定 API 請求與防抖 (Debounce) 處理。

- **3. 第二段加速：遊戲封包優先 (`GamePacketLevel.vue` 或 QoS 控制)**
  - 遷移對應 UI，確保按鈕狀態與後端 API 即時同步。
  - 加入 Loading 狀態：按鈕點擊後需有 Spinner 或禁用狀態，直到 API 回傳成功才更新畫面。

- **4. 第三段加速：遊戲伺服器加速 (`GameServerLevel.vue` 或 WTFast/GPN)**
  - 完整移植登入、連線或設定介面，以及跳轉至第三方服務的邏輯。

### 步驟四：自動化驗證與自我修復 (Verification & Hotfix)

1. 檢查圖檔路徑：確認編譯後沒有遺失資源。
2. 執行 `npm run type-check`，確保所有 API 請求的 Payload 與 Response 都有嚴謹的 TypeScript Interface 定義（禁止隱式 `any`）。
3. **如果發現按鈕點擊無效或畫面破版**：立即檢視是否殘留了舊版的 `$(selector).on('click')` 或 `document.getElementById`，強制將其重構為 Vue 的 `@click` 事件與響應式 `ref`/`reactive` 綁定。

---

## 4. 測試矩陣與邊界情境 (Testing Matrix)

針對本次重構，測試腳本必須涵蓋以下關鍵情境：

- **情境 A：Terms 狀態攔截 (Terms Flow)**：模擬初始狀態為未同意，斷言畫面上僅出現 Terms 簽署視窗，無法操作後方按鈕；點擊同意並 API 成功後，畫面立即流暢切換至三段加速主控台。
- **情境 B：圖檔與 UI 渲染無誤 (Asset Integrity)**：驗證各段加速的示意圖、背景圖在 Vite 打包環境下皆能正常 GET 取得 (HTTP 200)，無破圖發生。
- **情境 C：按鈕防連點與非同步防呆 (Button Race Condition)**：模擬連續快速點擊任一段加速的開關按鈕，斷言按鈕會立即進入 `disabled` 或 Loading 狀態，且只會發出一次有效的 API 請求，避免狀態錯亂。

---

## 5. 完成定義 (Definition of Done, DoD)

- [ ] **Vue Router 整合**：已於新專案的路由系統中成功註冊 `GameAcceleration.vue`，且能透過選單正常進入。
- [ ] **Terms 邏輯完善**：使用者授權狀態已與 Pinia Store 及 API 完整掛鉤，未授權者絕對無法繞過條款操作功能。
- [ ] **Composition API 100% 轉換**：代碼中完全使用 `<script setup>`、`ref`、`computed`，無任何 Options API (`data()`, `methods`) 或 jQuery 殘留。
- [ ] **視覺與圖檔 100% 復原**：所有舊版的圖片皆已正確打包引用，UI 佈局 (包含 RWD) 與舊專案完全一致。
- [ ] **功能互動正常**：三段加速的各自按鈕與功能（包含狀態獲取、開啟、關閉）皆已串接對應 API 並具備 Error 處理與 Loading 狀態。
- [ ] **型別安全**：執行 `npx tsc --noEmit` 檢查結果為 0 Error，所有狀態皆定義了明確的 TypeScript 介面。
