---
theme: seriph
background: https://source.unsplash.com/collection/94734566/1920x1080
class: text-center
highlighter: shiki
lineNumbers: false
info: |
  ## Vite 在 Vue3 WRT 專案中的運作機制與實踐
  深入解析打包、檢查、測試與硬體 Proxy 代理
drawings:
  persist: false
transition: slide-left
title: Vite 在 Vue3 WRT 專案中的實踐
---

# Vite 運作機制與實踐 🚀

深入解析：打包、代碼檢查、測試與硬體 Proxy 代理

---

# 目錄

1. **Vite 打包機制 (Build)**
   - 雙引擎架構與 Rollup 優化
2. **代碼檢查機制 (Linting)**
   - Oxlint 結合 ESLint 的極速流程
3. **測試環境整合 (Testing)**
   - Vitest 與 Playwright 的分工
4. **開發代理伺服器 (Dev Proxy)**
   - 跨域挑戰與設備遺留 (Legacy) 問題的解決方案
5. **團隊最佳實踐**

---

# 1. Vite 打包機制 (Build) 📦

Vite 採用**雙引擎架構**，分別在開發與生產環境發揮各自優勢：

- **開發期 (esbuild + 原生 ESM)**:
  - 近乎瞬間的冷啟動。
  - 將 CommonJS 依賴「預構建」為 ESM，減少請求負載。
- **生產期 (Rollup)**:
  - 深度優化的靜態資源輸出。
  - 支援 Tree-shaking 剔除無用代碼。

## 本專案的 Code Splitting 策略
在 `vite.config.ts` 的 `manualChunks` 中：
- `vendor-quasar`, `vendor-vue`: 第三方庫拆分，提升瀏覽器快取命中率。
- `views-qis`, `views-main`: 針對業務模塊進行 Chunk 分割。

---

# 打包與構建流程圖

```mermaid
graph TD;
    A[源代碼 (Vue/TS/SCSS)] --> B{Vite Build};
    B -->|ESM 解析| C[Rollup 打包];
    C --> D[Tree-shaking 剔除無用代碼];
    C --> E[Code Splitting 分塊];
    E --> F[第三方模組 (Vendor Chunks)];
    E --> G[業務邏輯 (Views Chunks)];
    D --> I[代碼壓縮 (esbuild)];
    F --> I;
    G --> I;
    I --> J[輸出 /dist];
```

---

# 2. 代碼檢查機制 (Linting) 🔍

為了在龐大的 Vue/TS 專案中兼顧「速度」與「準確度」，專案採用雙重防線：

1. **Oxlint (極速掃描)**:
   - 基於 Rust 開發。
   - 負責在毫秒內捕捉基礎語法錯誤，減低 Node.js Linter 的負擔。
2. **ESLint + Flat Config (深入校驗)**:
   - 執行 `@vue/eslint-config-typescript` 校驗型別與 Vue `<script setup>` 語法。
   - 搭配 Prettier 的 `skipFormatting`，確保「排版交給 Prettier，語法交給 ESLint」。

> **執行指令**: `pnpm lint` (透過 npm-run-all2 循序執行)

---

# 3. 測試環境整合 (Testing) 🧪

確保代碼能穩定運行於設備中，測試框架選型與 Vite 緊密掛鉤。

- **單元測試: Vitest**
  - 與 Vite 共享 `vite.config.ts` (包含 Alias、Plugins 等)。
  - 具備原生的 HMR 能力，修改代碼後瞬間重新跑測試。
  - 使用 `jsdom` 模擬瀏覽器環境。
- **端到端測試: Playwright**
  - 無頭瀏覽器驅動，從外部對打包後的專案進行真實使用者點擊、表單送出等黑箱測試。

---

# 4. 開發代理伺服器 (Dev Proxy) 🌉

**核心問題：** 本地 `localhost:5173` 開發時，呼叫路由器 API (例如 `appGet.cgi`) 會遭遇跨域 (CORS) 與認證被阻擋。

**Vite Proxy 的解決方案：**
- **路徑攔截**: 攔截 `*.cgi`, `*.asp`, `*.json` 等請求轉發至硬體 IP。
- **跨域繞過**: `changeOrigin: true` 隱藏真實來源。
- **維持登入狀態**: `cookieDomainRewrite: 'localhost'` 讓設備的 Session 順利存回開發者的瀏覽器。
- **欺騙防護機制**: 手動加入 `Referer` 標頭以符合設備的安全檢查。

---

# 致命的 304 狀態碼問題與防禦 🛡️

**狀況**：ASUS 路由器內嵌 httpd 會違背標準，在 304 狀態碼下附帶 Body，導致 Node.js Proxy **直接崩潰** (`Parse Error`)。

**防禦機制**：
1. **開啟容錯模式 (`InsecureHttpAgent`)**: 
   - 自訂 http Agent 並設定 `insecureHTTPParser = true`，提升 Node 的解析寬容度。
2. **閹割條件請求 (`stripConditionalHeaders`)**: 
   - 攔截發送前的請求，移除 `if-none-match` 與 `if-modified-since`。
   - 強迫硬體**每次都回傳 200 OK**，從根本上消滅帶有 Body 的 304 錯誤。

---

# 5. 團隊最佳實踐 💡

1. **環境變數抽離**: 
   - 測試用硬體 IP 應定義於本地的 `.env.development.local` (`VITE_ROUTER_URL`)，不要寫死在代碼中以防 Git 衝突。
2. **守護 Proxy 護欄**: 
   - 切勿移除 `vite.config.ts` 中關於 `InsecureHttpAgent` 的設定。未來若新增轉發規則，務必套用相同的 `agent` 與 `configure`。
3. **推崇 HMR 測試驅動**: 
   - 充分享用 Vitest 的熱更新，開發組件時同步撰寫單元測試。
4. **維持 ESM 規範**: 
   - 拒絕直接使用 CommonJS，讓 Vite Dev Server 發揮其閃電般的冷啟動實力。

---

# Thank You! 🚀
如有問題歡迎討論