這份「載入失敗」與「沒有資料」的痛點，在從 jQuery/Legacy 轉換到 Vue 3 SPA 的過程中非常經典。通常是因為舊版代碼依賴了某些全域變數、特定的 DOM 掛載順序、隱含的 Token/Cookie，或是舊版 `$.ajax` 回呼與現今 `async/await` 的生命週期不同步所導致。

為了解決這個問題，我大幅強化了 **「API Hook 攔截與重建」** 以及 **「非同步狀態防呆 (Null-safe)」** 的規範。以下是為您更新的 Loop Markdown 指令（V2 升級版），您可以直接交給 AI 代理執行：

---

# 任務：自動化遷移與驗證 vue3-wrt-project Dashboard 流程與組件化重構 (SPA 優化升級版 V2)

## 1. 任務核心目標與背景 (Core Objective & Context)

- **目標：** 深度解耦舊專案 Dashboard 的核心商務邏輯、API 請求層與視覺元件，將其精準移植並重構至 Vue 3 專案中。
- **背景：** 前次移植遺漏了多個關鍵硬體與監控區塊，且經常發生「載入失敗」或「沒有資料」的問題。本次重構重點為：徹底分析舊專案 `dashboard.module.js` 中的 **API Hook 與資料請求時序**，確保所有網路請求被正確萃取、封裝，並透過 Pinia 進行嚴格的狀態與錯誤管理，徹底根除 SPA 架構下的非同步 Race Condition 與記憶體洩漏。

---

## 2. 操作環境與可用工具 (Environment & Tools)

- **舊專案參考路徑 (Legacy Sources)：**
- 頁面結構：`C:\Users\Jieming\Documents\GitHub\www\dashboard\pages\dashboard.html`
- 核心邏輯：`C:\Users\Jieming\Documents\GitHub\www\dashboard\js\dashboard.module.js`

- **新專案目標路徑 (Vue 3 Target)：**
- 主頁面視圖：`packages/shared/src/views/Dashboard.vue` (對接既有 SPA Layout)
- 子組件目錄：`packages/shared/src/components/dashboard/`
- 狀態管理中心：`packages/shared/src/stores/dashboard.ts`
- API 請求封裝：`packages/shared/src/api/` (若有既有 Axios/Fetch instance 請延用)

- **專案根目錄（指令執行點）：** `C:\Users\Jieming\Documents\GitHub\vue3-wrt-project`
- **可用驗證指令：** `npm run type-check`、`npm run test:unit`、`npm run test:e2e`

---

## 3. 自主執行步驟與自我修正引導 (Autonomous Workflow - LOOP)

### 步驟一：舊版 API Hook 解析與嚴格型別資料流設計 (Analyze & API Extraction)

1. **深度審查 `dashboard.module.js` 與 API 依賴分析**：

- **找出所有請求 (Find Hooks)**：精確盤點舊版用於獲取 WAN、系統、DNS、流量、Port 狀態的 API endpoints 與觸發函數（如 `$.ajax`, `fetch` 或自製 request 方法）。
- **依賴解耦 (Decouple Dependencies)**：嚴格檢查舊版 API 請求前，是否依賴了 `window` 全域變數（如 `window.wan_status`）、隱藏 DOM 的 value，或是特定的 Session/Token。必須將這些參數依賴轉換為 Pinia Store 的 getters 傳遞。

1. **建構 `dashboardStore` (Pinia) 與高容錯請求層**：

- 將 API 請求完全收攏至 Store Actions。
- **非同步防呆與預設值 (Null-safe)**：強制定義回傳資料的 TypeScript Interfaces。在 API 請求處於 `pending` 或是回傳 `error/null` 時，**Store 必須提供結構完整的預設值（Default Initial State）**，絕對禁止傳遞 `undefined` 給組件導致畫面破版或「載入失敗」。
- 實作資料快取 (Cache)，避免頻繁切換路由導致重複發送初始化請求。

### 步驟二：補齊並重構 7 大核心 Widget 子組件 (Implement & Fix)

主頁面 `Dashboard.vue` 僅負責 Layout 排版與呼叫 Store，具體 UI 必須拆分為以下獨立子組件（位於 `components/dashboard/`）。**每個組件必須實作 Loading 骨架屏 (Skeleton) 與 Error Boundary：**

- **1. WAN 資訊卡片 (`WanInfoCard.vue`)**
- 必須支援 Single WAN / Dual WAN 動態架構渲染。精準顯示網路連線狀態、WAN IP、DNS 伺服器、Subnet Mask。

- **2. 系統資訊與效能圖表卡片 (`SystemStatusCard.vue`)**
- 即時顯示 CPU 使用率、RAM 剩餘與佔用空間。整合 Vue 3 相容之輕量圖表組件，重現歷史效能波動圖。

- **3. DNS 測試卡片 (`DnsTestCard.vue`)**
- 遷移舊版 DNS 診斷互動邏輯，具備獨立的局部 Loading 與結果顯示區。

- **4. AURA RGB 控制卡片 (`AuraRgbCard.vue`)**
- 連動 API 發送燈效控制指令，並保持當前狀態的響應式同步。

- **5. WiFi Insight 無線洞察卡片 (`WifiInsightCard.vue`)**
- 完整呈現無線網路負載、各頻段通道佔用情形與連線用戶數統計。

- **6. 流量監控卡片 (`TrafficMonitorCard.vue`)**
- **重點修復區**：徹底解決 Race Condition 導致的「載入失敗」。利用 `v-if="store.isLoading"` 顯示骨架屏，直到 API 回傳完整資料陣列後才渲染圖表/數據，確保渲染時資料絕對存在。

- **7. 乙太網路實體埠狀態卡片 (`EthernetPortsCard.vue`)**
- **重點修復區**：確保能正確抓取實體 Port 的 API 狀態。繪製實體 Ports 示意圖（WAN/LAN 槽位），依據 API 狀態動態更換視覺燈號（綠燈 10G/2.5G、黃燈 1G、灰色 Disconnect）。

### 步驟三：嚴格的生命週期管理與防記憶體洩漏 (Lifecycle Guard)

- **API 請求時序**：資料初始化請求應在 `onMounted` 或 Route Guard 中觸發。
- **定時輪詢 (Polling) 鐵律**：
- 在 `onMounted` 啟動 `setInterval`。
- 必須在 `onUnmounted` 時明確執行 `clearInterval`，並透過 `AbortController` 取消尚未完成的 API 請求（Pending Requests），確保使用者切換至其他 SPA 頁面時，背景網路任務 100% 停止。

### 步驟四：自動化驗證與自我修復 (Verification & Hotfix)

1. 執行 `npm run type-check`，排除任何 TypeScript 型別報錯（禁止隱式 `any`）。
2. 執行 `npm run test:unit` 與 E2E 測試。
3. **如果畫面出現「沒有資料」或測試 Timeout**：立即檢視 Store 的初始狀態與 API Hook 攔截邏輯，確認是否因為非同步時差導致組件提早渲染，修正後重跑 Loop。

---

## 4. 測試矩陣與邊界情境 (Testing Matrix)

針對本次重構，測試腳本必須涵蓋以下 SPA 關鍵情境：

- **情境 A：API Hook 延遲與防呆 (Race Condition Proof)**：模擬 API 延遲 3 秒回傳，斷言所有 7 張卡片在此期間皆顯示 Loading UI，無任何「載入失敗」字眼或 JS 錯誤。
- **情境 B：路由來回切換與快取驗證**：從 `/dashboard` 跳轉至其他路由再返回，斷言 Pinia 快取讓畫面能瞬間渲染（無閃爍），且背景輪詢機制有正確重啟與銷毀。
- **情境 C：異常隔離 (Error Boundary)**：模擬單一 API (如流量監控) 回傳 500 錯誤，斷言僅該卡片顯示「錯誤與重試」UI，其餘區塊 (WAN、系統資訊等) 不受影響正常運作。

---

## 5. 完成定義 (Definition of Done, DoD)

- [ ] **API Hook 100% 萃取**：舊版 `dashboard.module.js` 中的所有資料獲取邏輯已成功轉換為 Pinia Store Actions，並具備完整的 Header/依賴綁定。
- [ ] **消除載入失敗與空白資料**：所有 7 大卡片均具備 Null-safe 機制與 Loading 骨架，在任何網路連線速度下，絕不出現「載入失敗」、「沒有資料」或空白卡片破版現象。
- [ ] **功能與視覺 100% 復原**：上述 7 大卡片（包含乙太網路 Port 燈號與圖表）均已完全組件化並正確顯示即時硬體資訊。
- [ ] **原始碼深度解耦**：完全清除舊版直接操作 DOM (`$()`, `document.getElementById`) 與 `window` 全域變數的作法。
- [ ] **型別安全守線**：執行 `npx tsc --noEmit` 檢查結果為 0 Error。
- [ ] **記憶體零洩漏**：單元與集成測試證實，切換路由後所有定時器（Timers）與未完成的 API 請求均已 100% 被清理。
