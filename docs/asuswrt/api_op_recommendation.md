# API 結構與參數設定最佳調整建議

基於 Legacy 舊版 (`www`) 與 Modern 新版 (`vue3-wrt-project`) 架構的對比分析，為確保新版 API 的穩定性、安全性與未來的擴展性，提出以下最佳實踐與調整建議：

## 1. 確保功能一致性與向後相容

- **Payload 結構一致性**: 
  - 建議在 Axios 的 interceptors 內，新增檢查層，確保送至 `applyapp.cgi` 的 JSON keys 完全對應舊版 form 提交的 keys。
  - 對於特定舊版中以 `url-encoded` 形式接收的參數，確保後端 CGI 能正確解析 `application/json`，若否，則需在 interceptor 內轉換為 `x-www-form-urlencoded`。

- **錯誤處理 (Fallback) 機制**:
  - 舊版中當 `nvram` 值為空時，通常有全域或 UI 級別的防呆。
  - 建議在 Pinia store 中 (如 `device.store.ts`) 設定嚴格的預設值 (Default Values)。例如 `wlc_band` 或 `operationMode` 若解析為 `undefined` 時，給予預設常數 (`unknown` 或特定數值)。

## 2. API 結構的現代化優化

- **集中式 API 路由表**:
  - 目前 `nvram.api.ts` 與 `hook.api.ts` 都寫死了字串拼接 `appGet.cgi` 與 `applyapp.cgi`。
  - **建議**: 將所有的 Endpoint 抽離至一個 `api/endpoints.ts` 檔內管理，未來若後端 API 演進 (例如更換為 RESTful 或 gRPC)，可大幅降低修改成本。

- **Hooks 批次請求優化**:
  - `device.store.ts` 中的 `fetchAndProcessHooks` 已具備基礎的 Promise.all 批次處理能力，但送出的是多個獨立 HTTP 請求。
  - **建議**: 若後端 `appGet.cgi` 支援多個 hooks 串接 (如 `hook=get_ui_support();get_ethernet_wan_list()`)，可進一步修改 `fetchHook` API 支援 Array 參數，減少網路 Handshake 次數，大幅提升設備的載入速度。

## 3. 參數處理與型別安全

- **Zod 或是 Joi 進行 Schema 驗證**:
  - 目前仰賴 `as EthernetWanInfo` 等 Type Assertion 進行強制轉型，這在 Runtime (執行期間) 並無實際保護作用。
  - **建議**: 引入 `zod` 或 `yup`，在取得回傳資料時先行 validate (驗證) 參數結構是否符合預期，若後端格式有變，能在第一時間捕捉錯誤並發出警告，而非讓 UI 破圖。

- **Type 定義抽離**:
  - 目前 Store 內的 Type (如 `HookPayload`, `EthernetWanInfo`) 與業務邏輯混在一起。
  - **建議**: 將所有的型別定義移至 `types/device.types.ts` 或 API 專屬的 `types` 目錄下，確保跨 Store 或跨元件存取時，能維持單一來源 (Single Source of Truth)。

## 4. 狀態管理 (Pinia) 的效能優化

- **細化 Cache 失效策略**:
  - 目前 `device.store.ts` 中的 `fetchPromise` 雖然避免了同時多次請求，但除了呼叫 `reset` 或傳入 `force: true` 外，緩存永久存在。
  - **建議**: 若某些路由器狀態是頻繁變動的 (例如連接的客戶端數量、即時流量)，應實作具備 TTL (Time-To-Live) 的 Cache 機制，或提供專屬的 polling (輪詢) API 設計。

- **響應式效能**:
  - 對於大型物件 (如 `ethernetWANList`)，使用 `reactive` 配合 `Object.keys().forEach` 刪除再寫入，雖能維持響應式，但在龐大資料下可能引發效能問題。
  - **建議**: 對於大量不需要深層響應的唯讀設定資料，考慮使用 `shallowRef`，只在整個物件替換時觸發畫面更新，降低 Vue 的內部 Proxy 負擔。