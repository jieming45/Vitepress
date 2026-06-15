# 任務：實作 JWT 驗證與 Redis 黑名單 Middleware

## 1. 任務核心目標與背景 (Core Objective & Context)

- **目標：** 在 `src/middlewares/authMiddleware.ts` 中實作一個 Express Middleware，用於驗證 HTTP 請求的 JWT token。
- **背景：** 系統已經採用 JWT 作為無狀態登入。為了應對使用者登出，我們引入了 Redis 來存放已失效的 Token（黑名單機制）。Middleware 必須先驗證 JWT 的有效性，接著檢查該 Token 是否存在於 Redis 黑名單中。

## 2. 操作環境與可用工具 (Environment & Tools)

- **技術棧：** Node.js, Express, TypeScript, `jsonwebtoken`, `redis`, `jest`。
- **可用指令：**
  - 型別檢查：`npx tsc --noEmit`
  - 執行單元測試：`npx jest tests/middlewares/authMiddleware.spec.ts`
  - 查閱 Redis 連線設定檔：讀取 `src/config/redisClient.ts`

## 3. 自主執行步驟與自我修正引導 (Autonomous Workflow)

請依序執行以下步驟。**注意：如果你在任何步驟遇到報錯（例如型別錯誤、找不到模組、或是測試 Fail），請你啟動自我修正機制：讀取 Error Log ➔ 分析失敗原因 ➔ 修改程式碼 ➔ 再次執行驗證，直到完全通過為止。**

- **步驟一（環境理解）：** 讀取 `src/config/redisClient.ts` 了解 Redis client 的呼叫方式，並確認 `package.json` 是否已安裝 `@types/jsonwebtoken` 與 `@types/express`。若無，請自行安裝。
- **步驟二（實作程式碼）：** 撰寫 `authMiddleware.ts`。需處理 Request Headers 中的 `Authorization: Bearer <token>` 格式。
- **步驟三（實作測試）：** 撰寫 Jest 單元測試檔案 `authMiddleware.spec.ts`。請務必 Mock Redis 與 JWT 的行為，不要連線到真實的 Redis DB。
- **步驟四（自動驗證）：** 在終端機執行型別檢查與 Jest 測試。

## 4. 自動化觀測與驗證機制 (Observation & Verification)

你必須透過以下兩個指令來確認你的行動結果：

1. 執行 `npx tsc --noEmit`。若終端機輸出錯誤，請修正型別定義。
2. 執行 `npx jest tests/middlewares/authMiddleware.spec.ts`。若有任何一個 Test Case 亮紅燈，請讀取 Jest 輸出的錯誤堆疊（Stack Trace）並修正 Middleware 或測試檔。

## 5. 完成定義 (Definition of Done, DoD)

當滿足以下所有條件時，請回報任務完成：

- [ ] `npx tsc --noEmit` 無任何報錯。
- [ ] 單元測試指令執行結果為 100% Pass。
- [ ] 測試案例必須涵蓋以下 4 種情境：1. 未提供 Token 時，回傳 `401 Unauthorized`。2. Token 格式錯誤或已過期時，回傳 `401 Unauthorized`。3. Token 有效，但存在於 Redis 黑名單時，回傳 `403 Forbidden`。4. Token 有效且不在黑名單時，呼叫 `next()` 且將解析後的 user payload 塞入 `req.user`。
