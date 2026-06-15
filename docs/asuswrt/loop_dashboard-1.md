# 任務：自動化遷移與驗證 vue3-wrt-project Dashboard 流程與組件化重構 (SPA 優化升級版 V3 - 資源與 Mock 處理)

## 1. 任務核心目標與背景 (Core Objective & Context)

- **目標：** 深度解耦舊專案 Dashboard，將商務邏輯、API 請求與「視覺靜態資源（圖檔）」精準移植至 Vue 3 專案。
- **當前痛點與背景：** 1. 在本地端 (`npm run dev:web`) 開發時，因缺乏實體 CGI 後端，導致 API (`get_diag_content_data.cgi` 等) 報錯 404，引發 UI 組件顯示「載入失敗」。

2. 乙太網路連接埠的 UI 完全空白，因舊專案的 Port 圖片/圖示（Icons/SVGs）未被正確萃取與對接。

- **本次重點：** 徹底建立 **Local Mock Data 機制**，確保在 API 404 時 UI 能顯示預設或模擬畫面以供開發；同時全面盤點 `www` 底下的靜態圖檔，並正確整合至 Vite 的資源編譯管線中。

---

## 2. 操作環境與可用工具 (Environment & Tools)

- **舊專案參考路徑 (Legacy Sources)：**
- 頁面與邏輯：`C:\Users\Jieming\Documents\GitHub\www\dashboard\pages\dashboard.html` 及 `dashboard.module.js`
- 靜態資源目錄（需全面盤點）：`C:\Users\Jieming\Documents\GitHub\www\images\`、`www/css/`、`www/graphics/` 等。

- **新專案目標路徑 (Vue 3 Target)：**
- 主頁面視圖：`packages/shared/src/views/Dashboard.vue`
- 子組件目錄：`packages/shared/src/components/dashboard/`
- 狀態管理中心：`packages/shared/src/stores/dashboard.ts`
- **靜態資源目錄 (New)：** `packages/shared/src/assets/images/dashboard/` 或專案根目錄的 `public/`
- **Mock 攔截器/假資料 (New)：** `packages/shared/src/api/mock/` 或在 Store 內部實作 Fallback。

---

## 3. 自主執行步驟與自我修正引導 (Autonomous Workflow - LOOP)

### 步驟一：靜態圖檔萃取與 Vite 資源綁定 (Asset Migration)

1. **地毯式搜索圖檔：** 分析舊版 `dashboard.html` 與相關 CSS，找出所有關於「乙太網路連接埠 (Ethernet Ports)」、「單/雙 WAN 圖示」、「系統狀態圖示」的實體檔案。
2. **資源搬移與路徑重寫：** 將找到的圖檔複製到 Vue 3 專案的 `assets/images/dashboard/` 下。
3. **組件引用規範：** 在 `EthernetPortsCard.vue` 等組件中，必須使用 Vite 支援的 `import portImage from '@/assets/...'` 或直接放入 `public/` 以絕對路徑引用，絕對不可殘留舊版的相對路徑導致圖檔 404。

### 步驟二：建構高容錯 API 層與 Mock Data 注入 (API & Mock Interception)

1. **分析 404 API Hook**：針對 `get_diag_content_data.cgi`、`get_diag_eth_traffic_data.cgi`、`get_diag_active_client.cgi` 建立完整的 Request/Response TypeScript Interface。
2. **實作本地開發 Mock 降級機制 (Fallback)**：

- 在 `dashboardStore` 或 `dashboard.api.ts` 的 Axios 攔截器中實作錯誤捕獲。
- **關鍵防呆：** 當 `import.meta.env.DEV` 為 true 且 API 回傳 404/Network Error 時，**強制注入完整的 Mock Data（假資料）**，替代 Error Throw。
- 必須讓系統資訊 (CPU/RAM)、乙太網路 Ports、流量監控等卡片，在 Mock Data 模式下能畫出完整的 UI（包括 Port 的狀態燈號與圖表）。

### 步驟三：重構與完善 7 大核心 Widget 子組件 (Implement & Fix)

- **1. 乙太網路實體埠狀態卡片 (`EthernetPortsCard.vue`)**
- **修正重點**：結合步驟一的實體圖檔與步驟二的 Mock API。利用 CSS Grid/Flex 排版重現路由器後方面板。根據 Mock 狀態動態替換圖檔（如亮綠燈的 Port 圖片 vs 灰色的 Port 圖片）。

- **2. 系統資訊與效能圖表卡片 (`SystemStatusCard.vue`)**
- **修正重點**：攔截 `get_diag_content_data.cgi` 失敗狀態，餵入模擬的 CPU/RAM 數據，確保輕量圖表組件能正確渲染波動圖，不出現「載入失敗」。

- **3-7. 其他卡片重構要求 (維持嚴格標準)**：
- WanInfoCard, DnsTestCard, AuraRgbCard, WifiInsightCard, TrafficMonitorCard 均需套用相同的 Mock 降級機制與 Loading 骨架屏。

### 步驟四：嚴格的生命週期管理與防記憶體洩漏 (Lifecycle Guard)

- **定時輪詢 (Polling) 鐵律**：在 `onMounted` 啟動 `setInterval`，並在 `onUnmounted` 時明確執行 `clearInterval`。即使在 Mock 模式下，也必須模擬定時刷新假資料的行為，以確保邏輯完整。

### 步驟五：自動化驗證與自我修復 (Verification & Hotfix)

1. 確保 `npm run type-check` 0 Error。
2. 啟動 `npm run dev:web` 環境，觀察 Console。**不允許再因為 `.cgi` 404 而導致 UI 區塊白屏或顯示載入失敗**。如有發生，AI 必須修改錯誤捕獲邏輯（Try-Catch/Promise.catch），確保 Mock Data 成功接管畫面。

---

## 4. 測試矩陣與邊界情境 (Testing Matrix)

- **情境 A：本地無後端開發模式 (Local Dev without Backend)**：啟動專案，斷言所有 Axios CGI 請求報錯 404 後，Store 成功派發 Mock Data，所有 7 張卡片畫面完整呈現，包含圖表與乙太網路 Port 圖檔。
- **情境 B：路由來回切換與資源釋放**：從 `/dashboard` 跳轉至其他路由再返回，斷言輪詢機制正確重啟與銷毀，無任何記憶體洩漏。
- **情境 C：圖檔解析正確性**：檢驗 `EthernetPortsCard.vue` 內的 DOM 元素，斷言 `<img>` src 或 `background-image` 能成功載入，非 404 狀態。

---

## 5. 完成定義 (Definition of Done, DoD)

- [ ] **靜態資源 100% 歸位**：乙太網路 Port 圖片、系統圖示等視覺資產已全數從 `www` 萃取並由 Vite 正確打包渲染，畫面不再有破損的圖檔圖示。
- [ ] **Mock 降級機制完美運作**：徹底根除本地端開發因 `.cgi` 404 導致的「載入失敗」死局。UI 必須在缺乏後端時呈現完整的開發用假資料（包含圖表波動與硬體燈號）。
- [ ] **功能與視覺 100% 組件化復原**：7 大卡片均已拆分為獨立的 Vue 3 子組件。
- [ ] **原始碼深度解耦**：完全清除舊版直接操作 DOM (`$()`) 與 `window` 全域變數的作法。
- [ ] **型別安全守線**：執行 `npx tsc --noEmit` 檢查結果為 0 Error。
- [ ] **記憶體零洩漏**：切換路由後所有定時器（Timers）與未完成的 API 請求均已 100% 被清理。
