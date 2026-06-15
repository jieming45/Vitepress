# ASUS Router Web GUI (Vue 3) 專案結構與檔案分析報告

本報告詳細剖析 ASUS 路由器全新網頁設定介面 (基於 Vue 3, Vite, Quasar) 的資料夾與檔案結構，適合做為專案架構簡報與技術交接使用。

## 1. 專案總覽與根目錄檔案

此專案是基於 Vue 3 組合式 API (Composition API) 打造的單頁應用程式 (SPA)，使用 Vite 作為建置工具，Pinia 作為狀態管理，Quasar 作為 UI 元件庫，並透過 TypeScript 確保型別安全。

### 核心設定檔
- **`package.json`**: 專案的核心設定檔。定義了專案依賴 (Vue, Quasar, Pinia, Axios, Chart.js) 與開發腳本 (如 `dev`, `build`, `test:e2e`, `lint`, 以及各類語系注入腳本)。
- **`vite.config.ts`**: Vite 建置設定。配置了 Vue、Quasar 插件，路徑別名 (`@` 指向 `src`)，以及開發環境的 Proxy 設定 (將 API 請求代理至實體路由器的 CGI 端點)。也包含了詳細的 chunk 分割策略 (vendor splitting)。
- **`tsconfig.json`**: TypeScript 根編譯設定，整合 Vue 建議的設定，並嚴格檢查型別 (啟用 `noUnusedLocals`, `erasableSyntaxOnly` 等)。
- **`eslint.config.ts` / `.oxlintrc.json`**: 程式碼語法檢查設定。結合了 ESLint (Vue/TS 規則) 與極速的 oxlint 進行雙層驗證。
- **`.prettierrc.json` / `.prettierignore`**: 程式碼格式化工具 Prettier 的設定檔，確保團隊有統一的程式碼排版風格。
- **`vitest.config.ts`**: Vitest 單元測試框架設定，配置 jsdom 模擬瀏覽器環境。
- **`playwright.config.ts`**: Playwright 端到端 (E2E) 測試框架設定，支援多瀏覽器 (Chromium, Firefox, WebKit) 測試。
- **`index.html`**: 應用程式的進入點，Vite 從此處掛載 `src/main.ts`。
- **`env.d.ts`**: 定義 TypeScript 環境變數型別，確保 `import.meta.env` 的自動補全與型別檢查。
- **`.env.development` / `.env.production`**: 開發與正式環境變數。主要差異在於開發模式會啟用 Mock 資料機制 (`VITE_MOCK_MODE`) 並設定代理伺服器 URL，而正式環境會直接使用相對路徑呼叫路由器內的 CGI。

## 2. 核心原始碼 (`src/`) 目錄解析

`src/` 目錄包含了所有前端的商業邏輯、UI 元件與狀態管理。

### 2.1 應用程式進入點
- **`src/main.ts`**: 應用程式初始化入口。實體化 Vue，並掛載 Pinia, Vue Router, vue-i18n 與 Quasar。
- **`src/App.vue`**: 根元件。管理全域的版面狀態 (如：登入前/登入後/QIS 設定精靈)，並初始化主題 (ASUS/ROG) 與載入設備資訊。
- **`src/i18n.ts`**: 國際化 (i18n) 設定檔。動態載入多國語系，預設語言為繁體中文 (TW)。

### 2.2 `api/` (後端 API 請求與攔截器)
負責所有與路由器後端 (CGI) 的通訊。
- **`core/`**: 包含 `http.ts` (建立 Axios 實體與註冊攔截器) 及 `types.ts` (API 共用型別)。
- **`module/`**: 各功能的 API 呼叫模組。
  - `auth.api.ts`: 登入 (支援 legacy 與 v2 nonce)、登出與 Token 管理。
  - `dashboard.api.ts`: 首頁儀表板資料 (系統狀態、WAN、流量、DNS 測試、Aura RGB 控制)。
  - `gameAcceleration.api.ts`: 遊戲加速功能 (ROG First, Game Boost) 的設定讀寫。
  - `trafficAnalyzer.api.ts` / `trafficMonitor.api.ts`: 流量分析與即時流量監控 API。
  - `nvram.api.ts` / `hook.api.ts`: 路由器核心底層的 NVRAM 讀寫與 Hook 執行。
- **`plugins/`**: Axios 攔截器插件。
  - `auth.plugin.ts`: 權限檢查與傳遞。
  - `form.plugin.ts`: 自動將請求轉換為表單格式 (CGI 需求)。
  - `response.plugin.ts`: 解析 CGI 回傳結構，處理錯誤代碼。
  - `mock.plugin.ts`: 開發環境使用的攔截器，當無法連線到實體路由器時，自動切換至 Mock 資料。
- **`mock/`**: 提供各模組的開發用假資料 (Dashboard, Traffic Analyzer/Monitor)。

### 2.3 `stores/` (Pinia 狀態管理)
集中管理跨元件的響應式狀態與資料解析。
- **`auth.store.ts`**: 管理登入狀態與 Token。
- **`device.store.ts`**: 儲存路由器型號、硬體支援能力 (Capabilities) 與運作模式 (Router/AP 等)。
- **`dashboard.ts` & `dashboard.parsers.ts`**: 首頁 8 大模塊的狀態機管理，並透過 parsers 將後端 Legacy 格式字串轉換為前端強型別物件。
- **`gameAcceleration.ts`**: 遊戲加速的 3 階段狀態與 EULA 條款狀態。
- **`qisPostData.ts` / `systemVariable.ts`**: QIS (快速設定精靈) 流程中暫存的使用者輸入表單與系統全域變數。
- **`trafficAnalyzer.ts` / `trafficMonitor.ts` (含 parsers)**: 管理複雜的流量歷史數據與即時監測圖表狀態。

### 2.4 `views/` (頁面視圖)
對應 Router 的主要頁面。
- **`Login.vue`**: 登入頁面，包含圖形驗證碼與錯誤鎖定邏輯。
- **`Dashboard.vue`**: 首頁儀表板，負責排列與顯示各類 Widget 卡片。
- **`GameAcceleration/` / `TrafficMonitor/` / `TrafficAnalyzer/`**: 各大型獨立功能的專屬頁面。
- **`QIS/` (Quick Internet Setup)**: 包含高達 80 個 Vue 元件的龐大精靈流程。涵蓋：歡迎頁 (`Welcome.vue`)、密碼設定 (`ChangePassword.vue`)、無線網路 (`WirelessSettings.vue`)、PPPoE (`PPPoE.vue`)、完成重啟 (`Finish.vue`)，以及各種模式 (DSL, 4G/5G, AiMesh) 的設定頁面。

### 2.5 `components/` (UI 元件)
- **`dashboard/`**: 儀表板上的各個區塊卡片 (如 `SystemStatusCard.vue`, `WanInfoCard.vue`, `AuraRgbCard.vue`)。
- **`game_acceleration/`**: 遊戲加速的三階段設定面板 (Device, Packet, Server Level)。
- **`TrafficMonitor/` / `traffic_analyzer/`**: 流量圖表 (Chart.js 封裝)、速度儀表板、排行榜元件。
- **`qis/`**: QIS 精靈共用佈局 (如底部按鈕 `ActionButtonLayout.vue`、密碼強度條 `PasswordStrengthBar.vue`)。
- **`icons/`**: 統一存放所有系統使用的 SVG 圖示元件 (如 Logo, 選單 icon)。
- **共用元件**: `Dialog.vue` (確認視窗), `LanguageList.vue` (多語系下拉選單)。

### 2.6 `composables/` (組合式函數/Hooks)
封裝可重複使用的商業邏輯與生命週期。
- **`useMenu.ts`**: 極為龐大的動態選單生成器。根據 `device.store` 判斷當前型號支援的功能，動態生成左側選單樹。
- **`useQisNavigation.ts` & `useQisSubmit.ts`**: 掌管 QIS 精靈複雜的分支導航邏輯 (如從 Router 模式切換到 AP 模式的頁面跳轉) 與最終資料提交。
- **`useTheme.ts`**: 管理 ASUS 標準版與 ROG 電競版的 CSS 變數切換與深淺色模式。
- **`useLoading.ts`**: 管理帶有倒數計時進度條的全畫面載入遮罩 (常用於重啟或套用設定時)。
- **`usePolling.ts`**: 管理需定期向後端更新資料的輪詢邏輯 (如即時流量監控)。

### 2.7 `router/` (路由管理)
- **`index.ts`**: 定義全部的頁面路由。使用 Hash 模式以相容路由器內嵌環境。並實作了路由守衛 (Navigation Guards) 進行登入權限檢查。

### 2.8 `layouts/` (頁面版面配置)
- **`Header.vue`**: 頂部導覽列 (Logo, 重啟/登出按鈕, 語系切換)。
- **`Navigation.vue`**: 左側主選單，支援多層級展開，並與路由聯動高亮顯示。
- **`RightDrawer.vue`**: 針對行動裝置設計的右側滑出式選單，或用於顯示特定功能的幫助文件 (Help)。

### 2.9 `utils/` (共用工具庫)
- **`isSupport.ts` / `isSwMode.ts`**: 快速判斷硬體功能與運作模式的檢查函數。
- **`validators.ts`**: 各類表單驗證器 (IP, MAC, SSID, 密碼格式)。
- **`passwordScore.ts`**: 複雜的密碼強度計分演算法。
- **`qis.ts` / `sdnCompat.ts`**: QIS 專屬的網路設定字串轉換與 SDN (Software Defined Network) 相容性檢查工具。
- **`sha256.ts`**: 登入密碼加密工具。

### 2.10 `assets/` (靜態資源)
- **`css/`**: 包含全局樣式 (`base.css`, `main.css`)、按鈕共用樣式 (`button.css`)、QIS 專屬龐大樣式 (`qis.css`) 以及定義所有主題顏色的 `color-table.css` 與 Quasar 變數 `quasar-variables.scss`。
- **`images/`**: 依功能分類 (dashboard, qis, theme 等) 存放 SVG/PNG 圖檔。包含 ROG 與標準版的雙背景圖，以及 Aura RGB 預覽用的遮罩圖。
- **`fonts/`**: Roboto 家族字體、ROG 專屬字體 (ROG Fonts, Xolonium)。

### 2.11 `locales/` (多國語系)
- **`*.ts` (25個語言檔)**: 採用 TypeScript 模組輸出的語系定義，包含 EN, TW, CN 等 25 國語言。
- **`dict/`**: 舊版 ASUSWRT 的字典檔 (Dictionary)。目前做為開發與遷移時的資料來源。

### 2.12 其他目錄 (`types/`, `constants/`, `services/`)
- **`types/`**: 全域 TypeScript 介面 (如 `menu.ts`, `papProfile.ts`)。
- **`constants/`**: 靜態常數，例如 `qisPostDataTemplates.ts` 定義了 QIS 各種模式預設的 NVRAM payload 結構。
- **`services/`**: 跨領域的業務邏輯，如 `logout.service.ts` 統整了 API 呼叫、狀態清除與頁面導向的登出流程。

## 3. 根目錄其他資料夾

### `e2e/` (端到端測試)
使用 Playwright 進行頁面整合測試。包含 `login.spec.ts`, `dashboard.spec.ts`, `game-acceleration.spec.ts` 以及 QIS 流程的自動化測試腳本。內部 `pages/` 目錄採用了 Page Object Model (POM) 設計模式。

### `scripts/` (自動化腳本)
包含多個 `inject-*-locales.mjs` (Node.js 腳本)。用途是在開發/建置階段，從舊版的 `dict/` 字典檔中提取特定功能 (Dashboard, Game Acceleration, Traffic Analyzer) 的翻譯字串，並自動注入到新版的 `.ts` 語系檔中，大幅節省人工遷移翻譯的時間。

### `.vscode/` & `.claude/`
- **`.vscode/extensions.json`**: 定義推薦開發者安裝的 VS Code 擴充套件清單 (如 Vue Volar, ESLint, Prettier, oxlint)。
- **`.claude/launch.json`**: AI 輔助開發工具 Claude Code 的啟動設定。

---
*產生時間：2026-06-15*
