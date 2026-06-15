# vue3-wrt-project 專案資料夾結構詳解

> 簡報說明用文件 — 逐一說明每個資料夾與檔案的用途
> 產生日期：2026-06-15

---

## 一、專案總覽（一句話定位）

本專案是 **ASUS / ROG 路由器韌體內建 Web 管理介面（ASUSWRT GUI）的現代化重構版**。
原本路由器韌體的網頁是傳統的 `.asp` + jQuery 寫法，本專案以 **Vue 3 SPA** 的方式重新打造同一套 UI，最終打包後的靜態檔案會直接由路由器內建的 `httpd` 伺服器提供服務。

### 技術棧（Tech Stack）

| 類別 | 技術 | 用途 |
|------|------|------|
| 前端框架 | **Vue 3**（Composition API + `<script setup>`） | UI 元件與響應式 |
| UI 元件庫 | **Quasar 2** | 版面（Layout / Drawer / Page）、元件、SASS 主題 |
| 狀態管理 | **Pinia** | 全域狀態（裝置資訊、認證、QIS 設定流程） |
| 路由 | **Vue Router**（Hash 模式） | 頁面導航，路由器環境不支援 History API |
| 多國語系 | **vue-i18n** | 25 種語言切換 |
| HTTP | **Axios** | 對路由器 CGI / NVRAM API 發送請求 |
| 圖表 | **Chart.js** | 流量分析 / 即時流量圖表 |
| 建置工具 | **Vite 8** | 開發伺服器、Proxy、打包 |
| 單元測試 | **Vitest**（jsdom） | 元件 / store / util 測試 |
| E2E 測試 | **Playwright** | 跨瀏覽器端對端測試 |
| 程式碼品質 | **ESLint + oxlint + Prettier** | Lint 與格式化 |

### 核心架構概念

- **CGI / NVRAM API 模式**：路由器後端不是 REST API，而是透過 `appGet.cgi`（讀取 hook / nvram）與 `applyapp.cgi`（寫入設定）溝通。本專案的 `src/api/` 把這套舊式介面封裝成乾淨的函式。
- **QIS（Quick Internet Setup，快速設定精靈）**：佔全專案最大宗（80+ 頁面），是首次設定路由器的多步驟引導流程，涵蓋各種 WAN 連線型態、AiMesh、DSL、AP/WISP/Mesh 模式等。
- **Mock 降級機制**：本機開發若沒有實體路由器，Vite proxy 失敗時會自動注入假資料，避免畫面卡在「載入失敗」。

---

## 二、根目錄檔案（專案設定與入口）

| 檔案 | 用途說明 |
|------|----------|
| `package.json` | 專案描述、相依套件、npm 腳本（`dev` / `build` / `test:unit` / `test:e2e` / `lint` / `format` / `verify:all`）。 |
| `pnpm-lock.yaml` | pnpm 套件鎖定檔，確保每次安裝版本一致。 |
| `index.html` | SPA 唯一的 HTML 入口；`<div id="app">` 為 Vue 掛載點，標題為「ASUS Router」。 |
| `vite.config.ts` | Vite 設定核心。重點：①開發模式下將 `*.cgi` / `*.asp` 等請求 **proxy 到路由器**；②處理 ASUS 舊式 httpd 回傳畸形 304 的相容性問題；③打包時的 chunk 切分策略（vendor / QIS / views / locales 分包）。 |
| `vitest.config.ts` | 單元測試設定，使用 jsdom 環境，掃描 `__tests__` / `__test__` 內的 `.test.ts`。 |
| `playwright.config.ts` | E2E 測試設定，跨 Chromium / Firefox / WebKit 三瀏覽器，自動啟動 dev server。 |
| `tsconfig.json` | TypeScript 編譯設定，繼承 Vue 官方 DOM 設定，定義 `@/*` 路徑別名指向 `src/`。 |
| `env.d.ts` | TypeScript 型別宣告，讓 `.png` / `.svg` / `.jpg` 等資源可被 import。 |
| `eslint.config.ts` | ESLint 扁平設定（Vue + TS + Playwright + Vitest + oxlint 整合）。 |
| `.oxlintrc.json` | oxlint（高速 Rust 版 linter）設定，先跑一輪正確性檢查。 |
| `.prettierrc.json` / `.prettierignore` | Prettier 格式化規則與忽略清單。 |
| `.editorconfig` | 跨編輯器的基礎排版規則（縮排、換行）。 |
| `.gitattributes` / `.gitignore` | Git 屬性與忽略清單。 |
| `.env.development` | 開發環境變數：設定 `VITE_ROUTER_URL`（路由器位址），API base 留空走 Vite proxy。 |
| `.env.production` | 正式環境變數：API 走同源相對路徑（由路由器 httpd 直接服務）。 |
| `README.md` | 專案簡介。 |
| `LICENSE` | 授權條款。 |
| `.vscode/extensions.json` | 推薦的 VS Code 擴充套件。 |
| `.claude/launch.json` | Claude Code 工具相關設定。 |

---

## 三、`src/` — 應用程式原始碼（核心）

### 3.1 應用入口

| 檔案 | 用途說明 |
|------|----------|
| `src/main.ts` | **應用程式啟動入口**。建立 Vue app，依序註冊 Pinia、Router、Quasar（含 Loading 外掛與中文語系）、i18n，最後掛載到 `#app`。 |
| `src/App.vue` | **根元件**，負責頂層版面切換邏輯：①認證確認中 → 顯示 Loading；②未認證 → 顯示 Login；③QIS 流程 → 精簡版面（無側欄）；④已認證 → 完整版面（Header + 左右抽屜 + 頁面容器）。 |
| `src/i18n.ts` | i18n 初始化。以 `import.meta.glob` 自動載入 `locales/*.ts` 全部語系檔，預設語言 TW、fallback EN。 |

---

### 3.2 `src/api/` — 後端通訊層（CGI / NVRAM API）

封裝路由器舊式 CGI 介面，是前端與路由器溝通的唯一管道。

#### `src/api/core/` — HTTP 核心
| 檔案 | 用途 |
|------|------|
| `http.ts` | 建立 Axios 實例（`withCredentials`、10s timeout），並**依序註冊四個攔截器**（auth → form → mock → response）。 |
| `types.ts` | HTTP 實例與請求/回應的 TypeScript 型別定義。 |

#### `src/api/plugins/` — Axios 攔截器（順序很重要）
| 檔案 | 用途 |
|------|------|
| `auth.plugin.ts` | 認證攔截器：處理 session / 未授權導轉。 |
| `form.plugin.ts` | 表單攔截器：將 POST 資料轉成路由器期望的 form-urlencoded 格式。 |
| `mock.plugin.ts` | **Mock 降級攔截器**：開發模式下若後端不存在（404 / 連線失敗），自動注入假資料，避免畫面卡死。嚴格限定僅 dev 生效。 |
| `response.plugin.ts` | 回應攔截器：統一解包回應 body、錯誤處理。 |

#### `src/api/module/` — 各功能域 API 模組
| 檔案 | 用途 |
|------|------|
| `auth.api.ts` | 登入 / 登出 API（`login.cgi` / `logout.cgi`）。 |
| `device.api.ts` | 裝置資訊查詢（型號、支援能力、網路狀態）。 |
| `dashboard.api.ts` | 儀表板診斷 CGI（流量、乙太網埠狀態、活躍裝置、DNS ping、Aura 燈效）。 |
| `gameAcceleration.api.ts` | 電競加速相關 API（三段加速、Trend Micro EULA）。 |
| `trafficAnalyzer.api.ts` | 流量分析統計 API（WAN / App 流量）。 |
| `trafficMonitor.api.ts` | 即時流量監控 API。 |
| `user.api.ts` | 使用者 / 帳號相關 API。 |

#### `src/api/mock/` — 開發用假資料
| 檔案 | 用途 |
|------|------|
| `dashboard.mock.ts` | 儀表板假資料產生器（無後端時使用）。 |
| `trafficAnalyzer.mock.ts` | 流量分析假資料。 |
| `trafficMonitor.mock.ts` | 即時流量假資料。 |

#### 根層 API（共用基礎）
| 檔案 | 用途 |
|------|------|
| `hook.api.ts` | 封裝 `appGet.cgi?hook=xxx()` 的 hook 查詢（路由器資料讀取的主要方式）。 |
| `nvram.api.ts` | 封裝 NVRAM 讀寫：`nvram_get` / `nvram_default_get` 讀取設定值，`applyapp.cgi` 寫入設定。 |
| `reboot.api.ts` | 重新開機 API。 |

---

### 3.3 `src/stores/` — Pinia 全域狀態管理

> 命名約定：`xxx.ts` 為 store 本體；`xxx.parsers.ts` 為純函式資料解析器（把路由器回傳的原始字串轉成型別化物件，方便獨立測試）。

| 檔案 | 用途 |
|------|------|
| `auth.store.ts` | **認證狀態**：`isAuthenticated` / `authReady`，提供 `checkAuth` / `login` / `logout`。 |
| `device.store.ts` | **裝置資訊中樞**：型號、`deviceSupport`（機種能力旗標）、運作模式、乙太 WAN 清單等，是全 App 判斷硬體差異的依據。 |
| `systemVariable.ts` | **QIS 流程系統變數**：運作模式、AP 掃描清單（papList）、多頻段 PAP 追蹤等設定精靈狀態。 |
| `qisPostData.ts` | **QIS 表單暫存**：累積整個設定精靈過程要送出的 postData，提供 set / update / remove / insert 模板操作。 |
| `dashboard.ts` | 儀表板狀態（整合多個診斷 API 資料）。 |
| `dashboard.parsers.ts` | 儀表板原始資料解析器（WAN、CPU/RAM、流量、DNS ping、埠狀態、Aura、WiFi、裝置清單）。 |
| `gameAcceleration.ts` | 電競加速狀態。 |
| `trafficAnalyzer.ts` / `trafficAnalyzer.parsers.ts` | 流量分析狀態與解析器。 |
| `trafficMonitor.ts` / `trafficMonitor.parsers.ts` | 即時流量監控狀態與解析器。 |

---

### 3.4 `src/views/` — 頁面元件（路由對應）

#### 頂層頁面（非 QIS）
| 檔案 | 用途 |
|------|------|
| `Dashboard.vue` | **儀表板首頁**：WAN 資訊、系統狀態、乙太網埠、裝置清單、Aura RGB、即時流量等卡片彙整。 |
| `Login.vue` | 登入頁。 |
| `GameBoost.vue` / `GameAcceleration/GameAcceleration.vue` | 電競加速頁。 |
| `AiProtection.vue` | AiProtection 安全防護頁。 |
| `OpenNAT.vue` | OpenNAT（遊戲連接埠）頁。 |
| `ParentControls.vue` | 家長監護頁。 |
| `TrafficAnalyzer/Statistics/TrafficAnalyzer.vue` | 流量分析統計頁。 |
| `TrafficMonitor/TrafficMonitor.vue` | 即時流量監控頁。 |
| `QIS_wizard.vue` | **QIS 精靈外殼**：所有 QIS 子頁面的 `<RouterView>` 容器與共用版面。 |

#### `src/views/QIS/` — 快速設定精靈（80+ 子頁面）
這是專案最龐大的區塊，每個檔案對應設定流程中的一個步驟畫面。依功能分群：

- **流程起點**：`Welcome.vue`、`OperationMode.vue`（選運作模式）、`ChooseRole.vue`、`AdvancedSettings.vue`、`ChangePassword.vue`。
- **WAN 連線設定**：`WanPhyType.vue`、`WanProtocolType.vue`、`PPPoE.vue`、`StaticIp.vue`、`WanDhcpOption.vue`、`AutoWanHint.vue`、`SpecialIspRequirement.vue`。
- **無線設定**：`WirelessSettings.vue`、`SiteSurvey.vue`、`PapList.vue`、`WlcKey.vue`、`AxMode.vue`。
- **AiMesh（多節點組網）**：`AmasIntro.vue`、`AmasNode.vue`、`AmasSearch.vue`、`AmasOnboarding.vue`、`AmasBundle.vue`、`AmasRestore.vue`、`AmasConnCap.vue`、`AmasOption.vue`、`AmasErrConnRouter.vue`、`AmasErrManual.vue`。
- **AP / WISP / Mesh 模式**：`WispMode.vue`、`MeshMode.vue`、`WaitingAp.vue`、`NoWanAp.vue`、`ResetModemAp.vue`。
- **特殊 ISP（日本 v6plus / OCN / DS-Lite）**：`V6Plus.vue`、`V6Opt.vue`、`OcnVc.vue`、`DsLite.vue`、`Waiting46.vue`、`Wan46Detection.vue`、`Wan46Result.vue`。
- **DSL 機種專用**：`DslPppConfig.vue`、`DslMerConfig.vue`、`DslManualSetting.vue`、`DslIptv.vue`、`DslWaiting.vue` 等十餘頁。
- **行動網路 / SIM**：`UsbModem.vue`、`PhoneAsModem.vue`、`SimPin.vue`、`SimPuk.vue`、`SimUnlock.vue`。
- **Site-to-Site VPN**：`Site2Site.vue`、`Site2SiteWifiSelect.vue`、`Site2SiteSummary.vue`、`VpnSettings.vue`、`VpnIpType.vue`。
- **SDN / IoT 情境**：`SdnIot.vue`、`SdnScenarios.vue`。
- **等待 / 完成 / 韌體**：`Waiting.vue`、`WaitingDsl.vue`、`Finish.vue`、`FirmwareUpdate.vue`、`Upgrading.vue`。
- **法律條款**：`AsusToS.vue`、`TmToS.vue`、`PolicyPage.vue`。

---

### 3.5 `src/components/` — 可重用元件

| 子資料夾 / 檔案 | 用途 |
|------|------|
| `Dialog.vue` | 共用對話框元件。 |
| `LanguageList.vue` | 語言選單元件。 |
| `icons/`（39 個 `Icon*.vue` + `index.ts`） | **SVG 圖示元件庫**，涵蓋功能選單、品牌 Logo（ASUS / ROG）、操作圖示，由 `index.ts` 統一匯出。 |
| `dashboard/` | **儀表板卡片元件群**：`DashboardCard`（卡片殼）、`WanInfoCard`、`SystemStatusCard`、`EthernetPortsCard` + `PortTile`、`ClientsCard`、`AuraRgbCard` + `AuraEffectPreview`、`TrafficMonitorCard`、`WifiInsightCard`、`DnsTestCard`、`SparklineChart`（迷你折線圖）。另有 `aura.assets.ts`（燈效圖檔對照）、`dashboard.strategies.ts`（**機種硬體差異策略表**）。 |
| `qis/` | QIS 共用元件：`QisContentPanel` / `QisSidebarPanel`（左右版面）、`ActionButtonLayout`（操作按鈕列）、`PasswordStrengthBar`（密碼強度條）。 |
| `game_acceleration/` | 電競加速元件：`GameDeviceLevel` / `GamePacketLevel` / `GameServerLevel`（三段加速）、`TermsAgreement`。 |
| `traffic_analyzer/statistics/` | 流量分析圖表：`TrafficDoughnut`（環圈圖）、`TrafficTrendChart`（趨勢圖）、`TrafficStatisticsTable`（統計表）、`TrafficFilterBar`、`Top5Card`。另有 `chartjs.ts`（Chart.js 註冊）。 |
| `TrafficMonitor/` | 即時流量元件：`RealTimeTrafficChart`、`InterfaceSelector`、`InterfaceTrafficCard`、`TrafficSpeedMetrics`。 |

---

### 3.6 `src/composables/` — 組合式函式（可重用邏輯）

| 檔案 | 用途 |
|------|------|
| `useQisNavigation.ts` | **QIS 模式導航核心**：封裝各運作模式（RT / AP / RP / Mesh / WISP）的 postData 設定與頁面跳轉邏輯。 |
| `useQisSubmit.ts` | QIS 設定送出邏輯。 |
| `useTheme.ts` | 主題系統（依機種套用 ROG / ASUS 品牌色與深淺色）。 |
| `useMenu.ts` | 側邊選單建構。 |
| `useChangeLanguage.ts` / `useLanguageList.ts` | 語言切換與語言清單。 |
| `useDialog.ts` | 對話框控制。 |
| `useLoading.ts` | 全域載入狀態。 |
| `usePolling.ts` | 輪詢機制（定時刷新即時資料）。 |
| `useReboot.ts` | 重新開機流程控制。 |

---

### 3.7 `src/layouts/` — 版面元件

| 檔案 | 用途 |
|------|------|
| `Header.vue` | 頂部標題列（Logo、選單切換、登出、重開機、語言）。 |
| `Navigation.vue` | 左側功能導航抽屜。 |
| `RightDrawer.vue` | 右側抽屜（次要設定 / 資訊）。 |

---

### 3.8 設定 / 常數 / 型別 / 工具 / 服務

| 資料夾 | 檔案 | 用途 |
|------|------|------|
| `src/config/` | `menu.ts` | 功能選單結構定義。 |
| | `iconMap.ts` | 選單字串 → 圖示元件對照表。 |
| `src/constants/` | `qisPostDataTemplates.ts` | **QIS postData 模板常數**：各運作模式 / WAN 型態的預設設定物件（對應 legacy `qisData.js`）。 |
| `src/types/` | `menu.ts` | 選單項目型別。 |
| | `papProfile.ts` | AP 掃描檔案（PAP）型別。 |
| `src/services/` | `logout.service.ts` | 登出服務：呼叫 API 清 session + 重設狀態 + 導回首頁。 |
| `src/utils/` | `index.ts` | 工具函式統一匯出。 |
| | `qis.ts` | QIS 流程判斷工具。 |
| | `isSupport.ts` | **判斷機種是否支援某功能**（讀 `rc_support`）。 |
| | `isSwMode.ts` | 判斷目前運作模式（RT / AP / RP…）。 |
| | `menuRules.ts` | 選單顯示規則。 |
| | `sdnCompat.ts` | SDN（軟體定義網路）相容性判斷。 |
| | `validators.ts` | 表單驗證（IP / 密碼 / 欄位）。 |
| | `passwordScore.ts` | 密碼強度計算。 |
| | `sha256.ts` | SHA-256 雜湊（密碼處理）。 |
| | `randomString.ts` | 隨機字串產生。 |
| | `debounce.ts` | 防抖函式。 |

---

### 3.9 `src/locales/` — 多國語系

| 內容 | 用途 |
|------|------|
| `BR/CN/CZ/DA/DE/EN/ES/FI/FR/HU/IT/JP/KR/MS/NL/NO/PL/RO/RU/SL/SV/TH/TR/TW/UK.ts`（25 檔） | **各語言翻譯字串檔**（vue-i18n 使用），預設 TW，fallback EN。 |
| `locales/dict/*.dict`（25 檔） | **Legacy 字典原始檔**：舊韌體的翻譯來源，由 `scripts/` 的注入腳本讀取後轉成上面的 `.ts`。 |

---

### 3.10 `src/assets/` — 靜態資源

| 內容 | 用途 |
|------|------|
| `main.css` / `base.css` / `button.css` / `qis.css` / `color-table.css` | 全域樣式表（基礎重置、按鈕、QIS、色彩表）。 |
| `quasar-variables.scss` | Quasar SASS 變數覆寫（品牌色）。 |
| `logo.svg` | 專案 Logo。 |
| `fonts/` | 字型檔（Roboto、Roboto Condensed、ROG 專用字型 rogfonts / xolonium）。 |
| `images/dashboard/`（含 `aura/`） | 儀表板圖片，特別是 Aura RGB 各種燈效的 SVG。 |
| `images/qis/` | QIS 流程插圖（數據機接線、AiMesh 拓樸、密碼強度漸層等）。 |
| `images/game_acceleration/` | 電競加速圖（網易 UU、Outfox、GT Booster banner）。 |
| `images/traffic_analyzer/` / `images/traffic_monitor/` | 流量相關圖示（上/下行箭頭、刪除）。 |
| `images/theme/` | 主題背景圖（ROG 深淺色背景）。 |

---

## 四、測試與工具腳本

### 4.1 `e2e/` — Playwright 端對端測試
| 內容 | 用途 |
|------|------|
| `*.spec.ts` | 測試案例：`login`、`dashboard`、`dashboard-mock`、`layout`、`game-acceleration`、`qis-four-mode`、`qis-full-flow`、`vue`。 |
| `pages/*.page.ts` | **Page Object 模式**：把頁面操作封裝成物件（`login` / `dashboard` / `gameAcceleration` / `qis`），測試碼更易讀。 |
| `tsconfig.json` | E2E 專用 TS 設定。 |

> 補充：各原始碼資料夾內的 `__tests__/`（或 `__test__/`）放的是 **Vitest 單元測試**，與被測檔案相鄰，涵蓋 api、stores、composables、utils、components、views、layouts、router。

### 4.2 `scripts/` — 一次性建置工具
| 檔案 | 用途 |
|------|------|
| `inject-dashboard-locales.mjs` | 把儀表板所需字串從 legacy `.dict` 注入到 `locales/*.ts`。 |
| `inject-game-acceleration-locales.mjs` | 同上，電競加速字串。 |
| `inject-traffic-analyzer-locales.mjs` | 同上，流量分析字串。 |
| `inject-traffic-monitor-locales.mjs` | 同上，即時流量字串。 |

### 4.3 `public/`
| 檔案 | 用途 |
|------|------|
| `favicon.ico` | 網站圖示，建置時原樣複製到輸出根目錄。 |

---

## 五、整體資料流（簡報重點圖解）

```
使用者操作
    │
    ▼
 views / components （畫面）
    │  呼叫
    ▼
 composables （可重用邏輯，如 useQisNavigation）
    │  讀寫
    ▼
 stores (Pinia) ──► parsers （把原始字串解析成型別物件）
    │  發送請求
    ▼
 api/module ──► api/core/http（Axios + 4 個攔截器）
    │
    ├─ 正式：proxy / 同源 ──► 路由器 CGI（appGet.cgi / applyapp.cgi）
    └─ 開發無後端：mock.plugin ──► api/mock 假資料
```

---

## 六、簡報一句話總結

> 這是一套 **以 Vue 3 + Quasar + Pinia 重構的 ASUS 路由器 Web 管理介面**，
> 透過 `src/api` 封裝舊式 CGI/NVRAM 後端，核心是龐大的 **QIS 快速設定精靈（80+ 頁）**，
> 並具備 **Mock 降級**、**25 國語系**、**機種能力差異策略**、**完整單元＋E2E 測試** 等工程化設計。
