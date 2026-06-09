# Vue3 WRT Project 資料夾結構與檔案說明

此專案採用 **Monorepo (單體儲存庫)** 架構設計，並使用 **pnpm workspace** 進行套件管理。核心的業務邏輯與介面元件皆放在 `packages/shared` 中，而 `apps` 目錄下的各個專案僅作為不同平台的進入點（Web、Mobile、Electron Desktop），實現了最大程度的程式碼共用。

## 📁 目錄結構圖

```text
vue3-wrt-project/
├── .vscode/               # VSCode 編輯器設定 (如推薦套件、設定檔)
├── apps/                  # 應用程式進入點目錄 (各平台的宿主環境)
│   ├── electron/          # 桌面版應用程式 (基於 Electron)
│   │   ├── build/         # Electron 打包相關資源或輸出目錄
│   │   ├── electron/      # Electron 主行程 (Main Process) 程式碼
│   │   ├── src/main.ts    # 渲染行程 (Render Process) Vue 進入點
│   │   └── vite.config.ts # Electron 環境的 Vite 設定檔
│   ├── mobile/            # 行動版應用程式 (基於 Capacitor)
│   │   ├── android/       # Android 原生專案目錄
│   │   ├── ios/           # iOS 原生專案目錄
│   │   ├── src/main.ts    # 行動端 Vue 進入點
│   │   ├── capacitor.config.ts # Capacitor 設定檔
│   │   └── vite.config.ts # 行動端環境的 Vite 設定檔
│   └── web/               # 網頁版應用程式 (純 Web 環境)
│       ├── public/        # 靜態資源目錄 (不經過編譯打包的檔案)
│       ├── src/main.ts    # Web 端 Vue 進入點
│       └── vite.config.ts # Web 環境的 Vite 設定檔
├── e2e/                   # End-to-End (E2E) 端到端測試目錄
│   ├── pages/             # Playwright 的 Page Object Model (POM) 目錄
│   └── *.spec.ts          # 各種 E2E 測試案例 (如登入、模式切換等)
├── packages/              # 共用套件目錄 (Monorepo 的 package 層)
│   └── shared/            # ⭐️ 核心共用前端程式碼 (所有平台共用的 UI 與邏輯)
│       ├── src/           # 原始碼主目錄
│       │   ├── api/       # API 請求封裝 (如 Axios 實例與各 API 介面)
│       │   ├── assets/    # 靜態資源 (圖片、字體、全域 CSS 等)
│       │   ├── components/# 共用 Vue UI 元件 (如按鈕、彈窗等)
│       │   ├── composables/# 共用的 Vue 組合式函式 (Composition API Hooks)
│       │   ├── config/    # 應用程式全域設定
│       │   ├── constants/ # 全域常數與列舉 (Enums) 定義
│       │   ├── layouts/   # 頁面共用佈局 (如 Header, Sidebar, Footer)
│       │   ├── locales/   # i18n 多國語系翻譯檔案 (如 JSON)
│       │   ├── router/    # Vue Router 路由設定
│       │   ├── services/  # 業務邏輯服務層 (將邏輯與元件解耦)
│       │   ├── stores/    # Pinia 狀態管理
│       │   ├── types/     # TypeScript 型別與介面定義 (Interfaces, Types)
│       │   ├── utils/     # 共用的純工具函式 (如日期格式化、字串處理)
│       │   ├── views/     # 頁面層級元件 (依路由劃分的 Pages)
│       │   ├── App.vue    # Vue 應用程式共用根元件
│       │   ├── i18n.ts    # vue-i18n 多國語系初始化設定
│       │   └── main.ts    # Shared 模組的匯出/註冊入口
│       └── vitest.config.ts # Shared 模組的單元測試設定檔
├── package.json           # 根目錄的 npm 設定 (定義共用腳本與全域依賴)
├── pnpm-workspace.yaml    # pnpm Monorepo 工作區設定檔 (定義 apps/* 與 packages/*)
├── pnpm-lock.yaml         # pnpm 依賴套件鎖定檔 (確保套件版本一致性)
├── eslint.config.ts       # ESLint 程式碼語法檢查設定
├── playwright.config.ts   # Playwright 端到端測試 (E2E) 全域設定檔
├── .prettierrc.json       # Prettier 程式碼格式化設定
├── .oxlintrc.json         # oxlint (極速 Linter 工具) 設定檔
├── .editorconfig          # 跨平台、跨編輯器的程式碼排版風格設定
├── .env.development       # 開發環境的全域環境變數
├── tsconfig.base.json     # TypeScript 共用的基礎編譯設定
├── tsconfig.json          # TypeScript 專案主編譯設定
└── tsconfig.node.json     # TypeScript Node 環境編譯設定 (給 Vite 等構建工具使用)
```

## 📄 核心目錄與檔案作用說明

### 架構層級 (Monorepo)
*   **`apps/`**: 存放各個目標平台的應用程式外殼。它們本身不包含太多業務邏輯，主要是用來載入 `packages/shared` 中的核心程式碼，並針對各自的平台（Web, Electron, Mobile）提供專屬的打包與環境設定（如 `vite.config.ts`、`capacitor.config.ts`）。
*   **`packages/shared/`**: 專案真正的核心。所有的畫面（views）、元件（components）、狀態（stores）、路由（router）及 API 請求都集中在這裡開發，讓不同平台的 App 可以直接引入使用，達成「Write Once, Run Anywhere」的目標。
*   **`e2e/`**: 基於 [Playwright](https://playwright.dev/) 的端到端測試資料夾。用來模擬真實使用者的操作流程（如：打開瀏覽器 -> 輸入帳號密碼登入 -> 點擊按鈕），確保應用程式的整體流程正常運作。

### 設定檔層級
*   **`pnpm-workspace.yaml`**: 宣告這是一個 pnpm workspace 專案，讓在同一個專案資料夾下的不同 package 可以互相參考與共用 Node modules。
*   **`playwright.config.ts`**: 設定 e2e 測試的環境（例如測試的瀏覽器引擎、測試網址、逾時時間等）。
*   **`eslint.config.ts` & `.prettierrc.json` & `.oxlintrc.json`**: 這三個檔案共同組成了專案的程式碼品質防線。ESLint 與 oxlint 負責抓出語法錯誤與不佳的寫法，Prettier 則強制統一程式碼的排版格式。
*   **`tsconfig.*.json`**: TypeScript 的設定檔。將設定拆分成 `base`, `node`, `json` 是一種良好的實踐，能針對不同執行環境（瀏覽器環境 vs Node 建置環境）提供更準確的型別檢查。
