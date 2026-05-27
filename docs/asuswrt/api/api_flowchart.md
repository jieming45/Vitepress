# API 運作流程圖

本文件以流程圖描述前端 API 呼叫、回應解包、錯誤處理、登入、NVRAM/Hook 與檔案上傳流程。

## 1. 一般 API 呼叫流程

```mermaid
flowchart TD
    A[View 或 Component] --> B[Store 或 Composable]
    B --> C[API function]
    C --> D[共用 http instance]
    D --> E[Auth interceptor]
    E --> F[Form interceptor]
    F --> G[送出 HTTP request]
    G --> H[後端或 Router CGI]
    H --> I[Response interceptor]
    I --> J{回應是否有 code 欄位}
    J -->|是| K{code 是否為 0}
    K -->|是| L[回傳 data 給呼叫端]
    K -->|否| M[Reject Error message]
    J -->|否| N[回傳 response.data]
    L --> O[Store 更新狀態]
    N --> O
    M --> P[Store 或 Component 處理錯誤]
```

## 2. Request 前處理流程

```mermaid
flowchart TD
    A[API function 呼叫 http] --> B{是否需要認證 cookie}
    B -->|是| C[withCredentials 自動攜帶 cookie]
    B -->|否| D[維持一般請求]
    C --> E{Content-Type 是否為 x-www-form-urlencoded}
    D --> E
    E -->|是 且 method 為 POST 且 data 是 object| F[轉成 URLSearchParams string]
    E -->|否| G[保留原 data]
    F --> H[送出 request]
    G --> H
```

## 3. Response 與錯誤處理流程

```mermaid
flowchart TD
    A[收到 response] --> B{HTTP 是否成功}
    B -->|否| C[記錄 HTTP ERROR]
    C --> D[Reject 原始錯誤]
    B -->|是| E{response.data.code 是否存在}
    E -->|否| F[回傳 response.data]
    E -->|是| G{code 是否為 0}
    G -->|是| H[回傳 response.data.data]
    G -->|否| I[Reject Error message]
    D --> J[呼叫端 catch]
    I --> J
    F --> K[呼叫端取得資料]
    H --> K
```

## 4. v2 登入流程

```mermaid
flowchart TD
    A[使用者輸入帳號密碼] --> B[preLogin]
    B --> C[產生 id]
    C --> D[POST get_Nonce.cgi]
    D --> E[取得 nonce]
    E --> F[產生 cnonce]
    F --> G[sha256 username nonce password cnonce]
    G --> H[Base64 captcha]
    H --> I[安全過濾 nextPage]
    I --> J[POST login_v2.cgi]
    J --> K[取得 HTML 回應]
    K --> L{是否包含 meta refresh}
    L -->|是| M[authStore.checkAuth]
    M --> N[導向首頁]
    L -->|否| O[parseLoginPageData]
    O --> P[更新 errorStatus lockTime captcha]
    P --> Q[清空密碼並刷新 captcha]
```

## 5. 認證狀態檢查流程

```mermaid
flowchart TD
    A[authStore.checkAuth] --> B[fetchHook get_ui_support]
    B --> C{5 秒內是否取得有效物件}
    C -->|是 且包含 get_ui_support| D[isAuthenticated = true]
    C -->|否| E[isAuthenticated = false]
    D --> F[authReady = true]
    E --> F
```

## 6. Hook API 流程

```mermaid
flowchart TD
    A[呼叫 fetchHook hookName] --> B[組合 hookName()]
    B --> C[GET appGet.cgi]
    C --> D[Query hook=hookName()]
    D --> E[Router 執行 hook function]
    E --> F[回傳 hook 結果]
    F --> G[呼叫端以泛型解析資料]
```

## 7. NVRAM 讀取流程

```mermaid
flowchart TD
    A[呼叫 fetchNvram nvramList] --> B[將 key 轉成 nvram_get key]
    B --> C[以分號串接多個 hook]
    C --> D[GET appGet.cgi]
    D --> E[Router 讀取 NVRAM]
    E --> F[回傳 key-value 資料]
    F --> G[Store 或 Component 使用資料]
```

## 8. NVRAM 寫入與套用流程

```mermaid
flowchart TD
    A[Component 收集設定] --> B[Store 整理 postData]
    B --> C[呼叫 setNvram]
    C --> D[POST applyapp.cgi]
    D --> E[Router 寫入 NVRAM]
    E --> F{是否包含 action_mode 或 rc_service}
    F -->|是| G[套用設定或重啟服務]
    F -->|否| H[僅寫入資料]
    G --> I[回傳結果]
    H --> I
```

## 9. 裝置重啟流程

```mermaid
flowchart TD
    A[使用者確認重啟] --> B[呼叫 rebootDevice]
    B --> C[建立 payload]
    C --> D[Content-Type x-www-form-urlencoded]
    D --> E[POST /apply.cgi]
    E --> F[Router 執行 reboot]
    F --> G[前端顯示等待或導向]
```

## 10. 檔案上傳流程

```mermaid
flowchart TD
    A[使用者選擇檔案] --> B{檔名是否有效}
    B -->|否| C[顯示格式錯誤]
    B -->|是| D[建立 FormData]
    D --> E[append file]
    E --> F[POST upload.cgi]
    F --> G[onUploadProgress 更新進度]
    G --> H{上傳是否成功}
    H -->|是| I[關閉進度或進入下一步]
    H -->|否| J[顯示或記錄錯誤]
```

## 11. 開發模式 Proxy 流程

```mermaid
flowchart TD
    A[前端送出相對路徑 API] --> B{mode 是否為 development}
    B -->|是| C[Vite server proxy]
    C --> D[VITE_ROUTER_URL]
    D --> E[ASUS Router]
    B -->|否| F[依目前部署 origin 呼叫]
    F --> E
```
