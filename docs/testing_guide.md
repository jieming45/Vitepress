Vue 3 專案測試指南：SPA (E2E) 與 Unit Test 工作流程
這份指南詳細說明了本專案中使用的兩種主要測試方式：單元測試 (Unit Test) 與 單頁應用程式端到端測試 (SPA E2E Test)。本指南旨在幫助開發者理解測試原理、學習如何撰寫測試，並掌握如何反覆執行與除錯。

本專案採用以下現代化前端測試工具：

Vitest: 用於執行快速的單元測試 (Unit Test) 與元件測試。
Playwright: 用於執行真實瀏覽器環境下的端到端測試 (E2E Test)，模擬真實使用者操作 SPA 的行為。
一、 Unit Test (單元測試) - 使用 Vitest

1. 測試原理
   單元測試的目的在於隔離應用程式的最小可測試單元（例如：一個函式、一個 Pinia Store、或一個 Vue 元件），並驗證其行為是否符合預期。Vitest 是一個基於 Vite 的超快速測試框架，它與專案的 Vite 配置共享設定，這意味著我們不需要為測試環境做額外的複雜設定。

2. 檔案結構與位置
   在本專案中，單元測試檔案通常與被測試的原始碼放在一起，位於 **tests** 目錄下，並以 .test.ts 或 .spec.ts 結尾。 例如：

被測檔案：src/stores/dashboard.store.ts
測試檔案：src/stores/**tests**/dashboard.store.test.ts
被測元件：src/components/TrafficMonitor/TrafficMonitor.vue
測試檔案：src/components/TrafficMonitor/**tests**/TrafficMonitor.lifecycle.test.ts 3. 如何撰寫測試 (測試方法)
Vitest 的語法與 Jest 高度相容。主要使用 describe (群組)、it 或 test (單一測試案例)、以及 expect (斷言)。

範例：測試一個簡單的 Utility 函式

typescript

import { describe, it, expect } from 'vitest'
import { isSupport } from '../isSupport'
describe('isSupport utility', () => {
it('should return true for supported features', () => {
// 準備 (Arrange) & 執行 (Act)
const result = isSupport('featureA');
// 斷言 (Assert)
expect(result).toBe(true);
})
}) 4. 執行指令與反覆重測
Vitest 提供極佳的開發體驗，特別是它的 Watch 模式，非常適合在開發階段「反覆重測」。

執行所有測試 (一次性)

bash

npm run test:unit
TIP

在 package.json 中，這通常對應到 vitest 指令。預設情況下，Vitest 在開發環境下會自動進入 Watch 模式，在 CI 環境中則是一次性執行。

反覆重測 (Watch 模式) 如果您希望在修改程式碼後自動重新執行相關測試，只需執行：

bash

npx vitest watch
(或者如果您的 npm run test:unit 預設就是 watch，則直接使用 npm run test:unit) 在 Watch 模式的終端機中，您可以按下 p 鍵輸入檔名關鍵字，只針對特定檔案進行測試，這對於反覆除錯非常有用。

開啟 UI 介面進行測試 Vitest 提供了一個精美的網頁介面來查看測試結果與覆蓋率：

bash

npx vitest --ui 5. 其他開發者如何操作
拉取最新程式碼後，確保已執行 npm install。
開發新功能或修改 Bug 時，建立對應的 **tests**/\*.test.ts 檔案。
在終端機保持 npm run test:unit (或 npx vitest watch) 運行。
儲存檔案時，觀察終端機是否亮起綠燈 (Pass)。
二、 SPA E2E Test (端到端測試) - 使用 Playwright

1. 測試原理
   不同於 Unit Test 只測試單一零件，E2E 測試會啟動一個真實的無頭瀏覽器 (Headless Browser，如 Chromium, Firefox, WebKit)，載入完整的 SPA 應用程式，並模擬真實使用者的操作（點擊、輸入文字、切換路由等），確保整個系統（前端畫面 + 路由 + API 請求/Mock）串聯起來能正常運作。

2. 檔案結構與位置
   E2E 測試獨立於原始碼之外，通常集中放置在根目錄的 e2e 資料夾中，並以 .spec.ts 結尾。 例如：

e2e/login.spec.ts (測試登入流程)
e2e/dashboard.spec.ts (測試儀表板頁面)
配置檔為根目錄的 playwright.config.ts。3. 如何撰寫測試 (測試方法)
Playwright 提供了強大的 locator 來定位 DOM 元素，並提供非同步的操作方法。

範例：測試登入流程

typescript

import { test, expect } from '@playwright/test';
test('使用者可以成功登入並導向 Dashboard', async ({ page }) => {
// 1. 進入登入頁面
await page.goto('/login');
// 2. 斷言：確認畫面上出現登入標題
await expect(page.locator('h1')).toContainText('Login');
// 3. 模擬使用者輸入與點擊
await page.getByLabel('Username').fill('admin');
await page.getByLabel('Password').fill('password123');
await page.getByRole('button', { name: 'Sign In' }).click();
// 4. 斷言：確認路由已改變，且出現 Dashboard 元素
await expect(page).toHaveURL(/.\*\/dashboard/);
await expect(page.locator('.dashboard-header')).toBeVisible();
}); 4. 執行指令與反覆重測
Playwright 提供了非常強大的除錯與反覆測試工具，特別是它的 UI 模式，是開發 E2E 測試的利器。

執行所有 E2E 測試 (無頭模式)

bash

npm run test:e2e
NOTE

這會在背景自動啟動您的 dev server (根據 playwright.config.ts 設定)，並在多個瀏覽器中執行測試。這通常用於 CI/CD 流程或部署前的最後確認。

反覆重測與除錯 (強烈推薦使用 UI 模式) 如果您正在撰寫新的 E2E 測試或除錯，強烈建議使用 Playwright 的 UI 模式：

bash

npx playwright test --ui
TIP

執行後會開啟一個應用程式視窗。您可以在左側列表點選特定的 .spec.ts 甚至單一個 test 來執行。 反覆重測步驟：

在 UI 介面中點擊測試案例旁邊的「播放」按鈕。
右側面板會顯示瀏覽器的即時畫面。
您可以利用上方的「時間軸 (Timeline)」回放每一步操作，查看 DOM 狀態、Network 請求、Console 輸出。
修改程式碼後儲存，UI 模式會自動偵測並可讓您立即重新點擊播放測試。
開啟檢測器 (Inspector) 模式 如果您不知道如何定位某個元素，可以使用 debug 模式，它可以讓您在畫面上點擊元素並自動產生 locator 程式碼：

bash

npx playwright test --debug 5. 其他開發者如何操作
首次執行前，可能需要安裝 Playwright 的瀏覽器二進位檔：npx playwright install。
確認專案已安裝依賴 (npm install)。
要驗證現有功能是否被破壞，執行 npm run test:e2e。
要開發新的 E2E 測試腳本，執行 npx playwright test --ui，一邊看著瀏覽器畫面，一邊撰寫腳本並反覆點擊執行來確認每一步邏輯。
三、 總結與最佳實踐
測試類型 使用工具 適用場景 執行速度 隔離程度
Unit Test Vitest 驗證複雜的商業邏輯、Utility 函式、Store 狀態轉換、單一元件渲染與事件發送。 極快 (毫秒級) 高 (通常 Mock 掉外部依賴)
E2E Test Playwright 驗證關鍵使用者旅程 (User Journey)，如登入、結帳、導覽等，確保多個元件與路由協同工作。 較慢 (秒級) 低 (模擬真實環境)
IMPORTANT

給團隊開發者的建議流程：

撰寫核心邏輯 (Store/Utils) 時，同步撰寫 Vitest 單元測試，利用 watch 模式確保邏輯正確。
開發 UI 元件時，可利用 Vitest + Vue Test Utils 進行基礎渲染與事件測試。
當完成一個完整的頁面或功能模組 (如：完整的路由跳轉與資料呈現) 後，撰寫 Playwright E2E 測試 來保護這個使用者流程不被後續開發破壞。
提交 PR 之前，確保 npm run verify:all (包含 lint, type-check, build) 與測試都能通過。
