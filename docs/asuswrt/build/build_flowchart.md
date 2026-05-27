# Vite 打包運作流程圖

本文件描述本專案從程式檢查、Vite build、chunk/asset 產出，到部署 ASUS Router device 的主要流程與檢查點。

## 1. 整體打包流程

```mermaid
flowchart TD
    A[開始發版或部署] --> B[確認 working tree]
    B --> C[安裝依賴 pnpm install]
    C --> D[Lint / Format 檢查]
    D --> E[Unit tests]
    E --> F[Type check vue-tsc]
    F --> G[Vite build]
    G --> H[Rollup chunk graph]
    H --> I[輸出 apps/web/dist]
    I --> J[檢查檔案結構與大小]
    J --> K{是否符合門檻}
    K -->|否| L[調整 chunk / asset / lazy loading]
    L --> F
    K -->|是| M[Router device 部署或交付 firmware]
```

## 2. Web build 詳細流程

```mermaid
flowchart TD
    A[pnpm --filter @vue3-wrt/web build] --> B[run-p type-check build-only]
    B --> C[vue-tsc --build]
    B --> D[vite build]
    D --> E[讀取 apps/web/vite.config.ts]
    E --> F[載入 env 與 mode]
    F --> G[使用 apps/web/asus.html 作為 input]
    G --> H[解析 src/main.ts]
    H --> I[解析 @ alias 到 packages/shared/src]
    I --> J[Vue / JSX / Quasar plugin 編譯]
    J --> K[Rollup tree shaking]
    K --> L[manualChunks 分組]
    L --> M[輸出 JS / CSS / assets / fonts]
```

## 3. 檢查點流程

```mermaid
flowchart TD
    A[程式碼變更] --> B{是否通過 TypeScript}
    B -->|否| B1[修正型別或 import]
    B -->|是| C{是否通過 Lint}
    C -->|否| C1[修正 correctness / Vue / TS 規則]
    C -->|是| D{是否通過 Unit tests}
    D -->|否| D1[修正 API / store / component 行為]
    D -->|是| E{Vite 是否可 build}
    E -->|否| E1[修正 module resolution / plugin / asset]
    E -->|是| F{Chunk 是否過大}
    F -->|是| F1[依 build_chunk_size.md 調整]
    F -->|否| G[可部署]
```

## 4. Chunk 與 Asset 產出流程

```mermaid
flowchart TD
    A[Rollup modules] --> B{是否來自 node_modules}
    B -->|是 Quasar| C[vendor-quasar]
    B -->|是 Vue ecosystem| D[vendor-vue-ecosystem]
    B -->|是 Axios| E[vendor-axios]
    B -->|其他第三方| F[vendor]
    B -->|否| G{是否 views/QIS}
    G -->|是| H[views-qis]
    G -->|否| I{是否其他 views}
    I -->|是| J[views-main]
    I -->|否| K{是否 locales}
    K -->|是| L[locales]
    K -->|否| M[依 Rollup 自動分組]
```

## 5. 輸出檔案流程

```mermaid
flowchart TD
    A[Vite output] --> B[HTML]
    A --> C[Entry JS]
    A --> D[Chunk JS]
    A --> E[CSS]
    A --> F[Images]
    A --> G[Fonts]
    B --> B1[dist/asus.html]
    C --> C1[dist/assets/asus.js]
    D --> D1[dist/assets/name-hash.js]
    E --> E1[dist/assets/css/name-hash.css]
    F --> F1[dist/assets/images/name-hash.ext]
    G --> G1[dist/fonts/name-hash.ext]
```

## 6. ASUS Router device 部署流程

```mermaid
flowchart TD
    A[完成 Web build] --> B[檢查 apps/web/dist]
    B --> C[確認 base 為 ./]
    C --> D[確認 asus.html 引用相對資源]
    D --> E{部署方式}
    E -->|Firmware 打包| F[交付 dist 給 firmware web root 流程]
    E -->|開發測試| G[複製 dist 到 device web root 或測試環境]
    F --> H[在 Router browser UI 開啟]
    G --> H
    H --> I[驗證登入 / API / QIS / 靜態資源]
```

## 7. 發版失敗回復流程

```mermaid
flowchart TD
    A[部署後發現問題] --> B{是否為靜態資源 404}
    B -->|是| C[檢查 base / 檔案路徑 / dist 結構]
    B -->|否| D{是否為 JS runtime error}
    D -->|是| E[回查 console / sourcemap / chunk]
    D -->|否| F{是否為 API/proxy 問題}
    F -->|是| G[檢查 Router CGI / cookie / origin]
    F -->|否| H[回退上一版 dist]
    C --> H
    E --> H
    G --> H
```
