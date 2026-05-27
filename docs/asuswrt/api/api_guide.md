# API 使用指南

本指南提供前端開發者在本專案中新增、呼叫與維護 API 的標準流程。目標是讓 Vue component、Pinia store、composable 與後端 API 之間保持清楚分工。

## 1. 開發原則

1. 頁面與元件不直接處理 HTTP 細節，應呼叫 `packages\shared\src\api` 內的 API function。
2. 一般請求統一使用 `@/api/core/http`，沿用 timeout、cookie、interceptor 與回應解包。
3. API function 只封裝「如何呼叫 API」與必要資料轉換，不處理 UI 顯示。
4. Store/composable 負責 loading、error、cache、重試與跨頁狀態。
5. Component 負責表單驗證、按鈕狀態、錯誤提示與導頁。

## 2. 新增 API 的標準流程

### Step 1：選擇 API 檔案位置

| 情境 | 建議位置 |
| --- | --- |
| 登入、登出、captcha、session | `packages\shared\src\api\module\auth.api.ts` |
| Router hook function | `packages\shared\src\api\hook.api.ts` |
| NVRAM 讀寫 | `packages\shared\src\api\nvram.api.ts` |
| 裝置重啟、狀態、系統操作 | `packages\shared\src\api\reboot.api.ts` 或 `module\device.api.ts` |
| 新功能領域 | `packages\shared\src\api\module\{feature}.api.ts` |
| 檔案上傳 | `packages\shared\src\api\upload.api.ts` |

### Step 2：定義 request/response 型別

```ts
export interface WanInfo {
    proto: string;
    ipaddr: string;
    gateway: string;
}
```

若後端回傳非標準格式，使用明確型別描述實際結果，不要用 `any` 作為公開 API 回傳型別。

### Step 3：透過共用 `http` 封裝呼叫

```ts
import http from '@/api/core/http';

export function fetchWanInfo(): Promise<WanInfo> {
    return http.get('wan_info.cgi');
}
```

標準 JSON API 若回傳 `{ code, message, data }`，呼叫端會直接取得 `data`。

### Step 4：在 store/composable 使用

```ts
import { ref } from 'vue';
import { fetchWanInfo, type WanInfo } from '@/api/module/wan.api';

const loading = ref(false);
const error = ref<unknown>(null);
const wanInfo = ref<WanInfo | null>(null);

async function loadWanInfo() {
    loading.value = true;
    error.value = null;

    try {
        wanInfo.value = await fetchWanInfo();
    } catch (err) {
        error.value = err;
        throw err;
    } finally {
        loading.value = false;
    }
}
```

### Step 5：補上單元測試

API function 測試應 mock `@/api/core/http`，確認 URL、method、params、body、headers 與錯誤傳遞。

```ts
vi.mock('@/api/core/http', () => ({
    default: {
        get: vi.fn(),
    },
}));
```

## 3. 常見 API 呼叫範例

### 3.1 讀取 NVRAM

```ts
import { fetchNvram } from '@/api/nvram.api';

const nvram = await fetchNvram<Record<string, string>>(['productid', 'rc_support']);
console.log(nvram.productid);
```

產生的 request：

```txt
GET appGet.cgi?hook=nvram_get(productid);nvram_get(rc_support)
```

### 3.2 寫入 NVRAM / 套用設定

```ts
import { setNvram } from '@/api/nvram.api';

await setNvram({
    action_mode: 'apply',
    rc_service: 'restart_wireless',
    wl_ssid: 'MyWiFi',
});
```

### 3.3 呼叫 Hook

```ts
import { fetchHook } from '@/api/hook.api';

const support = await fetchHook<Record<string, unknown>>('get_ui_support');
```

呼叫 `fetchHook()` 時只傳 hook 名稱，不要包含 `()`。

### 3.4 表單格式 POST

```ts
import http from '@/api/core/http';

await http.post(
    '/apply.cgi',
    {
        action_mode: 'reboot',
        action_script: '',
        action_wait: 60,
    },
    {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    },
);
```

`form.plugin.ts` 會將 object body 轉成 URL encoded string。

### 3.5 v2 登入流程

```ts
const id = randomString(10);
const nonce = await fetchNonce(id);
const cnonce = randomString(32);
const loginAuthorization = await sha256(`${username}:${nonce}:${password}:${cnonce}`);

const html = await submitLoginV2({
    id,
    cnonce,
    loginAuthorization,
    loginCaptcha: captcha ? btoa(captcha) : '',
    nextPage: '',
});
```

登入成功與否由回傳 HTML 判斷：

```ts
if (isLoginSuccess(html)) {
    await authStore.checkAuth();
    router.push('/');
} else {
    const pageData = parseLoginPageData(html);
}
```

### 3.6 檔案上傳

```ts
const formData = new FormData();
formData.append('file', file);

await http.post('upload.cgi', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    onUploadProgress: (event) => {
        if (event.total) {
            progress.value = event.loaded / event.total;
        }
    },
});
```

上傳 API 建議封裝成獨立 `upload.api.ts`，避免 component 直接依賴 Axios。

## 4. 錯誤處理方式

### 4.1 API 層

API function 預設不捕捉錯誤，讓 `http` interceptor 與呼叫端處理：

```ts
export function fetchHook<T = unknown>(hookName: string): Promise<T> {
    return http.get('appGet.cgi', {
        params: { hook: `${hookName}()` },
    });
}
```

只有在「初始化狀態允許安全 fallback」時才可於 API 層 catch，例如登入頁狀態讀取失敗時回到未登入預設狀態。

### 4.2 Store/composable 層

Store/composable 應保存錯誤並視需求重新拋出：

```ts
try {
    await loadData();
} catch (err) {
    error.value = err;
    console.error('Failed to load data:', err);
    throw err;
}
```

### 4.3 Component 層

Component 應處理使用者可見狀態：

| 情境 | UI 行為 |
| --- | --- |
| 表單送出中 | 禁用 submit，避免重複請求 |
| 驗證錯誤 | 顯示欄位錯誤 |
| API 業務錯誤 | 顯示 `Error.message` 或對應 i18n |
| 認證失敗 | 交由 auth store/router guard 控制 |
| 檔案上傳失敗 | 顯示上傳失敗並重置進度狀態 |

## 5. 開發環境與 Proxy

`.env.development`：

```env
VITE_ROUTER_URL=http://www.asusrouter.com/
VITE_API_BASE_URL=
```

開發模式下 `apps\web\vite.config.ts` 會將 `.cgi`、`.asp`、`.json`、`.cfg`、`.log`、`.ico` 等請求 proxy 到 `VITE_ROUTER_URL`。

使用規則：

1. 開發模式 `VITE_API_BASE_URL` 可留空，讓相對路徑走 Vite proxy。
2. 若部署在 router web server，同樣優先使用相對路徑。
3. 若跨 origin 呼叫 API，需確認 cookie、CORS、SameSite 與 `withCredentials` 行為。

## 6. 命名與型別規範

| 項目 | 規範 |
| --- | --- |
| API 檔名 | `{domain}.api.ts` 或 `module\{domain}.api.ts` |
| 讀取 function | `fetchXxx`、`getXxx` |
| 寫入 function | `setXxx`、`updateXxx`、`submitXxx` |
| 動作 function | `rebootDevice`、`uploadProfile` |
| Request type | `{Action}Request` 或具體參數 interface |
| Response type | `{Action}Response` 或實際資料 interface |
| 泛型 | 僅在 hook/NVRAM 等回應高度動態的 API 使用 |

## 7. 維護檢查清單

新增或修改 API 時，請確認：

1. API 是否放在正確分類檔案。
2. 是否使用 `@/api/core/http`。
3. URL、method、params、body、headers 是否有測試覆蓋。
4. 回應型別是否準確，不以 `any` 作為公開契約。
5. 錯誤是否向上傳遞或有明確 fallback。
6. Component 是否避免重複送出與處理 loading/error。
7. iOS/Android 與桌面瀏覽器是否都使用相同相對路徑與資料格式。
8. 若新增後端端點，是否同步更新 `api\api_definition.md`。
