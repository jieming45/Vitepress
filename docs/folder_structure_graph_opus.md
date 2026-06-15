# vue3-wrt-project 資料夾結構樹狀圖

> 每個檔案後標註「作用與目的」，供簡報快速導覽
> 產生日期：2026-06-15 ｜ 專案：ASUS / ROG 路由器 Web GUI（Vue 3 重構版）

---

## 圖例

- 📁 資料夾　📄 檔案　🧩 Vue 元件　🗃️ Pinia store　🌐 API　🌍 語系　🎨 樣式/資源　🧪 測試　⚙️ 設定

---

## 根目錄

```text
vue3-wrt-project/
├── 📄 package.json              # 相依套件與 npm 腳本（dev/build/test/lint/verify:all）
├── 📄 pnpm-lock.yaml            # pnpm 套件版本鎖定
├── 📄 index.html                # SPA 唯一 HTML 入口，#app 為掛載點
├── ⚙️ vite.config.ts            # Vite 設定：CGI proxy、舊式 httpd 相容、chunk 分包
├── ⚙️ vitest.config.ts          # 單元測試設定（jsdom）
├── ⚙️ playwright.config.ts      # E2E 測試設定（Chromium/Firefox/WebKit）
├── ⚙️ tsconfig.json             # TS 編譯設定，@/* 別名指向 src/
├── ⚙️ env.d.ts                  # 資源檔（png/svg/jpg）型別宣告
├── ⚙️ eslint.config.ts          # ESLint 扁平設定（Vue+TS+Playwright+Vitest）
├── ⚙️ .oxlintrc.json            # oxlint 高速正確性檢查設定
├── ⚙️ .prettierrc.json          # Prettier 格式化規則
├── ⚙️ .prettierignore           # Prettier 忽略清單
├── ⚙️ .editorconfig             # 跨編輯器排版規則
├── ⚙️ .gitattributes            # Git 屬性
├── ⚙️ .gitignore                # Git 忽略清單
├── ⚙️ .env.development          # 開發環境變數（路由器位址、走 proxy）
├── ⚙️ .env.production           # 正式環境變數（同源相對路徑）
├── 📄 README.md                 # 專案簡介
├── 📄 LICENSE                   # 授權條款
├── 📁 .vscode/
│   └── ⚙️ extensions.json       # 推薦 VS Code 擴充
├── 📁 .claude/
│   └── ⚙️ launch.json           # Claude Code 設定
├── 📁 public/
│   └── 🎨 favicon.ico           # 網站圖示（原樣複製到輸出）
├── 📁 scripts/                  # 一次性建置腳本（見下）
├── 📁 e2e/                      # Playwright E2E 測試（見下）
└── 📁 src/                      # 應用程式原始碼（核心，見下）
```

---

## 📁 src/ — 應用程式原始碼

```text
src/
├── 📄 main.ts                   # 應用啟動入口：註冊 Pinia/Router/Quasar/i18n 並掛載
├── 🧩 App.vue                   # 根元件：依認證/QIS 狀態切換頂層版面
├── 📄 i18n.ts                   # i18n 初始化，自動載入全部語系（預設 TW）
│
├── 📁 api/                      # 後端通訊層（CGI / NVRAM）
│   ├── 🌐 hook.api.ts           # 封裝 appGet.cgi?hook=xxx() 查詢
│   ├── 🌐 nvram.api.ts          # NVRAM 讀寫（nvram_get / applyapp.cgi）
│   ├── 🌐 reboot.api.ts         # 重新開機 API
│   ├── 📁 core/
│   │   ├── 🌐 http.ts           # Axios 實例 + 依序註冊 4 個攔截器
│   │   ├── 📄 types.ts          # HTTP 請求/回應型別
│   │   └── 📁 __test__/         # http 單元測試
│   ├── 📁 plugins/              # Axios 攔截器（順序關鍵）
│   │   ├── 🌐 auth.plugin.ts    # 認證/未授權處理
│   │   ├── 🌐 form.plugin.ts    # POST 轉 form-urlencoded
│   │   ├── 🌐 mock.plugin.ts    # 無後端時降級注入假資料（僅 dev）
│   │   ├── 🌐 response.plugin.ts# 統一解包回應與錯誤
│   │   └── 📁 __tests__/        # 各攔截器單元測試
│   ├── 📁 module/               # 各功能域 API
│   │   ├── 🌐 auth.api.ts       # 登入/登出
│   │   ├── 🌐 device.api.ts     # 裝置資訊/能力查詢
│   │   ├── 🌐 dashboard.api.ts  # 儀表板診斷 CGI
│   │   ├── 🌐 gameAcceleration.api.ts # 電競加速 API
│   │   ├── 🌐 trafficAnalyzer.api.ts  # 流量分析 API
│   │   ├── 🌐 trafficMonitor.api.ts   # 即時流量 API
│   │   ├── 🌐 user.api.ts       # 使用者/帳號 API
│   │   └── 📁 __tests__/        # 各 API 單元測試
│   └── 📁 mock/                 # 開發用假資料
│       ├── 🌐 dashboard.mock.ts        # 儀表板假資料
│       ├── 🌐 trafficAnalyzer.mock.ts  # 流量分析假資料
│       ├── 🌐 trafficMonitor.mock.ts   # 即時流量假資料
│       └── 📁 __tests__/        # mock 測試
│
├── 📁 stores/                   # Pinia 全域狀態
│   ├── 🗃️ auth.store.ts         # 認證狀態（isAuthenticated/checkAuth/login）
│   ├── 🗃️ device.store.ts       # 裝置資訊中樞（型號/能力/運作模式）
│   ├── 🗃️ systemVariable.ts     # QIS 流程系統變數（模式/AP清單）
│   ├── 🗃️ qisPostData.ts        # QIS 表單暫存（待送出 postData）
│   ├── 🗃️ dashboard.ts          # 儀表板狀態
│   ├── 📄 dashboard.parsers.ts  # 儀表板原始資料解析器
│   ├── 🗃️ gameAcceleration.ts   # 電競加速狀態
│   ├── 🗃️ trafficAnalyzer.ts    # 流量分析狀態
│   ├── 📄 trafficAnalyzer.parsers.ts  # 流量分析解析器
│   ├── 🗃️ trafficMonitor.ts     # 即時流量狀態
│   ├── 📄 trafficMonitor.parsers.ts   # 即時流量解析器
│   └── 📁 __tests__/            # store 與 parsers 單元測試
│
├── 📁 views/                    # 頁面元件（對應路由）
│   ├── 🧩 Dashboard.vue         # 儀表板首頁（多卡片彙整）
│   ├── 🧩 Login.vue             # 登入頁
│   ├── 🧩 GameBoost.vue         # 電競加速頁
│   ├── 🧩 AiProtection.vue      # AiProtection 安全防護
│   ├── 🧩 OpenNAT.vue           # OpenNAT 遊戲連接埠
│   ├── 🧩 ParentControls.vue    # 家長監護
│   ├── 🧩 QIS_wizard.vue        # QIS 精靈外殼（子頁 RouterView 容器）
│   ├── 📁 GameAcceleration/
│   │   └── 🧩 GameAcceleration.vue    # 電競加速主頁
│   ├── 📁 TrafficAnalyzer/Statistics/
│   │   └── 🧩 TrafficAnalyzer.vue     # 流量分析統計頁
│   ├── 📁 TrafficMonitor/
│   │   └── 🧩 TrafficMonitor.vue      # 即時流量監控頁
│   ├── 📁 QIS/                  # 快速設定精靈（80+ 子頁，依群組）
│   │   ├── 🧩 Welcome.vue              # 精靈歡迎頁
│   │   ├── 🧩 OperationMode.vue        # 選運作模式（RT/AP/RP/Mesh）
│   │   ├── 🧩 ChooseRole.vue           # 選擇角色
│   │   ├── 🧩 AdvancedSettings.vue     # 進階設定
│   │   ├── 🧩 ChangePassword.vue       # 變更密碼
│   │   ├── 🧩 PrelinkDesc.vue          # 預連線說明
│   │   ├── 🧩 WanPhyType.vue           # WAN 實體型態
│   │   ├── 🧩 WanProtocolType.vue      # WAN 協定型態
│   │   ├── 🧩 PPPoE.vue                # PPPoE 撥號設定
│   │   ├── 🧩 StaticIp.vue             # 固定 IP 設定
│   │   ├── 🧩 WanDhcpOption.vue        # WAN DHCP 選項
│   │   ├── 🧩 AutoWanHint.vue          # 自動偵測 WAN 提示
│   │   ├── 🧩 SpecialIspRequirement.vue# 特殊 ISP 需求
│   │   ├── 🧩 LanObtainIpType.vue      # LAN 取得 IP 方式
│   │   ├── 🧩 StaticLanIp.vue          # 固定 LAN IP
│   │   ├── 🧩 WirelessSettings.vue     # 無線設定
│   │   ├── 🧩 SiteSurvey.vue           # 掃描鄰近 AP
│   │   ├── 🧩 PapList.vue              # 父 AP 清單
│   │   ├── 🧩 WlcKey.vue               # 無線中繼金鑰
│   │   ├── 🧩 AxMode.vue               # AX 模式設定
│   │   ├── 🧩 AmasIntro.vue            # AiMesh 介紹
│   │   ├── 🧩 AmasNode.vue             # AiMesh 節點
│   │   ├── 🧩 AmasSearch.vue           # 搜尋 AiMesh 節點
│   │   ├── 🧩 AmasOnboarding.vue       # AiMesh 加入流程
│   │   ├── 🧩 AmasBundle.vue           # AiMesh 套裝綁定
│   │   ├── 🧩 AmasRestore.vue          # AiMesh 還原
│   │   ├── 🧩 AmasConnCap.vue          # AiMesh 連線能力
│   │   ├── 🧩 AmasOption.vue           # AiMesh 選項
│   │   ├── 🧩 AmasErrConnRouter.vue    # AiMesh 連線錯誤
│   │   ├── 🧩 AmasErrManual.vue        # AiMesh 手動排錯
│   │   ├── 🧩 WispMode.vue             # WISP 模式
│   │   ├── 🧩 MeshMode.vue             # Mesh 模式
│   │   ├── 🧩 WaitingAp.vue            # AP 模式等待
│   │   ├── 🧩 NoWanAp.vue              # AP 模式無 WAN
│   │   ├── 🧩 ResetModemAp.vue         # AP 模式重置數據機
│   │   ├── 🧩 V6Plus.vue               # 日本 v6plus 連線
│   │   ├── 🧩 V6Opt.vue                # IPv6 選項
│   │   ├── 🧩 OcnVc.vue                # OCN 虛擬連線
│   │   ├── 🧩 DsLite.vue               # DS-Lite 連線
│   │   ├── 🧩 Waiting46.vue            # v4/v6 偵測等待
│   │   ├── 🧩 Wan46Detection.vue       # v4/v6 連線偵測
│   │   ├── 🧩 Wan46Result.vue          # v4/v6 偵測結果
│   │   ├── 🧩 DslPppConfig.vue         # DSL PPP 設定
│   │   ├── 🧩 DslMerConfig.vue         # DSL MER 設定
│   │   ├── 🧩 DslManualSetting.vue     # DSL 手動設定
│   │   ├── 🧩 DslPtmManualSetting.vue  # DSL PTM 手動設定
│   │   ├── 🧩 DslPppTmp.vue            # DSL PPP 範本
│   │   ├── 🧩 DslMerTmp.vue            # DSL MER 範本
│   │   ├── 🧩 DslIpoaTmp.vue           # DSL IPoA 範本
│   │   ├── 🧩 DslBridgeTmp.vue         # DSL Bridge 範本
│   │   ├── 🧩 DslDhcpOption.vue        # DSL DHCP 選項
│   │   ├── 🧩 DslIptv.vue              # DSL IPTV
│   │   ├── 🧩 DslIptvSetting.vue       # DSL IPTV 設定
│   │   ├── 🧩 DslWaiting.vue           # DSL 連線等待
│   │   ├── 🧩 UsbModem.vue             # USB 行動網路
│   │   ├── 🧩 PhoneAsModem.vue         # 手機當數據機
│   │   ├── 🧩 SimPin.vue               # SIM PIN
│   │   ├── 🧩 SimPuk.vue               # SIM PUK
│   │   ├── 🧩 SimUnlock.vue            # SIM 解鎖
│   │   ├── 🧩 Site2Site.vue            # 站對站 VPN
│   │   ├── 🧩 Site2SiteWifiSelect.vue  # 站對站選 WiFi
│   │   ├── 🧩 Site2SiteSummary.vue     # 站對站摘要
│   │   ├── 🧩 VpnSettings.vue          # VPN 設定
│   │   ├── 🧩 VpnIpType.vue            # VPN IP 型態
│   │   ├── 🧩 SdnIot.vue               # SDN IoT 網路
│   │   ├── 🧩 SdnScenarios.vue         # SDN 情境
│   │   ├── 🧩 IptvSettings.vue         # IPTV 設定
│   │   ├── 🧩 BoostKey.vue             # Boost Key 設定
│   │   ├── 🧩 YandexDns.vue            # Yandex DNS
│   │   ├── 🧩 ResetModem.vue           # 重置數據機
│   │   ├── 🧩 NoWan.vue                # 無 WAN 連線
│   │   ├── 🧩 Waiting.vue              # 一般連線等待
│   │   ├── 🧩 WaitingDsl.vue           # DSL 等待
│   │   ├── 🧩 FirmwareUpdate.vue       # 韌體更新
│   │   ├── 🧩 Upgrading.vue            # 升級中
│   │   ├── 🧩 Finish.vue               # 完成頁
│   │   ├── 🧩 AccountPrompt.vue        # 帳號提示
│   │   ├── 🧩 AsusToS.vue              # ASUS 服務條款
│   │   ├── 🧩 TmToS.vue                # Trend Micro 條款
│   │   ├── 🧩 PolicyPage.vue           # 隱私政策頁
│   │   └── 📁 __tests__/        # QIS 頁面單元測試
│   └── 📁 __tests__/            # Login / QIS_wizard 測試
│
├── 📁 components/               # 可重用元件
│   ├── 🧩 Dialog.vue            # 共用對話框
│   ├── 🧩 LanguageList.vue      # 語言選單
│   ├── 📁 icons/                # SVG 圖示元件庫（39 個 Icon*.vue）
│   │   ├── 🧩 IconHome / IconDashboard / IconSettings ... # 各功能/操作圖示
│   │   ├── 🧩 IconLogoAsus / IconLogoROG               # 品牌 Logo
│   │   └── 📄 index.ts          # 統一匯出所有圖示
│   ├── 📁 dashboard/            # 儀表板卡片群
│   │   ├── 🧩 DashboardCard.vue        # 卡片外殼
│   │   ├── 🧩 WanInfoCard.vue          # WAN 資訊卡
│   │   ├── 🧩 SystemStatusCard.vue     # 系統狀態卡（CPU/RAM）
│   │   ├── 🧩 EthernetPortsCard.vue    # 乙太網埠卡
│   │   ├── 🧩 PortTile.vue             # 單一埠圖塊
│   │   ├── 🧩 ClientsCard.vue          # 連線裝置卡
│   │   ├── 🧩 AuraRgbCard.vue          # Aura RGB 燈效卡
│   │   ├── 🧩 AuraEffectPreview.vue    # 燈效預覽
│   │   ├── 🧩 TrafficMonitorCard.vue   # 即時流量卡
│   │   ├── 🧩 WifiInsightCard.vue      # WiFi 洞察卡
│   │   ├── 🧩 DnsTestCard.vue          # DNS 測試卡
│   │   ├── 🧩 SparklineChart.vue       # 迷你折線圖
│   │   ├── 📄 aura.assets.ts           # 燈效圖檔對照
│   │   └── 📄 dashboard.strategies.ts  # 機種硬體差異策略表
│   ├── 📁 qis/                  # QIS 共用元件
│   │   ├── 🧩 QisContentPanel.vue      # 內容面板
│   │   ├── 🧩 QisSidebarPanel.vue      # 側欄面板
│   │   ├── 🧩 ActionButtonLayout.vue   # 操作按鈕列
│   │   └── 🧩 PasswordStrengthBar.vue  # 密碼強度條
│   ├── 📁 game_acceleration/    # 電競加速元件
│   │   ├── 🧩 GameDeviceLevel.vue      # 裝置層加速
│   │   ├── 🧩 GamePacketLevel.vue      # 封包層加速
│   │   ├── 🧩 GameServerLevel.vue      # 伺服器層加速
│   │   ├── 🧩 TermsAgreement.vue       # 條款同意
│   │   ├── 🎨 gameAccelerationLevel.css# 加速樣式
│   │   └── 📁 __tests__/
│   ├── 📁 traffic_analyzer/     # 流量分析元件
│   │   ├── 📄 chartjs.ts               # Chart.js 註冊
│   │   ├── 🎨 trafficAnalyzer.css      # 樣式
│   │   ├── 📁 statistics/
│   │   │   ├── 🧩 TrafficDoughnut.vue        # 環圈圖
│   │   │   ├── 🧩 TrafficTrendChart.vue      # 趨勢圖
│   │   │   ├── 🧩 TrafficStatisticsTable.vue # 統計表
│   │   │   ├── 🧩 TrafficFilterBar.vue       # 篩選列
│   │   │   └── 🧩 Top5Card.vue               # 前五名卡
│   │   └── 📁 __tests__/
│   └── 📁 TrafficMonitor/       # 即時流量元件
│       ├── 🧩 RealTimeTrafficChart.vue # 即時流量圖
│       ├── 🧩 InterfaceSelector.vue    # 介面選擇器
│       ├── 🧩 InterfaceTrafficCard.vue # 介面流量卡
│       ├── 🧩 TrafficSpeedMetrics.vue  # 速率指標
│       ├── 🎨 trafficMonitor.css       # 樣式
│       └── 📁 __tests__/
│
├── 📁 composables/              # 組合式函式（可重用邏輯）
│   ├── 📄 useQisNavigation.ts   # QIS 模式導航核心（各模式 postData+跳轉）
│   ├── 📄 useQisSubmit.ts       # QIS 設定送出
│   ├── 📄 useTheme.ts           # 主題系統（ROG/ASUS 品牌色、深淺色）
│   ├── 📄 useMenu.ts            # 側邊選單建構
│   ├── 📄 useChangeLanguage.ts  # 語言切換
│   ├── 📄 useLanguageList.ts    # 語言清單
│   ├── 📄 useDialog.ts          # 對話框控制
│   ├── 📄 useLoading.ts         # 全域載入狀態
│   ├── 📄 usePolling.ts         # 定時輪詢刷新
│   ├── 📄 useReboot.ts          # 重新開機流程
│   └── 📁 __tests__/            # composables 測試
│
├── 📁 layouts/                  # 版面元件
│   ├── 🧩 Header.vue            # 頂部標題列（Logo/選單/登出/語言）
│   ├── 🧩 Navigation.vue        # 左側功能導航抽屜
│   ├── 🧩 RightDrawer.vue       # 右側抽屜
│   └── 📁 __tests__/            # 版面測試
│
├── 📁 router/
│   ├── 📄 index.ts              # 路由表（Hash 模式；QIS 80+ 子路由）
│   └── 📁 __tests__/            # 路由測試
│
├── 📁 config/
│   ├── ⚙️ menu.ts               # 功能選單結構
│   └── ⚙️ iconMap.ts            # 選單字串 → 圖示對照
│
├── 📁 constants/
│   └── 📄 qisPostDataTemplates.ts # QIS 各模式/WAN postData 預設模板
│
├── 📁 types/
│   ├── 📄 menu.ts               # 選單項目型別
│   └── 📄 papProfile.ts         # AP 掃描檔（PAP）型別
│
├── 📁 services/
│   ├── 📄 logout.service.ts     # 登出服務（清 session + 導回首頁）
│   └── 📁 __tests__/
│
├── 📁 utils/                    # 工具函式
│   ├── 📄 index.ts              # 統一匯出
│   ├── 📄 qis.ts               # QIS 流程判斷
│   ├── 📄 isSupport.ts          # 機種是否支援某功能（rc_support）
│   ├── 📄 isSwMode.ts           # 判斷運作模式（RT/AP/RP）
│   ├── 📄 menuRules.ts          # 選單顯示規則
│   ├── 📄 sdnCompat.ts          # SDN 相容性判斷
│   ├── 📄 validators.ts         # 表單驗證
│   ├── 📄 passwordScore.ts      # 密碼強度計算
│   ├── 📄 sha256.ts             # SHA-256 雜湊
│   ├── 📄 randomString.ts       # 隨機字串
│   ├── 📄 debounce.ts           # 防抖函式
│   └── 📁 __tests__/            # utils 測試
│
├── 📁 locales/                  # 多國語系（25 種）
│   ├── 🌍 TW.ts EN.ts JP.ts CN.ts DE.ts FR.ts ... # 各語言翻譯字串
│   └── 📁 dict/
│       └── 🌍 *.dict            # Legacy 翻譯字典原始檔（注入腳本來源）
│
└── 📁 assets/                   # 靜態資源
    ├── 🎨 main.css base.css button.css qis.css color-table.css # 全域樣式
    ├── 🎨 quasar-variables.scss # Quasar SASS 變數覆寫
    ├── 🎨 logo.svg              # 專案 Logo
    ├── 📁 fonts/                # 字型（Roboto / ROG 專用字型）
    └── 📁 images/
        ├── 📁 dashboard/        # 儀表板圖（含 aura/ 燈效 SVG）
        ├── 📁 qis/              # QIS 流程插圖（接線/拓樸）
        ├── 📁 game_acceleration/# 電競加速圖（UU/Outfox/banner）
        ├── 📁 traffic_analyzer/ # 流量分析圖示
        ├── 📁 traffic_monitor/  # 即時流量圖示（上/下行箭頭）
        └── 📁 theme/            # 主題背景圖（ROG 深淺色）
```

---

## 📁 e2e/ — Playwright 端對端測試

```text
e2e/
├── 🧪 login.spec.ts             # 登入流程測試
├── 🧪 dashboard.spec.ts         # 儀表板測試
├── 🧪 dashboard-mock.spec.ts    # 儀表板 Mock 資料測試
├── 🧪 layout.spec.ts            # 版面互動測試
├── 🧪 game-acceleration.spec.ts # 電競加速測試
├── 🧪 qis-four-mode.spec.ts     # QIS 四種模式測試
├── 🧪 qis-full-flow.spec.ts     # QIS 完整流程測試
├── 🧪 vue.spec.ts               # 基礎冒煙測試
├── ⚙️ tsconfig.json             # E2E 專用 TS 設定
└── 📁 pages/                    # Page Object 模式
    ├── 📄 login.page.ts         # 登入頁操作封裝
    ├── 📄 dashboard.page.ts     # 儀表板頁操作封裝
    ├── 📄 gameAcceleration.page.ts # 電競加速頁封裝
    └── 📄 qis.page.ts           # QIS 頁操作封裝
```

---

## 📁 scripts/ — 一次性建置腳本

```text
scripts/
├── 📄 inject-dashboard-locales.mjs        # 注入儀表板字串到 locales
├── 📄 inject-game-acceleration-locales.mjs# 注入電競加速字串
├── 📄 inject-traffic-analyzer-locales.mjs # 注入流量分析字串
└── 📄 inject-traffic-monitor-locales.mjs  # 注入即時流量字串
```

> 共通作用：把 legacy `locales/dict/*.dict` 的舊韌體翻譯，轉換注入到 `locales/*.ts` 供 vue-i18n 使用。

---

## 一頁速記

| 區塊 | 路徑 | 一句話 |
|------|------|--------|
| 入口 | `main.ts` / `App.vue` | 啟動與頂層版面切換 |
| 通訊 | `api/` | 封裝路由器 CGI / NVRAM |
| 狀態 | `stores/` | Pinia 全域狀態 + parsers |
| 頁面 | `views/`（QIS 佔大宗） | 路由對應畫面 |
| 元件 | `components/` | 卡片、圖示、圖表 |
| 邏輯 | `composables/` | 可重用組合式函式 |
| 版面 | `layouts/` | Header / 左右抽屜 |
| 路由 | `router/` | Hash 路由表 |
| 語系 | `locales/` | 25 國翻譯 |
| 資源 | `assets/` | 樣式 / 字型 / 圖片 |
| 測試 | `e2e/` + 各 `__tests__/` | E2E + 單元測試 |
```
