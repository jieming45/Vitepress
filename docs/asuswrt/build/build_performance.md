# 打包與執行效能優化指南

本文件定義本專案在 Vite 打包速度與打包後瀏覽器執行效能上的優化策略，包含 code splitting、lazy loading、tree shaking、asset、CSS 與壓縮策略。

## 1. 優化目標

| 面向 | 目標 |
| --- | --- |
| 打包速度 | 減少不必要的 type-check、lint、test、bundle 重工 |
| 首次載入 | 降低 entry 與首屏 route 所需 JS/CSS |
| 後續導頁 | 讓 route chunk 可快取且大小穩定 |
| Router device 相容性 | 使用相對路徑、穩定檔名、保守瀏覽器能力 |
| 行動裝置體驗 | 控制 JS parse/evaluate 時間與 request 數量 |
| 維護性 | chunk 命名、檔案結構與性能門檻可追蹤 |

## 2. 打包速度優化

### 2.1 使用正確指令

| 情境 | 指令 |
| --- | --- |
| 快速產出 Web dist | `pnpm build:web` |
| 正式 Web build | `pnpm --filter @vue3-wrt/web build` |
| 只做型別檢查 | `pnpm --filter @vue3-wrt/web type-check` |
| 開發模式 | `pnpm dev:web` |
| Watch build | `pnpm --filter @vue3-wrt/web build-watch` |

正式 build 應包含 `vue-tsc --build`。快速本機驗證可使用 `build:web`，但不能取代發版前完整檢查。

### 2.2 利用快取與範圍化

1. 使用 pnpm workspace filter，只 build 需要的 app。
2. `vue-tsc --build` 使用 `tsBuildInfoFile`，可重用 incremental build info。
3. ESLint 已啟用 `--cache`，重複檢查時可降低成本。
4. 避免在每次儲存時跑完整 e2e，改在 PR 或發版前執行。
5. 避免在 shared package 中引入 app-only dependency，降低所有 app 的 dependency graph。

### 2.3 減少 Vite 需要處理的輸入

1. 移除未使用 component、icon、locale、utility。
2. 避免 barrel file 匯出大型副作用模組。
3. 大型資料表或字典改為 lazy import。
4. 第三方套件優先使用 ESM 與可 tree-shake 的 import。

## 3. 打包後效能優化

### 3.1 Code splitting

目前策略：

1. 第三方依賴拆成 `vendor-quasar`、`vendor-vue-ecosystem`、`vendor-axios`、`vendor`。
2. QIS views 合併成 `views-qis`，避免大量小 chunk。
3. 非 QIS views 合併成 `views-main`。
4. 語系檔合併成 `locales`。

調整原則：

| 問題 | 優先策略 |
| --- | --- |
| Entry 太大 | 檢查 `main.ts`、全域 import、同步載入的 plugin |
| Vendor 太大 | 拆大型第三方或改局部 import |
| QIS 太大 | 依功能分段拆 chunk，但避免 80+ 小 chunk |
| Locale 太大 | 語系 lazy loading |
| CSS 太大 | 移除重複樣式、抽共用 class、避免全域載入不必要樣式 |

### 3.2 Lazy loading

適合 lazy loading：

1. 路由頁面。
2. 使用者很少進入的進階設定。
3. 大型工具或資料處理邏輯。
4. 非首屏語系與 help content。

範例：

```ts
{
    path: '/login',
    name: 'login',
    component: () => import('@/views/LoginView.vue'),
}
```

不建議 lazy loading：

1. 首屏必要 layout。
2. 頻繁切換且很小的 component。
3. QIS wizard 中連續 step 的小頁面，除非整體 chunk 過大。

### 3.3 Tree shaking

維持 tree shaking 的規則：

1. 優先使用 ESM import/export。
2. 避免 module top-level 執行非必要副作用。
3. 不在共用 index 中匯入所有 heavy modules。
4. 第三方套件使用具名 import 或官方建議的 tree-shakable import。
5. 若 utility 僅用於特定頁面，從該頁面直接 import，不放入全域初始化流程。

### 3.4 CSS 與 Quasar

1. 共用樣式放在 shared asset/style 中，避免每個 component 重複定義。
2. Component scoped style 僅放該 component 私有樣式。
3. Quasar Sass 變數統一透過 `packages\shared\src\assets\quasar-variables.scss`。
4. 避免載入未使用 icon set 或大量字型。
5. 檢查 mobile Safari 對 viewport、fixed、overflow、touch 行為的一致性。

### 3.5 靜態資源

| 類型 | 策略 |
| --- | --- |
| JS | hashed chunk，可長快取 |
| CSS | hashed CSS，可長快取 |
| Entry | `assets\asus.js` 穩定檔名，需搭配 HTML 或部署版本控制 |
| Image | 壓縮後放入 bundle；大圖需延遲載入 |
| Font | 使用 WOFF2；避免未使用字重 |

## 4. 壓縮策略

目前專案未設定 build-time gzip/brotli plugin。建議策略：

| 環境 | 策略 |
| --- | --- |
| Vite build output | 保持原始 JS/CSS/asset，方便 firmware 或 web server 流程處理 |
| ASUS Router web server 支援 gzip | 在部署或 firmware 打包流程產出 `.gz`，由 server 設定 `Content-Encoding: gzip` |
| 不支援 gzip | 更嚴格控制原始 JS/CSS 大小，避免依賴壓縮才可接受 |
| Brotli | 僅在 target server 明確支援時使用，否則不要只產 `.br` |

若日後加入壓縮 plugin，需注意：

1. 不要只輸出壓縮檔而遺失原始檔。
2. Router web server 必須正確回傳 `Content-Encoding`。
3. 檔名與 firmware packaging 流程需一致。
4. 部署驗證需檢查桌面與 iOS/Android 瀏覽器都能載入。

## 5. 打包後檔案結構

Web build 預期輸出於 `apps\web\dist`：

```txt
apps\web\dist\
  asus.html
  assets\
    asus.js
    vendor-quasar-[hash].js
    vendor-vue-ecosystem-[hash].js
    vendor-axios-[hash].js
    vendor-[hash].js
    views-qis-[hash].js
    views-main-[hash].js
    locales-[hash].js
    css\
      [name]-[hash].css
    images\
      [name]-[hash][extname]
  fonts\
    [name]-[hash][extname]
```

實際 chunk 名稱會依 Rollup dependency graph 調整，以上為目前設定下的目標結構。

## 6. 性能驗證方式

1. 使用 `pnpm --filter @vue3-wrt/web build` 產出正式 bundle。
2. 檢查 Vite build log 是否有 chunk size warning。
3. 檢查 `apps\web\dist` 最大 JS/CSS/asset。
4. 使用 `pnpm --filter @vue3-wrt/web preview` 或部署測試環境檢查首屏。
5. 在桌面 Chrome/Safari、Android Chrome、iOS Safari 驗證：
   - 首次載入
   - 登入頁
   - QIS wizard step 切換
   - 語系切換
   - API 呼叫與 cookie session
   - 靜態資源 404

## 7. 風險與取捨

| 優化 | 好處 | 風險 |
| --- | --- | --- |
| 更細的 code splitting | 降低單檔大小 | 增加 request、弱網延遲 |
| QIS eager 合併 | 減少碎片 chunk | 單一 QIS chunk 可能偏大 |
| Vendor 拆分 | 提升快取 | 過度拆分增加管理成本 |
| 語系 lazy loading | 降低初始體積 | 切換語系需處理 loading/fallback |
| gzip/brotli | 降低傳輸量 | 依賴 server 正確設定 |
