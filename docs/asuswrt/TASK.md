# Task: Legacy Quick Internet Setup Wizard 搬移至Vue3新專案

## 1. 關聯參考 (Context Reference)

- **遵循規範**: 嚴格執行 `CLAUDE.md` 中定義的 [技術棧名稱 / 程式碼風格 / 測試規範]...等。

- **參考資料**:
  - 參考 `QIS_flow.md`中定義的流程
  - 參考 `qisPostNVram.js`中定義的nvram參數
  - 參考 `asus_pp.md`中的流程與定義參數
  - 參考 `asus_eula.md`中的流程與定義參數
  - UI 元件參考 `C:\Users\Jieming\Documents\GitHub\www\sysdep\FUNCTION\QIS_V3\QIS_wizard.htm`

- **當前檔案**: `C:\Users\Jieming\Documents\GitHub\vue3-wrt-project\packages\shared\src`

## 2. 任務目標 (Objectives)

- 將`QIS_flow.md`的流程與`qisPostNVram.js`中每個流程stage 會設定的nvram參數，正確搬移到vue3專案中
  - 在Router Mode，根據QIS flow中，每一個步驟都完整詳細設定
  - 在Access Point Mode，根據QIS flow中，每一個步驟都完整詳細設定
  - 在Media Bridge Mode，根據QIS flow中，每一個步驟都完整詳細設定
  - 在Repeater Mode，根據QIS flow中，每一個步驟都完整詳細設定
  - 在WISP Mode，根據QIS flow中，每一個步驟都完整詳細設定
  - 在AiMesh Node Mode，根據QIS flow中，每一個步驟都完整詳細設定

## 3. 技術具體要求 (Specific Requirements)

- 使用 TypeScript 定義 interface。
- 使用 `Vitest` 撰寫至少兩個單元測試案例（成功與失敗）。
- 確保符合 Vite 的環境變數讀取方式。

## 4. 預期輸出 (Expected Output)

- 型別定義檔 (types/qis.ts):
  - 定義 QisMode (Router, AP, etc.) 的 Enums。
  - 定義各 Stage 對應的 NVRAM 參數 Interface，確保與 qisPostNVram.js 邏輯一致。

- 狀態管理 (stores/qisStore.ts):
  - 使用 Pinia 管理跨步驟的暫存資料。
  - 實作 saveToNVRAM() 統一介面，封裝與後端 API 或與現有系統掛鉤的邏輯。

- 封裝邏輯 (composables/useQisFlow.ts): -實作狀態機邏輯，根據當前 sw_mode 切換對應的步驟清單 (Step List)。

- 自動化測試與品質保證 (Testing & Quality)
  - Vitest 測試報告:
    - qisLogic.spec.ts: 針對不同模式的步驟切換邏輯進行單元測試（例如：進入 Router Mode 時，第一步是否正確導向至 PPPoE/DHCP 判斷）。
    - nvramMapping.spec.ts: 驗證 UI 輸入值轉換為 qisPostNVram.js 格式後的資料正確性。
    - Edge Case 處理: 成功設定、設定超時 (Timeout) 與 API 報錯時的異常處理流程。

  - 文件與說明 (Documentation)
    - README / Migration Note: 簡述 legacy qisPostNVram.js 參數與新專案 TypeScript Interface 的映射表（Mapping Table），方便後續維護人員查閱。
