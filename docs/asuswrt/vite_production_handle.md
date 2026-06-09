# Vite 生產環境 (Production) 打包與最佳化分析

針對 `vue3-wrt-project` 中 Vite 的生產環境配置，我們深入分析 `apps/web/vite.config.ts` 中的設定。與開發環境 (基於 esbuild + 原生 ESM) 不同，Vite 在 Production 模式下會將打包任務交由 **Rollup** 執行，以確保輸出最優化、體積最小的靜態資源。

本文件將剖析 Vite 在生產模式下是如何執行打包、檔案分割與針對 ASUS Router 網通設備的最佳化。

---

## 1. 核心底層機制：Rollup 與 Tree-Shaking
執行 `pnpm build` 時，Vite 呼叫 Rollup 進行代碼編譯。
- **Tree-Shaking**: Rollup 會靜態分析專案的 ES Module，剔除未被使用的代碼（例如匯入了 Quasar 函式庫，但只用到其中兩個元件，其餘代碼將被捨棄）。
- **預設壓縮**: 預設使用 esbuild 作為生產環境的 JS/CSS 壓縮器，相比傳統的 Terser 擁有極快（約 10~100倍）的壓縮速度。

---

## 2. 針對網通設備的關鍵設定

在嵌入式系統（路由器硬體）中，資源的路徑與伺服器架構與一般雲端伺服器不同，專案中做了以下關鍵設定：

### 2.1 相對路徑設定 (`base: './'`)
```typescript
export default defineConfig({
    base: './', // <--- 關鍵
    // ...
});
```
- **原因**: 傳統 Web 開發常使用絕對路徑 (`/`)，但在路由器中，UI 有時可能透過不同網址、IP 或從檔案系統直接存取。設定為 `./` 確保 `index.html` 內引用的 JS/CSS 都是「相對當前路徑」，保證網頁被打包放進硬體後，不管路由層級為何，都不會發生 404 資源載入失敗。

### 2.2 外部化硬體遺留字典 (`external`)
```typescript
rollupOptions: {
    external: [/^src\/locales\/dict\//],
}
```
- **原因**: 路由器硬體內部可能已有由 C/C++ 即時產生的動態語言檔 (`dict`)。透過 External 設定，Vite 不會將這些字典打包進前端 JS 中，而是保留其引用，讓前端直接向硬體設備請求這些動態資源，大幅減少前端 Bundle 的體積。

---

## 3. 檔案分割策略 (Code Splitting - `manualChunks`)

為了提高瀏覽器快取命中率與首屏載入速度，專案在 `rollupOptions.output.manualChunks` 中實作了極為精細的「手動分塊策略」：

```typescript
manualChunks(id) {
    // 1. 第三方套件 (Vendor) 獨立打包
    if (id.includes('node_modules')) {
        if (id.includes('quasar')) return 'vendor-quasar';
        if (id.includes('vue-router') || id.includes('vue-i18n') || id.includes('pinia') || id.includes('@vue'))
            return 'vendor-vue-ecosystem';
        if (id.includes('axios')) return 'vendor-axios';
        return 'vendor'; // 其餘 node_modules
    }

    // 2. 業務視圖 (Views) 拆分
    if (id.includes('/views/QIS/')) return 'views-qis';
    if (id.includes('/views/')) return 'views-main';

    // 3. 語系檔集中
    if (id.includes('/locales/') && !id.includes('/locales/dict/')) return 'locales';
}
```

### 3.1 最佳化效益分析：
1. **防止快取失效 (Cache Busting)**: 第三方依賴 (如 `vue`, `quasar`) 更新頻率極低，業務代碼 (Views) 更新頻率極高。如果全包在一起，只要改一行業務代碼，整個巨大的 JS 檔都會被重新下載。拆分成 `vendor` 後，使用者更新路由器 UI 時，瀏覽器可以直接從快取讀取 `vendor-quasar.js`，只需下載輕量級的 `views-main.js`。
2. **模組化載入**: QIS (快速設定精靈) 被獨立為 `views-qis`。這代表當使用者登入一般設定頁面時，不會載入 QIS 的代碼；反之亦然。

---

## 4. 靜態資源分類與命名最佳化 (`assetFileNames`)

為了讓編譯輸出的 `/dist` 資料夾結構清晰，便於與後端硬體團隊交接，專案重新定義了輸出的檔案目錄：

```typescript
assetFileNames: (assetInfo) => {
    // 字型檔
    if (/\.woff2?$/.test(assetInfo.name ?? '')) return 'fonts/[name]-[hash][extname]';
    // 圖片檔
    if (/\.(png|jpe?g|gif|svg)$/.test(assetInfo.name ?? '')) return 'assets/images/[name]-[hash][extname]';
    // CSS 樣式
    if (/\.css$/.test(assetInfo.name ?? '')) return 'assets/css/[name]-[hash][extname]';
    // 其他
    return 'assets/[name]-[hash][extname]';
}
```

### 4.1 產出結構預覽
編譯後 (`pnpm build`) 的 `/dist` 目錄將會是整齊的：
```text
/dist
├── index.html
├── assets/
│   ├── index.js                  # 入口檔案
│   ├── vendor-quasar-[hash].js
│   ├── views-main-[hash].js
│   ├── css/
│   │   └── index-[hash].css
│   └── images/
│       └── logo-[hash].png
└── fonts/
    └── roboto-[hash].woff2
```
檔案名稱附帶 `-[hash]` 是靜態資源最佳化的標準做法，能確保檔案更新時檔名一定會變，強制瀏覽器抓取新檔，避免版本更新後吃到舊快取的客訴。

---

## 5. 總結
`vue3-wrt-project` 的 Vite Production 配置是一套經過深思熟慮的架構。它完美結合了 Vite 的極速與 Rollup 的強大分割能力，特別針對 ASUS 路由器的**無伺服器根目錄依賴 (`base: './'`)**、**快取策略 (`manualChunks`)** 與**硬體字典動態載入 (`external`)** 進行了深度客製，為設備提供了最輕量、最穩定的前端韌體方案。