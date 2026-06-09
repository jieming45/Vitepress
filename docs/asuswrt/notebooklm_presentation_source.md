# ASUSWRT 現代化 API 結構與流程分析 (NotebookLM 來源素材)

> **使用說明**：請將以下全部文字複製並貼上 / 上傳至 Google NotebookLM 作為「來源 (Source)」，然後在 NotebookLM 的對話框中要求它為您生成簡報講稿、FAQ 或 Podcast 摘要。

---

## 1. 專案重構背景與核心目標
- **背景**: 團隊正在進行舊版網通設備的 Web UI (原生 JavaScript / jQuery) 到現代化前端架構的遷移作業。
- **目標**: 針對從 Legacy 移植過來的 API 進行全面的結構分析，確保其功能與原始版本完全一致，並且符合現代化的開發標準，解決過去程式碼雜亂、維護成本高的問題。
- **技術棧轉變**:
  - **Legacy 舊版 (`www` 專案)**: 原生 JavaScript, jQuery (`$.ajax`), XMLDOM 解析, 依賴 Global Variables 與 DOM 操作。
  - **Modern 新版 (`vue3-wrt-project` 專案)**: Vue 3 (Composition API), Quasar (v2+), Vite, TypeScript, Pinia (狀態管理), Axios (API 請求)。

## 2. Legacy API 架構的痛點與問題
- **高度耦合**: 資料抓取 (`$.ajax`) 與畫面渲染 (DOM 操作) 混雜在同一支 JS 檔案中，形成義大利麵條式的程式碼 (Spaghetti Code)。
- **全域變數污染**: 過度依賴如 `_useAjax` 的全域變數，或將資料隱藏在 HTML `<input type="hidden">` 中傳遞，難以追蹤狀態變化。
- **缺乏防護與型別**: 無 TypeScript 型別檢查，遇到後端回傳異常 (如空值或 XML 結構改變) 時容易發生 Uncaught Exception，導致 UI 破圖。
- **性能瓶頸**: 相同狀態可能被多個 UI 元件同時要求，舊版缺少請求層級的 Cache 防抖機制，造成頻寬與伺服器資源浪費。

## 3. 現代化 Vue 3 API 核心架構解析
新版架構嚴格遵守「組件封裝」與「代碼重用性」原則，並採用數據驅動 (Data-Driven) 模式。
- **封裝的 HTTP 客戶端**: 建立統一的 Axios 實例 (`http.ts`)，透過攔截器 (Interceptors) 統一處理身分驗證 (Auth)、表單轉換 (Form) 與錯誤響應 (Response)。
- **模組化的 API 服務**: 
  - `nvram.api.ts`: 負責處理 `nvram_get`，將陣列參數自動轉換為 CGI 需要的 Hook 字串。
  - `hook.api.ts`: 負責單一或特定的系統狀態 Hook 獲取。
- **單一資料流 (Pinia)**: 以 `device.store.ts` 為例，資料邏輯層完全從 Vue 視圖抽離。API 取回的資料會在 Store 中進行清洗與正則表達式轉換，再賦值給 `ref` 或 `reactive` 變數。Vue 元件僅透過綁定這些變數來更新畫面。

## 4. 資料取得與解析邏輯對比 (以系統支援度為例)
- **舊版執行方式**: 
  呼叫 `/ajax_status.xml` 取得 XML -> 手動使用 XMLDOM 解析節點 -> 寫大量的 `if-else` 判斷字串 -> 使用 `document.getElementById` 操作 DOM 顯示或隱藏功能區塊。
- **新版執行方式**: 
  呼叫 `fetchNvram` -> Axios 自動處理並回傳 JSON -> Pinia Store 將字串 (如 `rc_support`) 清洗解析，分離出 `usbX` 的數量與其他功能的布林值 -> 儲存至強型別的 `deviceSupport` 物件 -> Vue 元件自動根據數據重繪 (Reactive)。

## 5. 新版亮點機制
- **請求共享與快取 (Promise Cache)**: 在 Pinia 中實作了 `fetchPromise` 鎖與 `hookCache`。當多個元件同時掛載並要求相同資料時，只會發送一次 HTTP 請求，大幅減少 Router CPU 負擔。
- **型別安全 (TypeScript)**: 所有回傳的 `Payload` 與設定物件皆有明確的 Type 或 Interface 定義 (如 `EthernetWanInfo`)，杜絕拼寫錯誤與邏輯漏洞，確保編譯階段就能抓出錯誤。
- **邏輯解耦的乾淨代碼 (Clean Code)**: Component 內部嚴格遵循 `Imports -> Props -> Store -> Computed -> Methods -> Lifecycle` 的結構，元件本身不再處理髒資料。

## 6. 最佳調整與未來優化建議
- **Zod 執行期驗證**: 目前 TypeScript 僅提供編譯期保護。建議引入 Zod 等工具，針對後端回傳值加入 Runtime Schema 驗證，防止後端 API 格式突變引發 UI 崩潰。
- **批次 Request 優化**: 若後端 `appGet.cgi` 支援，建議將多個獨立的 Hook 請求合併為一筆 Request 送出，減少網路 Handshake 次數以提升載入速度。
- **Endpoint 集中管理**: 應將分散在各 API 模組中的 `appGet.cgi` 與 `applyapp.cgi` 等字串抽離為統一的 Config 表或 `endpoints.ts`，以利未來版本演進。
- **響應式效能優化**: 針對巨大且不需深層綁定的 NVRAM 資料表，建議在 Vue/Pinia 中改用 `shallowRef` 取代 `reactive`，以降低 Vue Proxy 代理帶來的效能消耗。

## 7. 總結
此次架構重構不僅 100% 保留了原本與後端 CGI (`appGet.cgi`, `applyapp.cgi`) 的通訊協定，更藉由導入 Vue 3、Pinia、Axios 與 TypeScript 的強大生態，徹底解決了以往高耦合與低效能的問題，為未來的跨平台與功能擴充打下了堅固的基礎。