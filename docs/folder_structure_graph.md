# 專案目錄與檔案結構樹狀圖 (Folder Structure Tree)

以下為 ASUS Router Web GUI (Vue 3) 專案的資料夾與檔案樹狀圖，並標註了每個檔案與目錄的具體作用：

```text
vue3-wrt-project/
├── .claude/                   # Claude AI 助理設定檔
│   └── launch.json            # 啟動與除錯設定
├── .vscode/                   # VS Code 編輯器設定
│   └── extensions.json        # 推薦安裝的擴充套件清單
├── e2e/                       # Playwright 端到端 (E2E) 測試目錄
│   ├── pages/                 # E2E 測試的 Page Object Model (POM)
│   ├── tsconfig.json          # E2E 專屬 TypeScript 設定
│   └── *.spec.ts              # 各項功能的 E2E 測試檔 (如 login, dashboard)
├── public/                    # 靜態資源目錄 (不經 Vite 處理)
│   └── favicon.ico            # 網站圖示
├── scripts/                   # 開發與建置輔助腳本
│   └── inject-*.mjs           # 語系注入腳本 (從舊版字典檔提取翻譯至新版)
├── src/                       # 核心原始碼目錄
│   ├── api/                   # 後端 API 請求與攔截器
│   │   ├── core/              # Axios 實體建立 (http.ts) 與共用型別 (types.ts)
│   │   ├── mock/              # 開發用的 API 假資料 (Mock data)
│   │   ├── module/            # 各功能模組的 API 呼叫 (auth, dashboard, nvram 等)
│   │   ├── plugins/           # Axios 攔截器 (auth, form, mock, response)
│   │   └── *.api.ts           # 核心 API 呼叫 (hook.api.ts, nvram.api.ts 等)
│   ├── assets/                # 靜態資源 (CSS, 圖片, 字體)
│   │   ├── fonts/             # 字型檔 (Roboto, ROG Fonts 等)
│   │   ├── images/            # 圖片與圖示 (分功能存放：dashboard, qis, theme 等)
│   │   ├── base.css           # 基礎 CSS reset
│   │   ├── color-table.css    # 全域顏色變數與主題定義
│   │   ├── main.css           # CSS 進入點
│   │   ├── qis.css            # QIS 快速設定精靈專用樣式
│   │   └── quasar-variables.scss # Quasar UI 框架變數覆寫
│   ├── components/            # Vue 共用與特定功能 UI 元件
│   │   ├── dashboard/         # 首頁儀表板各區塊卡片元件
│   │   ├── game_acceleration/ # 遊戲加速三階段設定面板元件
│   │   ├── icons/             # 統一管理的 SVG 圖示元件庫
│   │   ├── qis/               # QIS 精靈共用佈局與元件 (如底部按鈕、密碼強度條)
│   │   ├── traffic_analyzer/  # 流量分析的圖表與統計元件
│   │   ├── TrafficMonitor/    # 即時流量監控元件
│   │   ├── Dialog.vue         # 共用確認對話框元件
│   │   └── LanguageList.vue   # 多語系下拉選單元件
│   ├── composables/           # Vue 3 組合式函數 (Hooks)
│   │   ├── useChangeLanguage.ts # 處理語系切換與儲存
│   │   ├── useDialog.ts       # 彈出視窗狀態管理
│   │   ├── useLoading.ts      # 全畫面載入中與倒數計時管理
│   │   ├── useMenu.ts         # 動態生成左側導覽選單 (含權限與硬體支援判斷)
│   │   ├── usePolling.ts      # API 定期輪詢邏輯
│   │   ├── useQisNavigation.ts # QIS 精靈複雜的步驟導航邏輯
│   │   ├── useQisSubmit.ts    # QIS 精靈資料統整與送出
│   │   ├── useReboot.ts       # 路由器重啟流程管理
│   │   └── useTheme.ts        # ASUS/ROG 主題深淺色與 CSS 變數切換
│   ├── config/                # 靜態設定檔
│   │   ├── iconMap.ts         # 選單與 Icon 元件的對應表
│   │   └── menu.ts            # 靜態導覽列選單結構
│   ├── constants/             # 常數定義
│   │   └── qisPostDataTemplates.ts # QIS 各模式預設 NVRAM 提交資料模板
│   ├── layouts/               # 頁面基礎佈局
│   │   ├── Header.vue         # 頂部導覽列
│   │   ├── Navigation.vue     # 左側主選單 (Drawer)
│   │   └── RightDrawer.vue    # 行動裝置右側滑出選單
│   ├── locales/               # 多國語系翻譯檔案 (i18n)
│   │   ├── dict/              # 舊版 ASUSWRT 字典檔 (供腳本提取用)
│   │   └── *.ts               # 25 國語言翻譯檔 (如 EN.ts, TW.ts)
│   ├── router/                # Vue Router 路由設定
│   │   └── index.ts           # 路由表定義與權限守衛 (Navigation Guards)
│   ├── services/              # 跨領域業務邏輯服務
│   │   └── logout.service.ts  # 統整登出 API、狀態清除與頁面導向
│   ├── stores/                # Pinia 狀態管理
│   │   ├── auth.store.ts      # 登入狀態與 Token 管理
│   │   ├── dashboard.ts       # 首頁 8 大模塊資料狀態
│   │   ├── device.store.ts    # 路由器硬體能力與運作模式狀態
│   │   ├── gameAcceleration.ts# 遊戲加速狀態與 EULA 條款狀態
│   │   ├── qisPostData.ts     # QIS 精靈暫存輸入表單資料
│   │   ├── systemVariable.ts  # 系統全域變數 (如 Operation Mode)
│   │   ├── trafficAnalyzer.ts # 流量分析狀態與過濾條件
│   │   ├── trafficMonitor.ts  # 即時流量監控狀態
│   │   └── *.parsers.ts       # 負責將後端 Legacy 字串轉為前端物件的解析器
│   ├── types/                 # TypeScript 共用型別定義
│   │   ├── menu.ts            # 選單型別
│   │   └── papProfile.ts      # AP 配置與多頻段設定型別
│   ├── utils/                 # 共用工具函數
│   │   ├── index.ts           # 匯出工具函數
│   │   ├── debounce.ts        # 防抖函數 (Debounce)
│   │   ├── isSupport.ts       # 判斷硬體是否支援某功能
│   │   ├── isSwMode.ts        # 判斷當前運作模式
│   │   ├── menuRules.ts       # 選單顯示與排序規則引擎
│   │   ├── passwordScore.ts   # 密碼強度計分演算法
│   │   ├── qis.ts             # QIS 網路設定字串轉換工具
│   │   ├── sdnCompat.ts       # SDN (軟體定義網路) 相容性檢查
│   │   ├── sha256.ts          # SHA256 加密工具
│   │   └── validators.ts      # 表單驗證器 (IP, MAC, SSID, 密碼等)
│   ├── views/                 # 頁面視圖組件
│   │   ├── GameAcceleration/  # 遊戲加速主頁面
│   │   ├── QIS/               # 高達 80 個 QIS 精靈流程頁面 (如 Welcome, PPPoE)
│   │   ├── TrafficAnalyzer/   # 流量分析主頁面
│   │   ├── TrafficMonitor/    # 即時流量監控主頁面
│   │   ├── Dashboard.vue      # 首頁儀表板
│   │   ├── Login.vue          # 登入頁面
│   │   ├── QIS_wizard.vue     # QIS 精靈外層容器
│   │   └── AiProtection.vue, GameBoost.vue 等 # 其他功能佔位頁面
│   ├── App.vue                # Vue 根元件 (管理全域版面切換)
│   ├── i18n.ts                # vue-i18n 初始化設定
│   └── main.ts                # Vue 應用程式進入點與掛載
├── .editorconfig              # 編輯器跨平台排版設定 (縮排、換行等)
├── .env.development           # 開發環境變數 (包含 Mock 開關與 Router IP)
├── .env.production            # 正式環境變數
├── .gitattributes             # Git 屬性設定 (如二進位檔案排除)
├── .gitignore                 # Git 忽略清單
├── .oxlintrc.json             # oxlint 語法檢查設定
├── .prettierignore            # Prettier 忽略格式化的檔案清單
├── .prettierrc.json           # Prettier 程式碼排版規則
├── env.d.ts                   # Vite 專屬環境變數 TS 型別宣告
├── eslint.config.ts           # ESLint 語法與風格檢查設定
├── index.html                 # SPA 唯一 HTML 進入點
├── LICENSE                    # 開源授權條款
├── package.json               # NPM 專案依賴與腳本設定
├── playwright.config.ts       # Playwright E2E 測試框架設定
├── README.md                  # 專案說明文件
├── tsconfig.json              # TypeScript 根編譯設定
├── vite.config.ts             # Vite 建置與開發伺服器 (Proxy) 設定
└── vitest.config.ts           # Vitest 單元測試框架設定
```
