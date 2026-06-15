這份 V2 升級版的指令架構設計得非常嚴謹，完美切中了將 Legacy 專案現代化時最容易踩坑的痛點。對於流量分析（Traffic Analyzer）這種通常伴隨**巨大資料 payload** 以及**複雜圖表渲染**的頁面，嚴格的非同步狀態管理與生命週期控制更是不可或缺，否則極易引發瀏覽器卡頓或圖表實例（Chart Instance）造成的記憶體洩漏。

我已經為您將這份 Loop Markdown 指令重新量身打造，專注於「Traffic Analyzer 流量分析 -> 統計數值」的移植，並特別加入了 Vue Router 的設定要求以及圖表生命週期的防護機制。您可以直接將此腳本交由您的 AI 代理（如寫入 TASK.md 中）執行：

---

# 任務：自動化遷移與驗證 vue3-wrt-project Traffic Analyzer (流量分析-統計數值) SPA 重構

## 1. 任務核心目標與背景 (Core Objective & Context)

- **目標：** 將舊版專案中的「Traffic Analyzer (流量分析)」頁面與圖表邏輯，精準移植至 Vue 3 SPA 專案的「統計數值」模組下。
- **背景：** 流量分析頁面依賴大量的歷史數據與即時 API 請求。為避免舊版直接操作 DOM 或非同步請求時序混亂導致的「載入失敗」與「沒有資料」問題，本次重構需全面採用 Vue 3 Composition API 與嚴謹的 Pinia 狀態管理。同時需確保圖表（UI/UX）的一致性、圖表資源的正確銷毀，並妥善設定 Vue Router 路由配置。

---

## 2. 操作環境與可用工具 (Environment & Tools)

- **舊專案參考路徑 (Legacy Sources)：**
- 頁面結構：`C:\Users\Jieming\Documents\GitHub\www\dashboard\pages\trafficanalyzer.html`
- 核心邏輯：需自動分析 `trafficanalyzer.html` 中引用的 JS 檔案與 API endpoints。

- **新專案目標路徑 (Vue 3 Target)：**
- 主頁面視圖：`packages/shared/src/views/TrafficAnalyzer/Statistics/TrafficAnalyzer.vue`
- 子組件目錄：`packages/shared/src/components/TrafficAnalyzer/` (供圖表與資料表拆分使用)
- 狀態管理中心：`packages/shared/src/stores/trafficAnalyzer.ts`
- 路由配置檔：`packages/shared/src/router/index.ts` (或專屬的 router module)

- **專案根目錄（指令執行點）：** `C:\Users\Jieming\Documents\GitHub\vue3-wrt-project`
- **技術棧限制：** Vue 3 (Composition API, `<script setup>`), TypeScript, Vite, Vitest.
- **可用驗證指令：** `npm run type-check`、`npm run test:unit`

---

## 3. 自主執行步驟與自我修正引導 (Autonomous Workflow - LOOP)

### 步驟一：Vue Router 設定與模組初始化 (Router & Setup)

1. **路由註冊**：

- 在 Vue Router 配置中新增 `TrafficAnalyzer` 路由。
- 確保路由層級結構符合「Traffic Analyzer 流量分析 -> 統計數值」，設定正確的 `path`、`name` 與 `component` lazy loading（`() => import(...)`）。

1. **圖案與靜態資源遷移**：

- 盤點舊版 `trafficanalyzer.html` 使用的圖示 (Icons)、背景圖或特殊樣式，全數移植至新專案對應的 `assets` 或以 SVG 元件取代，確保 UI/UX 高度一致。

### 步驟二：API Hook 解析與高容錯資料流設計 (Analyze & Store Extraction)

1. **深度審查與依賴解耦**：

- 找出舊版抓取統計數值（如應用程式流量、客戶端流量、時間區間篩選）的所有 API endpoints。
- 移除舊版對 `window` 或隱含 DOM 狀態的依賴，將查詢參數（如日期範圍、排序方式）全部納入 Pinia Store 或 Vue Router 的 query parameters 進行單一真理來源（Single Source of Truth）管理。

1. **防呆與 Null-safe 設計 (`trafficAnalyzer` Store)**：

- 定義流量資料的嚴格 TypeScript 介面 (Interfaces)。
- **核心防線**：在資料 fetching 期間或 API 回傳空值時，Store 必須給予預設的空陣列 `[]` 或零值物件，**絕對禁止**組件端接收到 `undefined` 而導致圖表套件報錯或畫面破版。

### 步驟三：UI 組件化與圖表重構 (Implement UI & Charts)

主視圖 `TrafficAnalyzer.vue` 應保持簡潔，負責 Layout 與狀態分發。具體 UI 拆分為子組件，且每個組件**必須實作 Loading 骨架屏 (Skeleton)**：

- **1. 流量過濾控制器 (`TrafficFilterBar.vue`)**
- 實作時間區間選擇、資料維度（App/Client）切換，並與 Store 狀態雙向綁定。

- **2. 趨勢圖表組件 (`TrafficTrendChart.vue`)**
- 整合圖表庫（如 ECharts/Chart.js），重現舊版 UI 視覺。
- **重點修復區**：使用 `v-if="store.isLoading"` 或骨架屏包覆，確保資料 100% 準備好才進行 Chart 初始化。

- **3. 統計數據清單 (`TrafficStatisticsTable.vue`)**
- 渲染各應用程式或客戶端的流量排行，具備無資料時的 Empty State 友善提示。

### 步驟四：嚴格的生命週期與記憶體管理 (Lifecycle & Memory Guard)

- **圖表實例銷毀 (Chart Destruction)**：
- 在圖表組件的 `onUnmounted` 階段，**必須明確呼叫圖表實例的 `dispose()` 或 `destroy()` 方法**，防止 SPA 路由切換時引發嚴重的記憶體洩漏 (Memory Leak)。

- **非同步請求中斷**：
- 進入頁面發動的 API 請求需綁定 `AbortController`，若使用者在資料回傳前切換 Router，必須自動中止請求。

### 步驟五：自動化驗證與自我修復 (Verification & Hotfix)

1. 執行 `npm run type-check`，排除任何 TypeScript 型別報錯（圖表資料結構複雜，需特別注意型別定義）。
2. **如果畫面出現「沒有資料」或報錯**：立即檢視 Store 的初始狀態與 Chart 掛載時機，確認是否因 Vue DOM 尚未渲染完畢就執行圖表初始化，修正後重跑 Loop。

---

## 4. 測試矩陣與邊界情境 (Testing Matrix)

針對流量分析頁面，測試腳本必須涵蓋以下情境：

- **情境 A：巨量資料與延遲 (Heavy Payload & Race Condition)**：模擬 API 處理大量流量數據耗時 5 秒，斷言畫面維持平穩的 Loading UI，無「載入失敗」閃爍，且資料回傳後圖表順滑渲染。
- **情境 B：路由來回切換記憶體測試 (Router Leaks Prevention)**：從 `/traffic-analyzer` 反覆切換至其他頁面 5 次，斷言 Chart 實例被正確銷毀，記憶體無異常堆疊，背景無殘留的未完成 API 請求。
- **情境 C：空資料狀態 (Zero Traffic)**：模擬新設備或無流量情境（API 回傳空陣列），斷言系統優雅地顯示「目前無流量資料」的 UI，而非破圖或報錯。

---

## 5. 完成定義 (Definition of Done, DoD)

- [ ] **路由與結構就位**：Vue Router 正確配置，能順利導航至「Traffic Analyzer 流量分析 -> 統計數值」，且 UI 版面佈局與舊專案高度一致。
- [ ] **圖表與資料零失誤**：流量分析圖表與數據表組件化完成，資料抓取精準無誤。具備 Null-safe 機制，任何網路狀態下皆無「載入失敗」或白畫面。
- [ ] **圖表記憶體零洩漏**：`onUnmounted` 確實清理了 Chart 實例與 `AbortController` 取消了 pending 請求。
- [ ] **原始碼深度解耦**：徹底摒棄舊版 jQuery DOM 操作，全面落實 Vue 3 響應式資料流與 Composition API 規範。
- [ ] **型別安全守線**：執行 `npx tsc --noEmit` 檢查結果為 0 Error，所有流量資料結構皆具備明確介面定義。

接著移植 流量監控
我現在要改成移植trafficmonitor.html "流量監控" 到新專案
舊專案位置`C:\Users\Jieming\Documents\GitHub\www\dashboard\pages\trafficmonitor.html`，然後放在新專案的流量監控這個目錄底下，新增一個流量監控 選項，檔案名稱就叫做TrafficMonitor.vue
移植舊專案的圖案，UI/UX，function到新專案來，並且符合vue3 composition API寫法
注意要調整Vue router的設定
UI layout盡量保持一致，突然移植要確實
要確認抓取流量資料的API是否有正確抓取資料，且要確保在Vue 3的生命週期中正確處理非同步資料的載入與錯誤狀態，避免出現「載入失敗」或「沒有資料」的情況。
根據這些修改，將上面提供的loop markdown重新修改成符合我移植 流量監控 的版本loop markdown給我
