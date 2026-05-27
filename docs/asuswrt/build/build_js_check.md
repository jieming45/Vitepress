# JavaScript / TypeScript 合法性檢查

本文件定義本專案在 Vite 打包前、中、後應如何檢查 JavaScript、TypeScript、Vue SFC 與測試合法性，確保輸出可穩定部署到 ASUS Router device、桌面瀏覽器與 iOS/Android Chrome/Safari。

## 1. 檢查目標

| 檢查類型 | 目的 | 目前工具 |
| --- | --- | --- |
| 語法檢查 | 確認 JS/TS/Vue SFC 可被 parser 正確解析 | `vite build`、`vue-tsc`、ESLint、Oxlint |
| 型別檢查 | 確認 Vue + TypeScript 型別契約正確 | `vue-tsc --build` |
| 程式正確性 | 檢查明顯錯誤、不可達邏輯、危險語法 | `oxlint` correctness |
| 風格與 Vue 規則 | 檢查 Vue essential rules、TS recommended rules | `eslint` |
| 格式一致性 | 統一縮排、引號、換行與行寬 | `prettier` |
| 單元測試 | 確認 shared package 的 API、store、composable、component 行為 | `vitest` |
| E2E 測試 | 確認瀏覽器流程 | `playwright` |
| 打包合法性 | 確認 Vite/Rollup 能完成 dependency graph、chunk、asset 產出 | `vite build` |

## 2. 目前可用指令

從 repository root 執行：

```powershell
pnpm lint
pnpm test:unit
pnpm test:e2e
pnpm build:web
pnpm build:electron
pnpm build:mobile
```

Web app package 內可用：

```powershell
pnpm --filter @vue3-wrt/web type-check
pnpm --filter @vue3-wrt/web build
pnpm --filter @vue3-wrt/web build-only
```

注意：目前 root `lint` 會執行 `oxlint . --fix` 與 `eslint . --fix --cache`，屬於可修改檔案的本機修復流程。若在 CI 或發版門檻中需要「只檢查不修改」，建議新增對應 check-only script，例如：

```json
{
  "scripts": {
    "lint:check": "run-s lint:oxlint-check lint:eslint-check",
    "lint:oxlint-check": "oxlint .",
    "lint:eslint-check": "eslint . --cache"
  }
}
```

## 3. TypeScript 合法性規則

`tsconfig.base.json` 已啟用以下限制：

| 設定 | 效果 |
| --- | --- |
| `noUnusedLocals` | 禁止未使用 local 變數 |
| `noUnusedParameters` | 禁止未使用參數 |
| `erasableSyntaxOnly` | 避免執行期需特殊轉換的 TS 語法 |
| `noFallthroughCasesInSwitch` | 防止 switch case 意外落入下一段 |
| `moduleResolution: bundler` | 對齊 Vite/Rollup module resolution |
| `noEmit` | type-check 階段不輸出檔案 |

`apps\web\package.json` 的 `build` 會平行執行 `type-check` 與 `build-only`：

```json
"build": "run-p type-check \"build-only {@}\" --"
```

正式發版時建議使用 `pnpm --filter @vue3-wrt/web build`，而不是只執行 root 的 `pnpm build:web`，因為 root `build:web` 目前只跑 `build-only`，不包含 `vue-tsc --build`。

## 4. 建議檢查時機

| 時機 | 必做檢查 | 說明 |
| --- | --- | --- |
| 開發中 | `pnpm --filter @vue3-wrt/web type-check` | 大型 refactor、API 型別變更、router 改動後立即執行 |
| Commit 前 | `pnpm lint`、`pnpm test:unit` | 先確認自動修復後的 diff，再提交 |
| PR 前 | `pnpm --filter @vue3-wrt/web build`、`pnpm test:e2e` | 確認 type-check、Vite build、瀏覽器流程 |
| 發版前 | `pnpm lint`、`pnpm test:unit`、`pnpm test:e2e`、`pnpm --filter @vue3-wrt/web build` | 發版輸出前的完整門檻 |
| 部署到 Router 前 | 檢查 `apps\web\dist` 檔案結構與檔案大小 | 確認 `asus.html`、`assets\asus.js`、chunk、CSS、font、image 皆存在 |

## 5. Vite 打包期間的合法性檢查

`vite build` 會檢查：

1. `apps\web\asus.html` 是否能作為 Rollup input。
2. `src\main.ts` 與所有 import dependency 是否可解析。
3. Vue SFC template、script、style 是否可被對應 plugin 編譯。
4. `@` alias 是否可解析到 `packages\shared\src`。
5. Rollup chunk graph 是否能產出。
6. asset file name 是否能符合 `rollupOptions.output` 規則。

Vite build 不取代 TypeScript 型別檢查；因此正式打包需搭配 `vue-tsc --build`。

## 6. 錯誤處理原則

| 錯誤 | 處理方式 |
| --- | --- |
| TypeScript error | 修正型別或資料契約，不使用 `as any` 掩蓋 |
| ESLint/Oxlint correctness error | 視為 build blocker |
| Vue template compile error | 修正 template 或 component import |
| Vite module resolution error | 檢查 alias、package exports、檔案大小寫與路徑 |
| Chunk size warning | 依 `build_chunk_size.md` 檢查是否需要拆分、合併或調整限制 |
| 測試失敗 | 先確認是否為既有 baseline；若由本次變更造成必須修正 |

## 7. 發版前檢查清單

1. `git status` 確認工作區無非預期變更。
2. 執行 `pnpm lint` 並檢查自動修復 diff。
3. 執行 `pnpm test:unit`。
4. 執行 `pnpm --filter @vue3-wrt/web build`。
5. 若涉及 routing、登入、QIS flow，執行 `pnpm test:e2e`。
6. 檢查 `apps\web\dist` 檔案結構、chunk 大小與必要資源。
7. 依 `build_deploy.md` 部署到 ASUS Router device 或交付給 firmware/web server 打包流程。
