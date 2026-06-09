# API 與參數設定邏輯分析報告

## 1. 系統架構背景對比

### Legacy 舊版架構 (`www` 專案)
- **核心技術**: 原生 JavaScript, jQuery (`$.ajax`, `$.getJSON`), DOM 操作。
- **狀態管理**: 依賴全域變數 (Global Variables，如 `_useAjax`) 或儲存於 DOM 的 hidden inputs。
- **API 通訊**: 透過 `$.ajax` 或原生的 `XMLHttpRequest` 直接呼叫後端 endpoints (例如 `/ajax_status.xml`, `ajax.js` 取 nvram)，多以 callback function 處理非同步結果。部分回傳為 XML 需手動解析。
- **參數設定**: 直接抓取或設定 DOM 元素值 (如 `document.getElementById('...').value`)，或組裝 queryString 傳遞。

### Modern 新版架構 (`vue3-wrt-project` 專案)
- **核心技術**: Vue 3 (Composition API), Vite, TypeScript, Axios。
- **狀態管理**: 使用 **Pinia** (如 `device.store.ts`) 進行全域狀態集中管理與快取。
- **API 通訊**: 
  - 封裝 Axios 為核心的 `http` 實例 (`api/core/http.ts`)，並採用 Interceptors (Auth, Form, Response) 進行統一錯誤處理與格式轉換。
  - 將 API 呼叫模組化 (如 `nvram.api.ts`, `hook.api.ts`)，使用 Promise/async-await 語法。
  - 統一透過 `appGet.cgi` 端點傳遞 `hook` 參數 (如 `nvram_get(...)`) 來獲取資料。
- **參數設定**: 透過 TypeScript 定義嚴謹的介面 (Interface/Type)，在 Pinia store 中將 API 回傳的資料綁定到 `ref` 與 `reactive` 變數上，UI 層完全數據驅動 (Data-Driven)。

---

## 2. API 結構與分析 (Task 1)

### 2.1 獲取 NVRAM 資料 (`nvram.api.ts`)
- **功能**: 從路由器獲取系統 NVRAM 設定值。
- **參數**: 
  - `nvramList: string[]` - NVRAM 鍵值陣列。
- **後端端點**: `appGet.cgi?hook=nvram_get(item1);nvram_get(item2)...`
- **返回值**: `Promise<T>` (經過 axios interceptor 轉換後的 JSON 物件，如 `Record<string, string>`)。
- **舊版對比**: 
  - 舊版多使用字串拼接 URL 或直接載入 `nvram.txt` 解析，缺少錯誤捕捉與型別檢查。
  - 新版透過封裝函數自動將 array map 成 hook string，提高可讀性且防呆。

### 2.2 獲取動態 Hook 資料 (`hook.api.ts`)
- **功能**: 從後端呼叫特定的 CGI hook function (例如 `get_ui_support`, `get_ethernet_wan_list`)。
- **參數**: `hookName: string`。
- **後端端點**: `appGet.cgi?hook=hookName()`
- **返回值**: 包含對應 Hook 資料的 JSON 物件。
- **舊版對比**: 
  - 舊版各個狀態常有獨立的 XML/JSON 檔案 (例如 `ajax_status.xml`) 或散落各處。
  - 新版高度抽象化，Pinia Store 中實作了 `registerHook` 與 `fetchAndProcessHooks`，允許批次抓取並使用 `Map` 快取，減少網路請求負擔。

### 2.3 寫入 NVRAM 資料 (`setNvram`)
- **功能**: 將使用者設定寫回系統。
- **參數**: `setData: Record<string, unknown>`
- **後端端點**: `applyapp.cgi` (POST)
- **舊版對比**: 舊版透過 HTML Form 進行 `submit()` 觸發頁面刷新，或用 `$.post` 傳遞 urlencoded。新版改為純 JSON / API 溝通，無需重整頁面，體驗更佳。

---

## 3. 參數設定與邏輯分析 (Task 2)

### 3.1 參數取得與解析邏輯 (以 `device.store.ts` 為例)
- **邏輯處理**: 
  - 呼叫 `fetchNvram` 後取得 `productid`, `rc_support`, `wlc_band` 等。
  - 在 Store 中針對回傳字串進行資料清洗與轉型：
    - 例如 `wlnband_list` 以 `&#60` 分割後進行數字排序。
    - `rc_support` 進行正規表達式 (Regex) 解析，區分 `usbX` 數量與其他布林值支援度，並存入 `deviceSupport` 這個 reactive 物件。
- **舊版對比**:
  - 舊版在 UI 層直接進行字串處理並決定顯示隱藏 (如 `if(rc_support.indexOf('...') != -1)`)。
  - 新版將業務邏輯 (Business Logic) 抽離到 Store 內，視圖 (Vue 檔) 只讀取 `deviceSupport.USB > 0` 即可，達到 UI 與邏輯解耦。

### 3.2 參數預設值與防錯機制
- **型別定義**: 參數如 `loading`, `error` 統一透過 `ref(false)`, `ref<unknown>(null)` 設定。獲取的字串有 fallback 機制 (例如 `odmpid || ''`)。
- **快取機制 (Cache)**:
  - 透過 `let fetchPromise: Promise<void> | null = null;` 避免元件同時 mount 造成多次 API 發送 (Shared Promise)。
  - `hookCache` map 會紀錄已取過的 hook 資料。
- **安全性與性能**: 新版加入請求共享防抖 (Promise Cache) 與資料快取，大幅改善頻寬浪費。所有資料受 TypeScript 型別保護，降低 runtime 錯誤。

---

## 4. 總結

新版 Vue 3 架構徹底改變了過去與 DOM 高度耦合的「義大利麵條式」程式碼，導入了 **API 封裝**、**攔截器 (Interceptor)** 與 **Pinia 狀態快取** 模式。不僅維持了與 Legacy 相同的底層 CGI 通訊邏輯 (`appGet.cgi` 與 hook 調用)，更在擴展性、維護性與型別安全性上達到現代前端開發標準。