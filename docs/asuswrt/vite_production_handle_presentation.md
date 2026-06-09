---
theme: seriph
background: https://source.unsplash.com/collection/94734566/1920x1080
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Vite Production 模式分析
  vue3-wrt-project 打包與檔案分割最佳化
drawings:
  persist: false
transition: slide-left
title: Vite Production 模式分析
---

# Vite Production 打包與最佳化 📦

解析 `vue3-wrt-project` 的 Rollup 檔案分割與網通設備適配策略

---

# 目錄

1. **Production 模式的核心引擎**
   - 從 esbuild 轉交 Rollup 的原因
2. **網通設備 (ASUS Router) 的關鍵設定**
   - 相對路徑與資源掛載
3. **檔案分割策略 (Code Splitting)**
   - `manualChunks` 手動分塊的藝術
4. **資源外部化 (External)**
   - 字典檔處理
5. **產出結構最佳化**
   - 結構化 `/dist` 目錄

---

# 1. Production 的核心引擎：Rollup ⚙️

與開發環境 (Dev) 極速的 ESM + esbuild 不同，Vite 的 `build` 指令會呼叫 **Rollup** 進行生產打包：

- **Tree-Shaking (搖樹優化)**: 
  靜態分析程式碼，未被使用的函數與組件將不會被打包，極大化減少檔案體積。
- **esbuild 壓縮**: 
  即使交由 Rollup 打包，Vite 依然預設使用 esbuild 作為壓縮器，效能遠勝傳統 Terser。
- **產出靜態資源**: 
  將 `.vue`、`.ts`、`.scss` 徹底轉譯為純粹的 HTML / JS / CSS。

---

# 2. 網通設備的關鍵設定 🔌

路由器硬體的 Web 伺服器 (`httpd`) 環境特殊，必須加入以下關鍵設定以保證安全運作：

### ✅ 核心設定: `base: './'`

```typescript
export default defineConfig({
    base: './', // 確保使用相對路徑
});
```

**為何如此重要？**
一般雲端網站通常在網域根目錄運行 (`/`)。但在嵌入式設備中，UI 可能透過 IP、特定子目錄或是直接從 File System 被存取。
使用相對路徑 (`./`) 確保 `index.html` 找尋 `assets/index.js` 時**永遠基於當前路徑**，徹底消滅 404 資源載入失敗的風險。

---

# 3. 檔案分割策略 (Code Splitting) 🗂️

為提高瀏覽器**快取命中率**，我們在 `rollupOptions.output.manualChunks` 實作了精細的分塊：

1. **Third-party 依賴拆分 (Vendor)**:
   - `vendor-quasar`: Quasar UI 庫。
   - `vendor-vue-ecosystem`: Vue, Router, Pinia, i18n。
   - `vendor-axios`: 獨立拆出 API 套件。
2. **業務邏輯拆分 (Views)**:
   - `views-qis`: 快速設定精靈 (QIS) 獨立打包，一般登入不載入。
   - `views-main`: 其餘主要視圖。
3. **語系檔 (Locales)**:
   - `locales`: 將所有語言包打包成一塊。

---

# 為什麼要手動分塊 (Code Splitting)？ 💡

如果將所有代碼包成一個巨大的 `index.js`：
開發者只要改了 UI 的一個字，使用者升級韌體後，瀏覽器就必須重新下載整個好幾 MB 的 `index.js`。

**分塊後的優勢 (Cache Busting)**:
第三方套件 (`vue`, `quasar`) 幾乎不更新。透過切分 `vendor-*.js`，使用者瀏覽器可以直接從**本機快取**讀取框架代碼，只需花費極短時間下載幾 KB 更新過的 `views-main.js`。首屏載入速度大幅提升！

---

# 4. 資源外部化 (External) 📤

硬體設備有自己的限制與舊有生態，必須與前端巧妙結合：

### 忽略打包硬體動態字典

```typescript
rollupOptions: {
    // 透過 Regex 忽略 /locales/dict/ 內的資源
    external: [/^src\/locales\/dict\//],
}
```

**目的**:
ASUS 路由器內部可能已有由 C/C++ 動態產生的舊版多國語系檔 (`dict`)。透過 `external` 屬性，Vite 會跳過這些檔案的打包，讓前端在 Runtime 執行時直接向設備請求，省下可觀的前端 Bundle 體積。

---

# 5. 產出結構最佳化 📂

為了讓編譯後的 `/dist` 與 C/C++ 團隊交接時清晰易讀，我們客製了 `assetFileNames`：

```text
/dist
├── index.html
├── assets/
│   ├── index.js                  # 入口
│   ├── vendor-quasar-[hash].js   # Quasar 快取塊
│   ├── views-main-[hash].js      # 業務邏輯塊
│   ├── css/
│   │   └── index-[hash].css      # 樣式集中
│   └── images/
│       └── logo-[hash].png       # 圖片集中
└── fonts/
    └── roboto-[hash].woff2       # 字型集中
```
**`-[hash]` 的意義**: 檔名隨內容改變，保證韌體升級時強制覆蓋瀏覽器舊快取。

---

# 總結 🎯

`vue3-wrt-project` 的 Production 打包配置展現了對硬體環境的高度掌握：

1. **安全第一**: 依賴 `base: './'` 確保路徑容錯。
2. **效能至上**: 透過 Rollup `manualChunks` 極大化利用瀏覽器快取。
3. **軟硬融合**: 藉由 `external` 與路由器原生的動態資源握手。
4. **管理方便**: 客製化的 `assetFileNames` 讓編譯產出整齊劃一。

這是一套既具備現代化前端效能，又能穩健運行於 ASUS Router 的架構。

---

# Q & A
感謝聆聽，歡迎發問！