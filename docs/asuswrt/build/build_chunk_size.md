# Chunk 大小調整規範

本文件定義本專案如何觀察、限制與調整 Vite/Rollup chunk 大小，目標是在 ASUS Router device 與桌面/行動瀏覽器上取得穩定的載入效能。

## 1. 目前 Web 打包策略

主要設定位於 `apps\web\vite.config.ts`：

```ts
build: {
    assetsDir: 'assets',
    emptyOutDir: false,
    rollupOptions: {
        input: {
            asus: resolve(__dirname, 'asus.html'),
        },
        output: {
            entryFileNames: (chunk) => {
                if (chunk.name === 'asus') {
                    return 'assets/asus.js';
                }
                return 'assets/[name]-[hash].js';
            },
            chunkFileNames: 'assets/[name]-[hash].js',
            assetFileNames: (assetInfo) => { /* by type */ },
            manualChunks(id) { /* vendor/views/locales */ },
        },
    },
}
```

目前 `manualChunks` 分組：

| Chunk | 條件 | 用途 |
| --- | --- | --- |
| `vendor-quasar` | `node_modules` 且包含 `quasar` | Quasar runtime/UI |
| `vendor-vue-ecosystem` | `vue-router`、`vue-i18n`、`pinia`、`@vue` | Vue 生態系 |
| `vendor-axios` | `axios` | HTTP client |
| `vendor` | 其他 `node_modules` | 其他第三方依賴 |
| `views-qis` | `/views/QIS/` | QIS 子頁面集中成單一 chunk |
| `views-main` | `/views/` | 非 QIS views |
| `locales` | `/locales/` 且非 `/locales/dict/` | 語系檔 |

Router 設定中，QIS views 目前以 `import.meta.glob('../views/QIS/*.vue', { eager: true })` eager load，目的是避免 80+ 個 QIS stub 產生過多碎片 chunk。Dashboard、Login、QIS wizard 則使用 dynamic import，可形成 route-level lazy loading。

## 2. 建議大小門檻

| 檔案類型 | 建議 gzip 前大小 | 說明 |
| --- | --- | --- |
| Entry `assets\asus.js` | 150 KiB 以下 | 應只保留啟動必要程式碼 |
| 單一 route/view chunk | 250 KiB 以下 | 超過時檢查是否可 lazy load 或拆分 |
| Vendor chunk | 500 KiB 以下 | 超過時依套件用途拆分 |
| CSS chunk | 150 KiB 以下 | 檢查是否有重複樣式或未使用樣式 |
| Font | 單檔 100 KiB 以下 | 優先 WOFF2，避免載入未使用字重 |
| Image | 單檔 200 KiB 以下 | 優先壓縮與使用合適尺寸 |

Vite 預設會在 chunk 超過 500 KiB 時警告。若因 ASUS Router device 硬體或網路限制需要更嚴格門檻，可在 `build` 中設定：

```ts
build: {
    chunkSizeWarningLimit: 350,
}
```

此值只影響警告，不會自動拆 chunk。真正的大小控制需透過 route lazy loading、manualChunks、移除依賴或調整資源。

## 3. 調整 chunk 大小的方法

### 3.1 拆分大型 vendor

當 `vendor` 過大時，先用 build 輸出或 bundle analyzer 找出主要來源，再拆成穩定、可快取的 chunk。

```ts
manualChunks(id) {
    if (id.includes('node_modules')) {
        if (id.includes('quasar')) return 'vendor-quasar';
        if (id.includes('pinia') || id.includes('vue-router') || id.includes('vue-i18n') || id.includes('@vue')) {
            return 'vendor-vue-ecosystem';
        }
        if (id.includes('axios')) return 'vendor-axios';
        return 'vendor';
    }
}
```

原則：

1. 變動頻率低的第三方套件可獨立成 vendor chunk，提高瀏覽器快取命中。
2. 不要為每個小套件建立 chunk，否則會增加 HTTP request 與解析成本。
3. Quasar、Vue ecosystem、Axios 目前已具備基本拆分。

### 3.2 Route-level lazy loading

一般頁面應維持：

```ts
component: () => import('@/views/Dashboard.vue')
```

適合 lazy loading 的情境：

1. 非首屏頁面。
2. 使用者不一定會進入的設定頁。
3. 大型表單、圖表、上傳或進階功能。

不適合過度拆分的情境：

1. QIS wizard 中高度連續、逐步導頁的頁面。
2. 小型 stub component 大量產生碎片 chunk。
3. Router device latency 比下載量更敏感時。

### 3.3 調整 QIS chunk

目前 QIS 使用 eager glob，會將多數 QIS 子頁面合併到 `views-qis`。如果 `views-qis` 過大，可採取分段拆分：

| 分段 | 可能包含 |
| --- | --- |
| `views-qis-basic` | Welcome、OperationMode、WanPhyType、WanProtocolType |
| `views-qis-wireless` | WirelessSettings、WlcKey、SiteSurvey |
| `views-qis-amas` | Amas* |
| `views-qis-dsl` | Dsl* |
| `views-qis-finish` | Finish、Waiting、Upgrading |

調整前需評估：

1. 是否增加太多 request。
2. 是否造成 wizard step 切換時可感知延遲。
3. 是否仍符合 iOS/Android Safari/Chrome 的載入一致性。

### 3.4 語系檔拆分

目前一般 `locales` 被合併為單一 chunk。若語系資料持續膨脹，可改為按語系 lazy import：

```ts
const messages = await import(`@/locales/${lang}.ts`);
```

注意事項：

1. 必須保留 fallback language。
2. 切換語系時需處理 loading 與錯誤提示。
3. 若 router device 離線或弱網，避免首次登入頁缺少必要語系。

### 3.5 Asset 大小控制

| 類型 | 策略 |
| --- | --- |
| Font | 優先 WOFF2；只打包實際使用字重 |
| Image | 壓縮圖片、避免原始大圖進入 bundle |
| CSS | 抽共用樣式，避免 component scope 中複製大量規則 |
| Icon | 優先 Vue component / SVG symbol；避免載入整包未使用 icon |

## 4. 檔案命名規則

目前 Web build 命名規則：

| 輸出類型 | 命名 |
| --- | --- |
| 主 entry | `assets\asus.js` |
| JS chunk | `assets\[name]-[hash].js` |
| CSS | `assets\css\[name]-[hash].css` |
| Image | `assets\images\[name]-[hash][extname]` |
| Font | `fonts\[name]-[hash][extname]` |
| 其他 asset | `assets\[name]-[hash][extname]` |

`assets\asus.js` 為穩定檔名，適合 ASUS Router 固定入口頁引用；其他 chunk 使用 hash，避免快取污染。

## 5. 調整流程

1. 執行 `pnpm --filter @vue3-wrt/web build`。
2. 檢查 Vite chunk size warning 與 `apps\web\dist` 檔案大小。
3. 找出過大的 chunk 類型：entry、vendor、view、locale、asset。
4. 優先移除未使用依賴或大型 asset。
5. 再調整 `manualChunks` 或 route lazy loading。
6. 重新 build，比對檔案數量、最大 chunk、首次載入體積。
7. 在桌面與 iOS/Android 瀏覽器確認 routing、QIS wizard、登入與語系切換。

## 6. 不建議的做法

1. 只提高 `chunkSizeWarningLimit` 來掩蓋過大 chunk。
2. 將每個 component 都拆成獨立 chunk。
3. 為了縮小 bundle 而破壞 QIS wizard 連續操作體驗。
4. 在 component 內直接 import 大型 library，而未確認是否可局部載入。
5. 部署未壓縮圖片或未使用字型。
