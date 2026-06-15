# 任務：修正 yt-dlp 動態解析與實作下載路徑管理

## 1. 任務核心目標與背景 (Core Objective & Context)

- **目標：** 1. 移除目前專案中硬編碼（Mock/固定）的 URL 解析與畫質清單邏輯，改為真正呼叫 `yt-dlp` 進行**動態即時解析**。

2. 在 UI 上新增「下載儲存路徑」顯示區塊，並實作一個資料夾按鈕，點擊後能自動開啟作業系統的檔案總管（或 Finder）並定位至該儲存路徑。

- **儲存路徑規範：** - 預設路徑設定為系統的「下載 (Downloads)」資料夾（Electron 端可使用 `app.getPath('downloads')`）。

---

## 2. 操作環境與可用工具 (Environment & Tools)

- **專案根目錄：** `C:\Users\Jieming\Documents\GitHub\video-dl-project`
- **技術棧：** Vue 3 (Composition API), TypeScript, Electron (Main/Renderer IPC), Capacitor.
- **關鍵 API：**
- Electron 檔案總管開啟：`shell.openPath(path)`
- Electron 預設路徑獲取：`app.getPath('downloads')`
- `yt-dlp` 動態解析指令：`yt-dlp -J <USER_INPUT_URL>`

---

## 3. 自主執行步驟 (Autonomous Workflow - LOOP)

### 步驟一：修正 `yt-dlp` 動態解析邏輯 (Fix Static Parsing)

1. **檢查並清理舊程式碼**：

- 尋找 `src/services/DownloaderService.ts` 或 Electron 主進程中負責解析 URL 的 IPC 監聽器。
- 移除目前寫死的固定影片標題、固定縮圖網址及固定的畫質選項（4K/1080p 等固定陣列）。

2. **實作真正的動態 IPC 呼叫**：

- 修改 Electron 主進程，當接收到前端傳來的 `parse-url` 事件與實際 URL 時，使用 `child_process.spawn` 執行 `yt-dlp -J <URL>`。
- 串流讀取 `stdout` 的 JSON 資料，解析出該 URL 專屬的 `title`、`thumbnail`（或 `thumbnails` 陣列中畫質最佳的 URL）以及 `formats`。

3. **動態格式過濾與預設值**：

- 前端接收到實際的 `formats` 後，必須動態過濾出可輸出為 `mp4` 的選項。
- 檢查解析度清單，若包含 4K、2K、60fps、HDR 等規格，需動態加上標籤。
- **防呆預設值：** 檢查清單中是否存在 `1080p`。若有，預設選中 `1080p`；若該影片最高僅支援 `720p`，則動態將預設值切換為 `720p`，不允許出現寫死找不到選項的情況。

### 步驟二：實作下載路徑顯示與檔案總管連動 (Download Path & File Explorer)

1. **調整 UI 介面**：

- 在網址輸入框或下載按鈕附近，新增一個文字區塊顯示「目前儲存路徑：`[路徑字串]`」。
- 在路徑旁加上一個資料夾圖示的按鈕（例如使用圖示字型或 SVG）。

2. **實作路徑獲取與顯示邏輯**：

- **Electron 環境：** 主進程在啟動時，透過 `app.getPath('downloads')` 獲取系統下載路徑，並透過 IPC 傳送給前端 UI 進行響應式綁定顯示。
- **Capacitor 環境：** 行動端預設顯示內部儲存空間相對路徑（如 `Documents/Downloads`），並做為環境相容處理。

3. **實作點擊開啟檔案總管**：

- 為資料夾按鈕綁定點擊事件。
- **Electron 端：** 點擊後發送 IPC 請求至主進程，主進程呼叫 `electron.shell.openPath(actualPath)`，確保能直接喚起 Windows 檔案總管或 macOS Finder。
- **Capacitor 端：** 若在行動端環境，點擊時跳出 Toast 提示「已複製儲存路徑」，優雅降級處理。

---

## 4. 測試矩陣與邊界情境 (Testing Matrix)

- **情境 A：動態輸入多個不同平台 URL**：
- 分別輸入一個 YouTube 影片網址與一個 Bilibili 影片網址。
- 斷言：UI 顯示的縮圖與標題必須隨網址不同而即時更新，不允許再出現前一次或固定的影片內容。

- **情境 B：不支援 1080p 的低畫質影片測試**：
- 輸入一個最高僅有 480p 或 720p 的舊影片網址。
- 斷言：畫質選單不會崩潰，且會動態將預設選取值設為該影片的最高畫質（例如 720p），而非強制尋找 1080p。

- **情境 C：開啟檔案總管功能測試**：
- 在 Windows/macOS 桌面端環境點擊資料夾按鈕。
- 斷言：系統檔案總管必須成功彈出，且開啟的目錄路徑與 UI 上顯示的路徑字串完全一致。

---

## 5. 完成定義 (Definition of Done, DoD)

- [ ] **動態解析修正**：徹底移除固定網址與畫質的 Mock 資料，改為由 `yt-dlp -J` 根據使用者輸入的 URL 即時獲取標題、縮圖與畫質清單。
- [ ] **畫質清單動態化**：過濾機制能自動適應不同的影片格式來源，並正確標示 4K/60fps/HDR，且具備動態預設選取（優先 1080p，無則自動向下相容）的防呆機制。
- [ ] **路徑 UI 與按鈕實作**：畫面上清晰可見當前下載路徑，且資料夾按鈕版面配置比例如期呈現。
- [ ] **檔案總管連動成功**：桌面端點擊資料夾按鈕能準確透過 Electron `shell.openPath` 開啟對應目錄，行動端則有對應的相容提示。
