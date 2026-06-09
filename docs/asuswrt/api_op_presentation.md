# 簡報：ASUSWRT 現代化 API 結構與流程分析

## 投影片 1：專案重構背景與目標
- **背景**: 將舊版網通設備的 Web UI (原生 JS / jQuery) 遷移至現代化架構。
- **目標**: 確保 API 通訊、資料流動與邏輯處理的一致性，同時引入前端工程化的最佳實踐。
- **技術棧轉變**:
  - 舊版 (`www`): jQuery, 原生 XMLDOM, Global Variables。
  - 新版 (`vue3-wrt-project`): Vue 3 (Composition API), Quasar, Vite, TypeScript, Pinia, Axios。

## 投影片 2：Legacy API 架構痛點
- **高度耦合**: 資料抓取 (`$.ajax`) 與畫面渲染 (DOM 操作) 混雜在同一支 JS 檔案中。
- **全域變數污染**: 透過 `_useAjax` 或隱藏的 `<input>` 傳遞資料，難以追蹤狀態變化。
- **缺乏防護**: 無型別檢查，且遇到後端回傳異常時容易發生 Uncaught Exception。
- **性能問題**: 相同狀態可能被多次要求，缺少請求層級的 Cache 防抖機制。

## 投影片 3：新版 Vue 3 API 核心架構
- **封裝的 HTTP 客戶端**: 使用 Axios 實例 (`http.ts`)，透過 Interceptors 統一攔截驗證 (Auth) 與錯誤響應 (Response)。
- **模組化 API 服務**: 
  - `nvram.api.ts`: 負責 `nvram_get`。
  - `hook.api.ts`: 負責系統狀態的 hooks 獲取。
- **單一資料流 (Pinia)**: 資料邏輯層完全從 Vue 視圖抽離，組件只負責呈現。

## 投影片 4：資料取得與解析邏輯對比
- **舊版**:
  - 呼叫 `/ajax_status.xml` -> 手動解析 XML 節點 -> `document.getElementById` 寫入。
- **新版**:
  - 呼叫 `fetchNvram` -> Axios 自動轉為 JSON -> Store (如 `device.store.ts`) 清洗資料 (如正則表達式轉換 `rc_support`) -> 賦值給 `reactive` 變數 -> Vue 元件自動重繪。

## 投影片 5：新版亮點與防錯機制
- **請求共享 (Promise Cache)**: 解決元件同時掛載造成的 API 重複呼叫問題。
- **型別安全 (TypeScript)**: 所有回傳的 `Payload` 與設定物件皆有 Type 定義，杜絕拼寫錯誤與邏輯漏洞。
- **邏輯解耦**: Component 依循 `Imports -> Props -> Store -> Computed -> Methods -> Lifecycle` 的 Clean Code 結構，不再處理髒資料。

## 投影片 6：最佳調整與未來建議
1. **Zod 驗證防護**: 針對後端回傳值加入 Runtime Type 驗證，防止格式改變引發 UI 崩潰。
2. **批次 Request 優化**: 若 CGI 支援，將多個單獨的 `hook` 合併為一筆 Request。
3. **Endpoint 集中管理**: 抽離 `appGet.cgi` 等字串為統一個 Config 檔。
4. **效能優化 (shallowRef)**: 針對唯讀且龐大的 NVRAM 結構改用 `shallowRef`，降低 Proxy 效能消耗。

## 投影片 7：結論
此次重構不僅 100% 保留了原本與後端 CGI 的通訊協定與業務邏輯，更透過 Pinia、Axios 與 TypeScript 的強大生態，徹底解決了原本程式碼雜亂、維護成本高的問題，替未來的跨平台與功能擴充打下了堅固的基礎。