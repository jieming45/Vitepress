# API 與參數邏輯執行流程圖

本文檔使用 Mermaid.js 呈現 Legacy 舊版與 Modern 新版在 API 獲取、狀態管理及參數處理上的架構與資料流向差異。

## 1. 獲取資料流程對比 (Legacy vs Modern)

### 舊版 (Legacy - jQuery & 原生 JS)

```mermaid
sequenceDiagram
    participant UI as Browser (DOM / UI)
    participant JS as Legacy JS (ajax.js, state.js)
    participant Server as Router Server (CGI / XML)

    UI->>JS: 事件觸發 (如頁面載入/點擊)
    activate JS
    JS->>Server: $.ajax / XMLHttpRequest (請求 /ajax_status.xml 或 CGI)
    activate Server
    Server-->>JS: 回傳 XML 或 text/html
    deactivate Server
    JS->>JS: 字串分割、XMLDOM 解析、邏輯運算
    JS->>UI: jQuery DOM 操作 (更新 innerHTML, 修改 CSS)
    deactivate JS
```

### 新版 (Modern - Vue 3 + Pinia + Axios)

```mermaid
sequenceDiagram
    participant View as Vue 3 Component (UI)
    participant Store as Pinia (device.store.ts)
    participant API as Axios / API Module (nvram.api.ts)
    participant Server as Router Server (appGet.cgi)

    View->>Store: 呼叫 fetchDeviceInfo()
    activate Store
    Store->>Store: 檢查快取 (fetchPromise)
    alt 有快取
        Store-->>View: 回傳已快取的狀態 (無網路請求)
    else 無快取
        Store->>API: 呼叫 fetchNvram([KEYS])
        activate API
        API->>Server: GET /appGet.cgi?hook=nvram_get(...)
        activate Server
        Server-->>API: 回傳 JSON (200 OK)
        deactivate Server
        API->>API: Axios Response Interceptor (格式轉換/錯誤攔截)
        API-->>Store: 回傳強型別資料 (Promise)
        deactivate API
        Store->>Store: 資料清理與解析 (例如解析 rc_support, 存入 ref/reactive)
        Store-->>View: 狀態變更觸發 UI 自動重新渲染
    end
    deactivate Store
```

---

## 2. 參數設定與更新流程 (State & Params Flow)

本流程圖著重說明參數如何從後端取得，經過解析，最終在前端表單設定後寫回後端。

```mermaid
flowchart TD
    subgraph Frontend - Vue 3 Architecture
        direction TB
        A(Vue Component) -->|1. Request Action| B(Pinia Action: fetchDeviceInfo)
        B -->|2. Check Cache / Fire Req| C(Axios API: fetchNvram / fetchHook)
        C -->|4. Parse JSON| D(Pinia State: ref / reactive)
        D -->|5. Data Binding| A
        A -->|6. User modifies input| A
        A -->|7. Save Action| E(Axios API: setNvram)
    end

    subgraph Backend - Router
        direction TB
        F(appGet.cgi)
        G(applyapp.cgi)
    end

    C -->|3. GET Request| F
    F -->|Return NVRAM Data| C
    E -->|8. POST setData JSON| G
    G -->|Return Success/Fail| E
```

### 說明：
1. **舊版參數流向**: 資料讀取 -> `document.getElementById('input').value = data` -> 使用者修改 -> 觸發 `form.submit()`。
2. **新版參數流向**:
   - 資料統一由 Pinia 發送至 Axios (`fetchNvram`)。
   - 回傳後在 Store 內整理成 Reactive 狀態（如 `deviceSupport` 物件）。
   - Vue Component 透過響應式綁定 (`v-model`) 讀寫 Store。
   - 儲存時，呼叫 `setNvram` API，將整理好的 Payload 以 JSON 形式 POST 到 `applyapp.cgi`，不產生整頁刷新 (SPA 體驗)。