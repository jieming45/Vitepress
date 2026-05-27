# API 定義文件

本文件定義前端與後端 API 的呼叫方法、分類、檔案位置、請求/回應格式與錯誤處理規範。適用於本專案的 Vue 3 + Quasar + Vite + TypeScript 架構，主要實作位於 `packages\shared\src\api`。

## 1. API 檔案位置與責任

| 類型 | 位置 | 責任 |
| --- | --- | --- |
| API 文件 | `api\api_definition.md` | API 分類、參數、回應與錯誤處理規範 |
| API 使用指南 | `api\api_guide.md` | 前端開發者新增與使用 API 的流程 |
| API 流程圖 | `api\api_flowchart.md` | 請求、回應、登入與錯誤處理流程 |
| HTTP 核心實例 | `packages\shared\src\api\core\http.ts` | 建立 Axios instance、設定 baseURL、timeout、cookie 與 interceptor |
| HTTP 型別 | `packages\shared\src\api\core\types.ts` | 定義 `ApiResponse<T>` 與解包後的 `HttpInstance` 回傳型別 |
| API 插件 | `packages\shared\src\api\plugins` | request/response/auth interceptor |
| 功能 API | `packages\shared\src\api\*.api.ts`、`packages\shared\src\api\module\*.api.ts` | 依功能封裝實際 API 呼叫 |

## 2. API 呼叫基礎規範

所有一般 API 呼叫應透過 `packages\shared\src\api\core\http.ts` 匯出的 `http` 實例，不應在頁面或元件中直接建立新的 Axios instance。

```ts
import http from '@/api/core/http';

export function fetchExample<T = unknown>(): Promise<T> {
    return http.get('example.cgi');
}
```

HTTP 實例預設設定：

| 設定 | 值 | 說明 |
| --- | --- | --- |
| `baseURL` | `import.meta.env.VITE_API_BASE_URL` | 開發模式可留空並交由 Vite proxy 轉發 |
| `timeout` | `10000` | API 最長等待 10 秒 |
| `withCredentials` | `true` | 攜帶 router session cookie |
| `Content-Type` | `application/json` | 預設 JSON；表單 API 需明確覆寫 |
| `paramsSerializer.indexes` | `null` | 陣列參數不輸出 index |

Interceptor 註冊順序：

1. `setupAuthInterceptor(http)`
2. `setupFormInterceptor(http)`
3. `setupResponseInterceptor(http)`

## 3. API 回應格式

### 3.1 標準 JSON API

標準 API 建議採用以下格式：

```ts
export interface ApiResponse<T = unknown> {
    code: number;
    message: string;
    data: T;
}
```

| 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `code` | `number` | `0` 表示成功，非 `0` 表示業務錯誤 |
| `message` | `string` | 成功或錯誤訊息 |
| `data` | `T` | 實際資料 |

`setupResponseInterceptor` 會自動處理：

| 情境 | 前端取得結果 |
| --- | --- |
| `code === 0` | 回傳 `data` |
| `code !== 0` | `Promise.reject(new Error(message))` |
| 無 `code` 欄位 | 直接回傳 `response.data` |
| HTTP/network error | 記錄 `[HTTP ERROR]` 並 reject 原錯誤 |

### 3.2 非標準 Router CGI / HTML API

ASUS Router 現有 CGI/ASP 可能回傳 HTML、字串、或非標準 JSON。這類 API 應在 API 層或呼叫端明確解析，不可假設一定符合 `ApiResponse<T>`。

範例：

| API | 回應型態 | 處理方式 |
| --- | --- | --- |
| `Main_Login.asp` | HTML string | `parseLoginPageData()` 解析登入狀態 |
| `login_v2.cgi` | HTML string | `isLoginSuccess()` 判斷 meta refresh |
| `appGet.cgi` | hook/NVRAM JSON 或字串 | 由 `fetchHook<T>()`、`fetchNvram<T>()` 指定泛型 |

## 4. API 分類

| 分類 | 主要檔案 | 用途 |
| --- | --- | --- |
| HTTP Core | `core\http.ts`、`core\types.ts` | 統一 Axios 設定與型別 |
| Plugin | `plugins\*.plugin.ts` | 認證、表單序列化、回應解包與錯誤處理 |
| Authentication | `module\auth.api.ts` | 登入頁狀態、nonce、v1/v2 登入 |
| Hook | `hook.api.ts` | 呼叫 router hook function |
| NVRAM | `nvram.api.ts` | 讀取/寫入 router NVRAM |
| Device | `reboot.api.ts`、`module\device.api.ts` | 裝置資訊與重啟 |
| Upload | 目前位於 `views\QIS\AdvancedSettings.vue` | 上傳設定檔至 `upload.cgi` |
| Store/Composable 使用端 | `stores`、`composables`、`views` | 呼叫 API 並管理 loading/error/UI 流程 |

## 5. API 端點與參數定義

### 5.1 Authentication API

位置：`packages\shared\src\api\module\auth.api.ts`

#### `loginRouter(username, password)`

舊版 v1 登入，保留向後相容。

| 項目 | 定義 |
| --- | --- |
| Method | `POST` |
| URL | `login.cgi` |
| Content-Type | `application/x-www-form-urlencoded` |
| Request body | `login_authorization={base64(username:password)}` |
| Response | Router 原始回應 |
| Error | 透過 `http` reject 傳遞 |

#### `fetchLoginStatus()`

取得登入頁面狀態。

| 項目 | 定義 |
| --- | --- |
| Method | `GET` |
| URL | `Main_Login.asp` |
| Request params | 無 |
| Response | `LoginPageData` |
| 解析內容 | `login_info`、`captcha_enable`、`ui_support.captcha` |
| Error | 目前回傳 `{ loginInfo: null, captchaEnable: '0', captchaSupport: false }` 作為登入頁初始化安全值 |

#### `fetchNonce(id)`

取得 v2 登入 challenge nonce。

| 項目 | 定義 |
| --- | --- |
| Method | `POST` |
| URL | `get_Nonce.cgi` |
| Request body | `{ id: string }` |
| Response | `string`，取自 `result.nonce` |

#### `submitLoginV2(params)`

提交 nonce-based challenge-response 登入。

| Request 欄位 | 型別 | 說明 |
| --- | --- | --- |
| `id` | `string` | client 產生的登入識別碼 |
| `cnonce` | `string` | client nonce，建議 32 字元隨機字串 |
| `loginAuthorization` | `string` | `sha256(username:nonce:password:cnonce)` |
| `loginCaptcha` | `string` | captcha Base64；無 captcha 時為空字串 |
| `nextPage` | `string` | 經安全過濾後的登入成功導向頁 |

| 項目 | 定義 |
| --- | --- |
| Method | `POST` |
| URL | `login_v2.cgi` |
| Content-Type | `application/x-www-form-urlencoded` |
| Response | HTML string |
| 成功判斷 | `isLoginSuccess(html)` 檢查 meta refresh |
| 失敗處理 | `parseLoginPageData(html)` 更新錯誤狀態與 captcha |

### 5.2 Hook API

位置：`packages\shared\src\api\hook.api.ts`

#### `fetchHook<T>(hookName)`

| 項目 | 定義 |
| --- | --- |
| Method | `GET` |
| URL | `appGet.cgi` |
| Query params | `{ hook: `${hookName}()` }` |
| Response | `Promise<T>` |
| 範例 | `fetchHook<Record<string, unknown>>('get_ui_support')` |

注意：呼叫端傳入的 `hookName` 應為純 hook 名稱，例如 `get_ui_support`。若 hook 已包含 `()`，會產生重複括號，新增功能時應避免。

### 5.3 NVRAM API

位置：`packages\shared\src\api\nvram.api.ts`

#### `fetchNvram<T>(nvramList)`

| 項目 | 定義 |
| --- | --- |
| Method | `GET` |
| URL | `appGet.cgi` |
| Query params | `{ hook: 'nvram_get(key1);nvram_get(key2)' }` |
| Request | `string[]` |
| Response | `Promise<T>`，通常為 `Record<string, string>` |

#### `fetchNvramDefault<T>(nvramList)`

| 項目 | 定義 |
| --- | --- |
| Method | `GET` |
| URL | `appGet.cgi` |
| Query params | `{ hook: 'nvram_default_get(key1);nvram_default_get(key2)' }` |
| Request | `string[]` |
| Response | `Promise<T>`，通常為 `Record<string, string>` |

#### `setNvram<T>(setData)`

| 項目 | 定義 |
| --- | --- |
| Method | `POST` |
| URL | `applyapp.cgi` |
| Request body | `Record<string, unknown>` |
| Response | `Promise<T>` |
| 常見欄位 | `action_mode`、`rc_service`、各 NVRAM key/value |

### 5.4 Device / Reboot API

位置：`packages\shared\src\api\reboot.api.ts`

#### `rebootDevice(rebootTime = 60)`

| 項目 | 定義 |
| --- | --- |
| Method | `POST` |
| URL | `/apply.cgi` |
| Content-Type | `application/x-www-form-urlencoded` |
| Request body | `{ action_mode: 'reboot', action_script: '', action_wait: number }` |
| Response | `Promise<void>` |

位置：`packages\shared\src\api\module\device.api.ts`

| Function | Method | URL | 說明 |
| --- | --- | --- | --- |
| `getDeviceInfo()` | `GET` | `/device/info` | REST-style 裝置資訊 API，需由後端支援 |
| `rebootDevice()` | `POST` | `/device/reboot` | REST-style 裝置重啟 API，需由後端支援 |

### 5.5 Upload API

目前實作位置：`packages\shared\src\views\QIS\AdvancedSettings.vue`

| 項目 | 定義 |
| --- | --- |
| Method | `POST` |
| URL | `upload.cgi` |
| Content-Type | `multipart/form-data` |
| Request body | `FormData`，欄位 `file` |
| Progress | 使用 Axios `onUploadProgress` 更新進度 |
| Error | 呼叫端顯示或記錄上傳錯誤 |

建議後續將此呼叫封裝至 `packages\shared\src\api\upload.api.ts`，讓頁面僅負責檔案驗證與 UI 狀態。

## 6. 錯誤處理規範

| 層級 | 責任 |
| --- | --- |
| `response.plugin.ts` | 解包標準回應、處理 `code !== 0`、記錄 HTTP 錯誤並 reject |
| `auth.plugin.ts` | 401 不直接 `location.href`，交由 router guard 或 auth store 處理 |
| API function | 不吞錯；除非有明確的初始化 fallback，否則讓錯誤往上拋 |
| Store/composable | 管理 `loading`、`error`、快取與重試 |
| View/component | 呈現錯誤訊息、禁用重複提交、處理表單驗證 |

新增 API 時應避免空的 `catch` 或無記錄的 early return。若必須 fallback，需在 API 或呼叫端明確說明 fallback 的業務意義。

## 7. 相容性規範

為確保 iOS/Android Chrome/Safari 與桌面瀏覽器行為一致：

1. API URL 優先使用相對路徑，避免跨平台 origin 差異。
2. 認證依賴 cookie 的請求必須透過共用 `http`，保留 `withCredentials: true`。
3. 表單 API 應明確指定 `application/x-www-form-urlencoded` 或 `multipart/form-data`。
4. 檔案上傳使用 `FormData`，不得手動組 multipart boundary。
5. UI 層不可假設所有 Router CGI 都回 JSON，必須依 API 定義解析 HTML/string/JSON。
