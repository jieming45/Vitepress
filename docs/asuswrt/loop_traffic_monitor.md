這份「流量監控 (Traffic Monitor)」的重構任務，與前一個「流量分析 (Traffic Analyzer)」雖然名稱相似，但在底層的非同步邏輯上有著決定性的差異：**流量監控極度依賴「高頻率即時輪詢 (Real-time Polling)」**。

如果在 Vue 3 生命週期中沒有妥善處理定時器 (`setInterval`) 與圖表的增量更新，極易引發嚴重的記憶體洩漏與畫面卡頓。為此，我針對「即時輪詢」與「動態圖表更新」的防護機制進行了強化，以下是為您量身打造的 V2 升級版 Loop Markdown 指令，您可以直接交給 AI 代理執行：

---

# 任務：自動化遷移與驗證 vue3-wrt-project Traffic Monitor (流量監控) SPA 重構

## 1. 任務核心目標與背景 (Core Objective & Context)

- **目標：** 將舊版專案中的「Traffic Monitor (流量監控)」頁面與即時動態圖表邏輯，精準移植至 Vue 3 SPA 專案的「流量監控」目錄與路由選單下。
- **背景：** 流量監控頁面需要高頻率（如每 1~3 秒）向後端請求即時頻寬數據（Rx/Tx），並持續更新折線圖。本次重構重點為：全面採用 Vue 3 Composition API 與 Pinia，並建立極度嚴格的**輪詢生命週期管理 (Polling Lifecycle Guard)**，確保在網路延遲、API 報錯或切換 Router 時，不會發生定時器殘留、圖表實例記憶體洩漏，以及「載入失敗」的非同步 Race Condition。

---

## 2. 操作環境與可用工具 (Environment & Tools)

- **舊專案參考路徑 (Legacy Sources)：**
- 頁面結構：`C:\Users\Jieming\Documents\GitHub\www\dashboard\pages\trafficmonitor.html`
- 核心邏輯：需自動分析 `trafficmonitor.html` 中引用的 JS 檔案、圖表套件（如 Highcharts/Chart.js）與 API endpoints。

- **新專案目標路徑 (Vue 3 Target)：**
- 主頁面視圖：`packages/shared/src/views/TrafficMonitor/TrafficMonitor.vue`
- 子組件目錄：`packages/shared/src/components/TrafficMonitor/` (供圖表與網卡切換器拆分使用)
- 狀態管理中心：`packages/shared/src/stores/trafficMonitor.ts`
- 路由配置檔：`packages/shared/src/router/index.ts` (或專屬的 router module)

- **專案根目錄（指令執行點）：** `C:\Users\Jieming\Documents\GitHub\vue3-wrt-project`
- **技術棧限制：** Vue 3 (Composition API, `<script setup>`), TypeScript, Vite, Vitest.
- **可用驗證指令：** `npm run type-check`、`npm run test:unit`

---

## 3. 自主執行步驟與自我修正引導 (Autonomous Workflow - LOOP)

### 步驟一：Vue Router 設定與模組初始化 (Router & Setup)

1. **路由與選單註冊**：

- 在 Vue Router 配置中新增一個頂層或對應層級的 `TrafficMonitor` 路由選項。
- 確保設定正確的 `path` (如 `/traffic-monitor`)、`name` 與 `component` lazy loading（`() => import(...)`），並在系統側邊欄/導覽列中新增「流量監控」的入口。

2. **圖案與靜態資源遷移**：

- 盤點舊版 `trafficmonitor.html` 使用的圖示 (Icons)、背景圖、網卡介面圖（WAN, LAN, 2.4G, 5G），全數移植至新專案對應的 `assets`，確保 UI/UX 佈局與舊版高度一致。

### 步驟二：即時 API 輪詢解析與高容錯資料流設計 (Analyze & Store Extraction)

1. **深度審查與依賴解耦**：

- 找出舊版抓取即時 Rx/Tx 流量的 API endpoints。
- 徹底移除舊版依賴全域變數累積資料點的寫法，改由 Pinia Store 統一管理歷史陣列（例如維持最近 60 秒的資料點）。

2. **防呆與 Null-safe 設計 (`trafficMonitor` Store)**：

- 定義流量數據（目前速度、平均速度、最高速度、總流量）的嚴格 TypeScript 介面。
- **非同步狀態保護**：在初次載入 API 處於 `pending` 時，Store 必須提供預設的零值結構（如 `{ rx: 0, tx: 0 }`），保證組件端渲染時絕對不會讀取到 `undefined` 而引發「載入失敗」。

### 步驟三：UI 組件化與即時圖表重構 (Implement UI & Charts)

主視圖 `TrafficMonitor.vue` 僅負責 Layout 與狀態分發。具體 UI 必須拆分為以下獨立子組件，且**必須實作 Loading 骨架屏 (Skeleton)**：

- **1. 網路介面切換控制器 (`InterfaceSelector.vue`)**
- 實作 WAN / LAN / Wi-Fi (2.4G/5G) 的頁籤或下拉切換，並與 Store 的目標介面狀態綁定。切換時需清空當前圖表資料重新繪製。

- **2. 即時動態趨勢圖組件 (`RealTimeTrafficChart.vue`)**
- 整合現代圖表庫（如 ECharts/Chart.js）。
- **效能優化要求**：圖表更新必須採用增量更新（如 ECharts 的 `setOption` 的 append 模式），嚴禁每次輪詢都將整個 Chart 實例銷毀重建，以避免瀏覽器卡頓。

- **3. 即時數據統計卡片 (`TrafficSpeedMetrics.vue`)**
- 即時顯示 Current (當前), Average (平均), Maximum (最高) 的上傳與下載速度，並自動處理 Byte/KB/MB 單位換算。

### 步驟四：極度嚴格的輪詢生命週期管理 (Polling & Memory Guard)

此步驟為「流量監控」成敗之關鍵：

- **定時輪詢 (Polling) 鐵律**：
- 必須在 `onMounted` 階段啟動 `setInterval` 進行 API 請求。
- **必須在 `onUnmounted` 階段明確執行 `clearInterval**`。

- **中斷未完成的請求 (AbortController)**：
- 發送新一輪 API 請求前，若前一次請求尚未完成，必須將其 abort 掉。
- 離開頁面（`onUnmounted`）時，必須 abort 任何 pending 中的 API 請求。

- **圖表實例銷毀 (Chart Destruction)**：
- 在 `onUnmounted` 時，強制呼叫圖表實例的 `dispose()` 或 `destroy()`，防止 DOM 節點與記憶體殘留。

### 步驟五：自動化驗證與自我修復 (Verification & Hotfix)

1. 執行 `npm run type-check`，排除任何 TypeScript 型別報錯。
2. **如果畫面出現閃爍、圖表卡頓或報錯**：立即檢視 Store 的輪詢邏輯是否發生了 Race Condition（如：兩次請求同時回來導致陣列塞入錯誤順序的資料），修正後重跑 Loop。

---

## 4. 測試矩陣與邊界情境 (Testing Matrix)

針對流量監控頁面，測試腳本必須涵蓋以下極端情境：

- **情境 A：長期掛機測試 (Memory Leak Proof)**：模擬開啟此頁面持續接收資料 10 分鐘，斷言陣列長度受到嚴格管控（例如最多只保留 100 筆資料），瀏覽器記憶體無異常飆高。
- **情境 B：介面快速切換 (Rapid Interface Switch)**：連續快速點擊切換 WAN / LAN / 5G 介面，斷言 Store 能夠正確 abort 舊介面的請求，清空圖表，並只顯示最終選定介面的正確資料。
- **情境 C：路由來回切換測試 (Router Polling Destruction)**：從 `/traffic-monitor` 反覆切換至首頁再切回來 5 次，斷言背景沒有殘留多個 `setInterval` 在同時發送請求（可透過觀察 Network Tab 驗證）。

---

## 5. 完成定義 (Definition of Done, DoD)

- [ ] **路由與選單就位**：Vue Router 正確配置 `/traffic-monitor`，導航選單中已新增「流量監控」項目，且整體 UI 佈局完美還原舊專案。
- [ ] **即時圖表平滑渲染**：即時動態圖表與數據面板組件化完成，API 輪詢與資料推入陣列的過程順滑不閃爍。
- [ ] **消除非同步報錯**：具備 Null-safe 機制與初次載入的 Loading 骨架屏，在任何網路連線速度下，絕不出現「載入失敗」、「沒有資料」或報錯。
- [ ] **嚴密的生命週期防護**：`onUnmounted` 已實作 100% 清理機制，包含：`clearInterval`、`AbortController` 請求中斷、圖表實例 `dispose()`。
- [ ] **原始碼深度解耦**：徹底摒棄舊版 jQuery 操作與全域變數依賴，完全符合 Vue 3 Composition API 與響應式狀態管理規範。
- [ ] **型別安全守線**：執行 `npx tsc --noEmit` 檢查結果為 0 Error。
