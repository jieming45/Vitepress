# 打包進 ASUS Router Device 指南

本文件定義如何將本專案 Web app 打包後的檔案準備給 ASUS Router device 使用。專案目前尚未提供自動部署到 device 的 script，因此本文件定義可重複執行的手動/交付流程。

## 1. 目標輸出

Web app 由 `apps\web` 打包，輸出目錄為：

```txt
apps\web\dist
```

入口設定：

| 項目 | 設定 |
| --- | --- |
| Vite input | `apps\web\asus.html` |
| base | `./` |
| entry JS | `assets\asus.js` |
| assets dir | `assets` |
| CSS | `assets\css\[name]-[hash].css` |
| images | `assets\images\[name]-[hash][extname]` |
| fonts | `fonts\[name]-[hash][extname]` |

`base: './'` 是部署到 ASUS Router device 的關鍵設定，確保 HTML、JS、CSS、image、font 使用相對路徑，不依賴固定 domain 或根目錄。

## 2. 部署前準備

確認 Node 版本符合 root `package.json`：

```txt
^20.19.0 || >=22.12.0
```

安裝依賴：

```powershell
pnpm install
```

正式打包前建議執行：

```powershell
pnpm lint
pnpm test:unit
pnpm --filter @vue3-wrt/web build
```

若涉及完整瀏覽器流程：

```powershell
pnpm test:e2e
```

## 3. 建立 Web build

正式發版：

```powershell
pnpm --filter @vue3-wrt/web build
```

快速只產出 dist：

```powershell
pnpm build:web
```

兩者差異：

| 指令 | 內容 | 適用情境 |
| --- | --- | --- |
| `pnpm --filter @vue3-wrt/web build` | `vue-tsc --build` + `vite build` | 發版、PR、部署前 |
| `pnpm build:web` | `vite build` | 本機快速產出 dist |

## 4. 檢查輸出檔案

打包完成後檢查：

```powershell
Get-ChildItem -Recurse apps\web\dist
```

預期至少包含：

```txt
apps\web\dist\
  asus.html
  assets\
    asus.js
    [chunk]-[hash].js
    css\
      [name]-[hash].css
    images\
      [name]-[hash][extname]
  fonts\
    [name]-[hash][extname]
```

檢查項目：

1. `asus.html` 存在。
2. `assets\asus.js` 存在。
3. hashed chunk 存在且被 HTML/entry 正確引用。
4. CSS、image、font 路徑為相對路徑。
5. 沒有絕對指向 localhost、Vite dev server、Windows 本機路徑。
6. 最大 chunk 與 asset 符合 `build_chunk_size.md` 門檻。

## 5. 部署到 ASUS Router device 的方式

實際 device web root 與 firmware 打包流程會依產品線、韌體與測試環境而不同。本專案定義兩種交付模式。

### 5.1 Firmware 打包模式

適合正式整合：

1. 執行正式 Web build。
2. 將 `apps\web\dist` 交付給 firmware/web UI packaging 流程。
3. 確認 `asus.html` 被放入 Router web UI 可存取位置。
4. 保留 `assets` 與 `fonts` 的相對層級結構。
5. 確認 Router web server 可正確回傳 `.js`、`.css`、font、image MIME type。
6. 若啟用 gzip，確認 `.gz` 與 `Content-Encoding: gzip` 對應正確。

### 5.2 開發測試模式

適合 device 或 staging 環境快速驗證：

1. 備份 device 上既有 web UI 檔案。
2. 將 `apps\web\dist\asus.html`、`apps\web\dist\assets`、`apps\web\dist\fonts` 複製到測試 web root。
3. 以 browser 開啟對應 Router URL。
4. 檢查 browser devtools 是否有 404、MIME type、CORS、cookie、JS runtime error。
5. 測試完成後依需要回復原始 web UI。

若使用 SCP、ADB、firmware image 或其他內部工具部署，需以產品線實際流程為準，但不得改變 `dist` 內的相對目錄結構。

## 6. Router API 與 dev proxy 差異

開發模式由 `apps\web\vite.config.ts` proxy `.cgi`、`.asp`、`.json` 等請求到 `VITE_ROUTER_URL`。

部署到 device 後：

1. 不再使用 Vite dev server proxy。
2. 前端應以相對路徑呼叫 Router CGI/API。
3. Cookie session 由 Router 同 origin web server 管理。
4. `VITE_API_BASE_URL` 若留空，API 會跟隨目前 origin。
5. 若指定 `VITE_API_BASE_URL`，需確認 device 上的 origin、cookie 與 CORS 行為。

## 7. 壓縮與快取

建議策略：

| 檔案 | 快取策略 |
| --- | --- |
| `asus.html` | 不長快取，確保可載入最新版 chunk |
| `assets\asus.js` | 穩定檔名，需依部署版本控制快取 |
| `assets\[name]-[hash].js` | 可長快取 |
| `assets\css\[name]-[hash].css` | 可長快取 |
| `assets\images\[name]-[hash]` | 可長快取 |
| `fonts\[name]-[hash]` | 可長快取 |

若 Router web server 支援 gzip：

1. 對 `.js`、`.css`、`.html` 產生 gzip。
2. 保留原始檔。
3. 設定正確 `Content-Encoding` 與 `Content-Type`。
4. 在 iOS Safari、Android Chrome、桌面 Chrome/Safari 驗證可正常載入。

## 8. Device 驗證清單

部署後至少驗證：

1. `asus.html` 可開啟。
2. `assets\asus.js`、hashed chunks、CSS、fonts、images 無 404。
3. 首頁與 Login 頁可載入。
4. 登入流程可取得 nonce、提交 `login_v2.cgi`、維持 cookie。
5. `appGet.cgi`、`applyapp.cgi`、`apply.cgi` 等 Router CGI 可被同 origin 呼叫。
6. QIS wizard 可進入並切換主要 step。
7. 語系切換正常。
8. iOS Safari、Android Chrome、桌面 Chrome/Safari 行為一致。
9. Browser console 無 blocking error。
10. 回退舊版 web UI 的方法已確認。

## 9. 回退策略

1. 每次部署前保留上一版 `dist` 或 firmware image。
2. 若部署後出現資源 404，優先回退並檢查目錄層級。
3. 若 JS runtime error 阻斷登入，回退上一版 web UI。
4. 若 API/cookie 行為異常，確認是否部署到正確 origin 與 CGI 路徑。
5. 回退後保留錯誤 log、browser console、network trace 供後續修正。
