# QIS 設定流程

## Welcome

在 QIS 快速設定精靈（Quick Internet Setup）的 `welcome` 頁面中，按下 `apply.welcome()` 後的跳轉流程與 NVRAM 設定如下：

### 一、 `apply.welcome()` 執行流程與判斷條件

當使用者點擊「下一步」或「開始設定」按鈕時，系統會依序檢查以下條件來決定下一個頁面：

1. **使用者條款檢查 (ToS Check)**：
    - 如果畫面顯示了服務條款勾選框（`#tosCheckbox`），且系統處於出廠狀態（`systemVariable.isDefault`），且未勾選該框，則會強制滾動到頁面底部並閃爍提示，流程中斷。

2. **內部變數初始化**：
    - 設定 `systemVariable.manualWanSetup = false`（關閉手動 WAN 設定標記）。
    - 設定 `systemVariable.advSetting = false`（關閉進階設定標記）。

3. **頁面跳轉邏輯 (依優先順序)**：
    - **支援 `amas_bdl` 功能**：跳轉至 `goTo.prelink_desc()`。
    - **強制更改密碼 (forceChangePw)**：如果系統要求初始化必須更改密碼，會先跳轉至 `goTo.Login()`。
    - **根據目前運作模式 (isOriginSwMode) 跳轉**：
        - **中繼模式 (RP)**：跳轉至 `goTo.rpMode()`。
        - **無線存取點模式 (AP)**：
            - 若支援 `apMode_detwan`（自動偵測 WAN），跳轉至 `goTo.autoWan_AP()`。
            - 否則跳轉至 `goTo.apMode()`。
        - **媒體橋接模式 (MB)**：跳轉至 `goTo.mbMode()`。
        - **Mesh 模式 (Mesh)**：跳轉至 `goTo.meshMode()`。
        - **WISP 模式 (WISP)**：跳轉至 `goTo.wispMode()`。
        - **預設路由器模式 (Router)**：
            - 若支援 `dsl`，跳轉至 `goTo.autoDSLWan()`。
            - 否則跳轉至 `goTo.autoWan()`（自動偵測網路連線類型）。

---

### 二、 NVRAM 設定與相關變數

在 `welcome` 頁面階段，主要是處理**前端狀態控制**，因此**不會直接寫入 NVRAM** 到路由器硬體中。主要的設定行為發生在後續頁面（如 `Login` 或 `autoWan` 之後）。

不過，此函式會操作以下關鍵的 **Javascript 系統變數**，這些變數會影響後續與 NVRAM 溝通的邏輯：

| 變數名稱                        | 說明                                                                                                |
| :------------------------------ | :-------------------------------------------------------------------------------------------------- |
| `systemVariable.manualWanSetup` | 設定為 `false`。若後續進入手動模式，此值會變更並影響 `qisPostData` 的組合。                         |
| `systemVariable.advSetting`     | 設定為 `false`。決定最後是進入簡易設定還是進階設定頁面。                                            |
| `qisPostData`                   | 這是 QIS 用來暫存所有要寫入 NVRAM 資料的物件。雖然在 `welcome` 階段未寫入，但會清除先前的暫存資料。 |

### 三、 重整建議 (Vue 3 結構)

若您正使用 Vue 3 重新架構，可以將上述邏輯抽離為一個 `setupService`：

- **State**: 使用 `reactive` 管理 `systemVariable` 與 `qisPostData`。
- **Action**: `handleWelcomeSubmit` 應先進行 `Tos` 驗證，再根據 `isOriginSwMode` (從 API 取得的目前的系統模式) 進行路由跳轉（`router.push`）。
- **API**: 將 `isSupport("xxx")` 轉換為 Vue 的 `computed` 屬性，根據後端傳回的 `capability` 進行判斷。

### 四、 autoWAN()執行後

在執行 `goTo.autoWan()` 後，系統會進入 **WAN 自動偵測階段**。這是一個非同步的偵測過程，目的是判斷使用者的網路環境（PPPoE, DHCP, 或 Static IP）。

以下是根據 `handler.js` 與 `QIS_wizard.htm` 邏輯整理出的詳細流程：

### 1. 偵測啟動與 UI 切換

當 `goTo.autoWan()` 被觸發時：

- **頁面切換**：畫面會轉向偵測中頁面（通常顯示「正在偵測網際網路連線類型」）。
- **發送偵測指令**：前端會透過 `httpApi.detwan()` 或相關的 AJAX POST 指令要求後端進行網路偵測。

### 2. 分支判斷：根據偵測結果 (detwanResult)

偵測結束後，系統會根據後端回傳的連線類型進行跳轉：

#### **A. 偵測到 PPPoE**

- **判斷原因**：ISP 需要帳號密碼。
- **下一頁**：跳轉至 `goTo.pppoe()`。
- **NVRAM 相關設定**：此時會將 `wan_proto` 設定為 `pppoe`。

#### **B. 偵測到 DHCP (Automatic IP)**

- **判斷原因**：直接插上網線即可連通，不需額外資訊。
- **下一頁**：跳轉至 `goTo.Wireless()` (通常會直接進入無線網路 SSID 設定)。
- **NVRAM 相關設定**：將 `wan_proto` 設定為 `dhcp`。
- **特殊情況**：如果支援 `gobi` (行動寬頻) 或有插 `modem`，會先跳轉到 4G/5G 相關設定頁面。

#### **C. 偵測到 Static IP**

- **判斷原因**：無法自動取得 IP，且排除 PPPoE。
- **下一頁**：跳轉至 `goTo.staticIp()`。
- **NVRAM 相關設定**：將 `wan_proto` 設定為 `static`，並準備接收 `wan_ipaddr_x`, `wan_netmask_x`, `wan_gateway_x` 等欄位。

#### **D. 偵測不到網線 (No Cable)**

- **判斷原因**：WAN port 未偵測到實體訊號。
- **下一頁**：跳轉至 `goTo.dead_end()` 或 `autowan_hint` (提示使用者檢查網線)。

---

### 3. 特殊功能干預流程 (Special Cases)

在執行 `autoWan` 的過程中，還有幾個高優先權的判斷：

1. **Dual WAN / Multi-WAN**：
    - 如果機器支援多個 WAN 口，會先進入 `goTo.multiwan_detect()`。
2. **IPTV 偵測**：
    - 若偵測到特定的 VLAN 標籤（如某些地區的 ISP 服務），流程可能會中斷並引導至 `goTo.iptv_setting()`。
3. **USB Modem 優先**：
    - 如果 `hadPlugged("modem")` 為真，且 WAN 沒訊號，會跳轉到 `goTo.Modem()` 設定頁面。

### 4. 設定到哪些 NVRAM 變數

在 `autoWan` 確定類型並準備進入下一步時，前端會更新 `qisPostData` 物件，最終寫入：

- **`wan_proto`**: 連線協議類型 (`dhcp`, `pppoe`, `static`, `l2tp`, `pptp`)。
- **`wan_unit`**: 目前正在設定的 WAN 索引（通常為 0）。
- **`x_Setting` / `qis_Setting`**: 設定為 `1`，標記系統正在進行設定。
- **`wan_nat_x`**: 通常預設為 `1` (啟用 NAT)。

### Vue 重整建議

在 Vue 3 中，這部分建議實作為一個 **State Machine**：

1. **State**: `detecting` -> `result_found` -> `error`。
2. **Hook**: 使用 `onMounted` 呼叫偵測 API。
3. **Router**: 根據 API 回傳的 `result.type` 執行 `router.push({ name: result.type })`。
4.

在 QIS 流程中，`goTo.Wireless()` 通常是**進入連線設定的最後一站**。當系統確定了網際網路連線類型（如 DHCP 已取得 IP，或 PPPoE 已輸入帳號密碼）後，就會跳轉到這個頁面來設定 Wi-Fi 的 SSID 與密碼。

### 五、 goTo.Wireless()執行後

以下是 `goTo.Wireless()` 執行後的詳細流程與涉及的 NVRAM 設定：

### 1. 頁面顯示邏輯

進入 `wireless` 頁面後，Vue 組件（或舊有的 HTML）會根據路由器的硬體規格顯示不同的欄位：

- **單頻/雙頻/三頻**：根據 `isSupport("5G")` 或 `isSupport("6G")` 顯示 2.4GHz、5GHz、6GHz 的 SSID 與授權方式（Authentication Method）輸入框。
- **Smart Connect**：如果支援並啟動 Smart Connect，則多個頻段會合併成一個 SSID 設定欄位。

### 2. 按下「套用 (Apply)」後的判斷流程

在無線設定頁面點擊「下一步」或「套用」時，會觸發 `apply.Wireless()`，流程如下：

1. **資料驗證 (Validation)**：檢查 SSID 是否為空、密碼長度是否符合規範（WPA2 至少 8 字元）。
2. **安全性自動修正**：如果使用者設定了密碼但未選擇加密方式，系統會自動將 `auth_mode` 設為 `WPA2-PSK` 或 `WPA3-SAE`（視硬體支援而定）。
3. **寫入資料暫存 (`qisPostData`)**：將設定值填入 `qisPostData` 物件中。
4. **最終確認跳轉**：
    - **Case A (新機初始設定)**：如果這是第一次設定，通常會跳轉至 `goTo.Login()` 要求設定路由器的管理帳號密碼（如果前面沒設定過）。
    - **Case B (一般流程結束)**：跳轉至 `goTo.finish()`，顯示設定總結頁面（Summary Page）。

---

### 3. 設定到哪些 NVRAM 變數

這是 QIS 流程中最關鍵的一步，系統會準備大量的無線相關參數。常見的 NVRAM 鍵值如下：

| NVRAM 變數名稱     | 說明                               | 範例值            |
| :----------------- | :--------------------------------- | :---------------- |
| `0:wl_ssid`        | 2.4GHz 的無線名稱                  | `ASUS_Router`     |
| `0:wl_wpa_psk`     | 2.4GHz 的無線密碼                  | `12345678`        |
| `0:wl_auth_mode_x` | 2.4GHz 授權模式                    | `psk2` (WPA2-PSK) |
| `0:wl_crypto`      | 2.4GHz 加密類型                    | `aes`             |
| `1:wl_ssid`        | 5GHz 的無線名稱                    | `ASUS_Router_5G`  |
| `1:wl_wpa_psk`     | 5GHz 的無線密碼                    | `12345678`        |
| `w_Setting`        | **關鍵變數**，標記無線已設定過     | `1`               |
| `x_Setting`        | **關鍵變數**，標記系統整體已設定過 | `1`               |
| `qis_Setting`      | **關鍵變數**，標記 QIS 已完成      | `1`               |

---

### 4. 流程結束：`apply.done()` 與系統重啟

當所有頁面流程（Welcome -> WAN -> Wireless -> Login）都完成後，最後會呼叫一個提交函式（通常在 `handler.js` 中名為 `apply.done()` 或執行最後一個 POST）：

1. **合併所有資料**：將先前所有步驟存放在 `qisPostData` 的資料（包含 WAN、無線、管理帳號）一次性打包。
2. **發送 AJAX POST**：呼叫 `httpApi.setNvram()` 將 `qisPostData` 發送到路由器的 `/start_apply.htm`。
3. **系統套用與倒數**：
    - 路由器接收到資料後，會開始重新啟動網路服務（或重啟機器）。
    - 前端會顯示一個進度條（通常倒數 30~60 秒）。
    - 倒數結束後，導向路由器首頁 `index.asp`。

### Vue 重整建議

- **密碼強度偵測**：可以使用 Vue 的 `watch` 即時偵測密碼欄位，動態顯示強度條（Score bar），取代舊有的 jQuery 插件。
- **多頻段同步**：利用 Vue 的 `v-model` 配合一個「同步所有頻段設定」的 `checkbox`，可以輕鬆實作「SSID 密碼同步」的功能。
- **最後提交**：建議將 `qisPostData` 放在 Vuex 或 Pinia 中進行全局管理，最後在 `Finish.vue` 頁面一次性發送 `axios.post`。

### 六、 進階設定

在 `QIS_wizard.htm` 的 Welcome 頁面中，點擊「進階設定」（Advanced Settings）通常會進入手動選擇運作模式或手動配置 WAN 的流程。

以下是根據 `handler.js` 邏輯整理出的流程與 NVRAM 影響：

### 1. 進階設定的執行流程

當使用者點擊進階設定按鈕時，通常會觸發類似 `apply.advanced_setting()` 或帶有參數的跳轉函式。

**核心邏輯分支：**

- **狀態標記**：
  - `systemVariable.advSetting` 會被設為 `true`。
  - `systemVariable.manualWanSetup` 會被設為 `true`（代表跳過自動偵測，由使用者手動選擇）。

- **跳轉判斷 (依優先順序)**：
    1. **強制更改密碼 (Force Change PW)**：如果 `systemVariable.forceChangePw` 為真，系統會優先導向 `goTo.Login()`。
    2. **模式選擇頁面 (Operation Mode)**：
        - 通常會導向 `goTo.opMode()`，讓使用者手動選擇：**無線路由器 (Router)**、**存取點 (AP)**、**中繼 (Repeater)**、**媒體橋接 (Media Bridge)** 或 **AiMesh 節點**。
        - 如果是 DSL 機種，則會跳轉至 `goTo.manualDSLWan()`。
    3. **特殊路徑**：若系統偵測到特定硬體插槽（如 USB Modem），可能會詢問是否進入 `goTo.Modem()`。

---

### 2. 進階設定流程圖

---

### 3. 涉及的 NVRAM 與系統變數

在進階設定流程中，前端會開始頻繁操作 `opModeObj` 與 `qisPostData`，這會決定最後寫入 NVRAM 的內容：

| 變數名稱 / NVRAM 鍵值 | 說明             | 動作                                                                        |
| :-------------------- | :--------------- | :-------------------------------------------------------------------------- |
| **`sw_mode`**         | 系統運作模式     | 根據選擇設為 `1` (Router), `2` (Repeater), `3` (AP), `4` (Media Bridge)     |
| **`wlc_psta`**        | 媒體橋接模式標記 | 若選 MB 模式，此值會設為 `1`                                                |
| **`wlc_dpsta`**       | 雙頻中繼標記     | 若選 Repeater 且支援雙頻，此值會受影響                                      |
| **`wan_proto`**       | WAN 連線協議     | 進入進階設定後，若選擇路由器模式，會由使用者手動設定為 `static`, `pppoe` 等 |
| **`qis_Setting`**     | QIS 設定狀態     | 只要進入此流程，最終提交時會設為 `1` 確保不再重複進入精靈                   |
| **`x_Setting`**       | 系統已設定標記   | 提交時設為 `1`                                                              |

---

### 4. Vue 重整建議：進階設定模組化

在使用 Vue 3 重整時，進階設定不應只是一個簡單的跳轉，而是一個 **狀態切換**。

**建議架構：**

1. **使用 Pinia 管理模式狀態**：

    ```javascript
    // stores/qisStore.js
    export const useQisStore = defineStore("qis", {
        state: () => ({
            isAdvanced: false,
            opMode: 1, // 預設 Router
            isManualWan: false,
        }),
        actions: {
            setAdvancedMode() {
                this.isAdvanced = true;
                this.isManualWan = true;
                // 邏輯處理後 router.push('/opMode')
            },
        },
    });
    ```

2. **UI 組件處理**：
    - 在 `Welcome.vue` 中，進階按鈕呼叫 `setAdvancedMode()`。
    - 建立一個 `OpModeSelection.vue` 組件，利用 `v-for` 渲染所有支援的模式（透過 `isSupport()` 判斷）。

3. **ToS 檢查複用**：
    - 如同前述，無論是「快速開始」還是「進階設定」，都應通過同一個 `ToS` 驗證邏輯，可以封裝成一個組件內的 `validateTos` method。

### 總結

點擊進階設定後，最大的差異在於 **`systemVariable.advSetting` 被啟動**，這會導致系統跳過 `autoWan` 的自動偵測階段，直接將控制權交給使用者，去選擇 `sw_mode`（運作模式）或手動配置 `wan_proto`（上網方式）。

### 七、 goTo.opMode()

在執行 `goTo.opMode()` 後，系統會進入**「運作模式手動選擇」**頁面。這是「進階設定」流程的核心，讓使用者決定這台設備要當成路由器、延伸器、還是基地台使用。

以下是詳細的執行流程與 NVRAM 影響：

### 1. 頁面顯示與模式選擇邏輯

進入 `opMode` 頁面後，前端會根據 `isSupport()` 函式的回傳值，動態顯示該型號支援的運作模式。常見選項包括：

- **無線路由器 (Wireless Router)**：預設模式。
- **存取點 (Access Point)**：接在另一台路由器後方，僅提供 Wi-Fi。
- **中繼模式 (Repeater)**：無線擴展現有的 Wi-Fi 訊號。
- **媒體橋接 (Media Bridge)**：讓有線設備透過本機連上無線網路。
- **AiMesh 節點**：將此設備加入現有的 AiMesh 系統。

### 2. 按下模式後的跳轉流程 (以 `apply.opMode` 為例)

當使用者選定模式並點擊「下一步」時：

1. **更新本地狀態**：
    - 將選擇的模式代碼寫入 `opModeObj.sw_mode`。
    - 如果是 Mesh 相關模式，會設定 `systemVariable.isMesh` 等標記。

2. **路徑分支判斷**：
    - **選擇「無線路由器」**：
        - 因為是進階模式，系統會跳過自動偵測，直接導向 **`goTo.wan_type()`** (手動選擇連線類型，如 PPPoE, Static IP, DHCP)。
    - **選擇「存取點 (AP)」**：
        - 導向 **`goTo.autoWan_AP()`** 或 **`goTo.Wireless()`**。
    - **選擇「中繼 (RP)」或「媒體橋接 (MB)」**：
        - 導向 **`goTo.scan_ap()`**，開始掃描周邊可連線的 Wi-Fi 訊號。
    - **選擇「AiMesh 節點」**：
        - 進入 AiMesh 初始化等待畫面，由主路由來搜尋此設備。

---

### 3. 設定到哪些 NVRAM 變數

雖然最終的提交是在整個流程結束，但 `opMode` 頁面的選擇決定了 `qisPostData` 中最重要的系統屬性：

| NVRAM 變數      | 說明                   | 設定值參考                                      |
| :-------------- | :--------------------- | :---------------------------------------------- |
| **`sw_mode`**   | **主切換開關**         | `1`: Router, `2`: Repeater, `3`: AP, `4`: MB    |
| **`wlc_psta`**  | 代理站模式 (Proxy STA) | 選 MB 時通常設為 `1`，選 RP 時可能為 `0` 或 `2` |
| **`wlc_dpsta`** | 雙頻中繼切換           | 決定是否同時中繼 2.4G 與 5G                     |
| **`wlc_band`**  | 中繼頻段選擇           | 使用者選定要用哪個頻段來連接上層訊號            |

---

### 4. Vue 3 重整建議：模式選擇器架構

在重整這部分代碼時，建議將模式選擇設計為一個**「配置驅動」**的組件：

#### A. 數據驅動視圖 (Data-Driven View)

不要在 HTML 裡寫死五個按鈕，而是用一個數組管理：

```javascript
const modes = [
    { id: 1, label: "無線路由器", support: "Router", route: "wan_type" },
    { id: 3, label: "存取點 (AP)", support: "apMode", route: "wireless" },
    { id: 2, label: "中繼模式", support: "repmode", route: "scan_ap" },
];

// 使用 computed 過濾該型號支援的模式
const supportedModes = computed(() => modes.filter((m) => isSupport(m.support)));
```

#### B. 路由守衛 (Router Guard)

由於運作模式會大幅改變後續 QIS 的步驟（例如：AP 模式不需要設定 PPPoE），建議在 Vue Router 中使用動態跳轉：

```javascript
const handleModeSelect = (mode) => {
    qisStore.updateOpMode(mode.id);
    router.push({ name: mode.route });
};
```

### 總結

`goTo.opMode()` 是進階設定的**分水嶺**。它最重要的任務是確立 `sw_mode`，並根據這個模式決定接下來是要去設定 **WAN (網際網路)** 還是去 **Scan AP (搜尋上層 Wi-Fi)**。

### 八、 goTo.wan_type()

在進階設定中，執行 `goTo.wan_type()` 會進入**「手動選擇連線類型」**頁面。這是在使用者選擇「無線路由器模式 (Router Mode)」且不使用自動偵測時的核心步驟。

以下是詳細流程與涉及的 NVRAM 設定：

### 1. 頁面顯示邏輯

進入 `wan_type` 頁面後，UI 會列出所有支援的廣域網路（WAN）連線協議，供使用者手動挑選。常見選項包括：

- **動態 IP (DHCP / Automatic IP)**
- **PPPoE (ADSL/光纖常用)**
- **靜態 IP (Static IP)**
- **PPTP**
- **L2TP**
- **特殊類型**：如支援 HGW (Home Gateway) 或特定的 ISP 模式（如日本的 v6plus、OCN VC）。

### 2. 按下連線類型後的跳轉流程

當使用者選定其中一項並點擊時，會根據所選類型執行對應的跳轉函數：

- **選擇 PPPoE**：
  - **下一頁**：跳轉至 `goTo.pppoe()`。
  - **目的**：輸入 ISP 提供撥接用的帳號與密碼。

- **選擇 動態 IP (DHCP)**：
  - **下一頁**：
        1. 若支援特定的 DHCP 選項（如選購特殊 ISP 服務），可能先跳轉至 `goTo.wan_dhcp_option()`。
        2. 一般情況下，直接跳轉至 `goTo.Wireless()` 設定 Wi-Fi。

- **選擇 靜態 IP (Static IP)**：
  - **下一頁**：跳轉至 `goTo.staticIp()`。
  - **目的**：手動輸入固定 IP 地址、子網路遮罩、預設閘道與 DNS。

- **選擇 PPTP / L2TP**：
  - **下一頁**：跳轉至對應的手動輸入頁面（例如 `goTo.pptp_l2tp()`），需要輸入伺服器地址、帳號、密碼以及 IP 獲取方式。

---

### 3. 設定到哪些 NVRAM 變數

在 `wan_type` 頁面點擊選項時，前端會立即更新 `qisPostData` 的 `wan_proto`（WAN 協議）欄位：

| 選擇類型    | NVRAM 變數 `wan_proto` 的值 | 後續影響                                                |
| :---------- | :-------------------------- | :------------------------------------------------------ |
| **動態 IP** | `dhcp`                      | 系統會嘗試透過廣播自動取得 IP。                         |
| **PPPoE**   | `pppoe`                     | 後續需寫入 `wan_pppoe_username` 與 `wan_pppoe_passwd`。 |
| **靜態 IP** | `static`                    | 後續需寫入 `wan_ipaddr_x`, `wan_netmask_x` 等。         |
| **PPTP**    | `pptp`                      | 需額外設定 `wan_pptp_server_ip`。                       |
| **L2TP**    | `l2tp`                      | 需額外設定 `wan_l2tp_server_ip`。                       |

此外，系統會根據硬體情況設定 `wan_unit`（通常為 `0`），代表這是在設定第一組 WAN。

---

### 4. Vue 3 重整建議：連線類型導航器

這部分是標準的**選單式導航**，建議實作方式如下：

#### A. 配置化選項

與 `opMode` 類似，定義一個物件數組，根據 `isSupport` 決定哪些連線方式要顯示。

```javascript
const wanTypes = [
    { id: "dhcp", label: "動態 IP", route: "qis_dhcp" },
    { id: "pppoe", label: "PPPoE", route: "qis_pppoe" },
    { id: "static", label: "靜態 IP", route: "qis_static" },
];
```

#### B. 狀態預設

在跳轉到具體的連線設定頁面（如 PPPoE）前，先更新 Pinia 中的全域狀態：

```javascript
const selectWanType = (proto) => {
    qisStore.updateWanProto(proto); // 更新 qisPostData.wan_proto
    router.push({ name: protoMap[proto].route });
};
```

#### C. 特殊 ISP 邏輯 (Special Requirements)

在 `handler.js` 中有許多針對特定地區（如 `isSupport("hgw")`）的特殊檢查。在 Vue 中，建議將這些特殊檢查封裝成一個 `interceptor`，在 `selectWanType` 執行前判斷是否需要攔截並跳轉到特殊設定頁面。

### 總結

`goTo.wan_type()` 是手動設定中最關鍵的\*\*資料定義點\*\*。它決定了接下來系統需要跟使用者索取哪些網路憑據（是帳號密碼，還是固定 IP），並為最後的 `apply.done()` 準備好正確的 `wan_proto` 協定參數。

#### 判斷WAN TYPE 支援方式

在華碩路由器的 QIS（快速設定精靈）架構中，判斷支援哪些廣域網路（WAN）連線協議，主要是透過 **`isSupport()`** 函式結合後端傳回的 **`capability`（硬體能力值）** 來動態決定的。

如果您正在用 Vue 重整，這部分的判斷邏輯應封裝在一個 `useCapability` 或 `capabilityStore` 中。

以下是判斷各類協議支援情況的邏輯與對應條件：

### 1. 核心判斷邏輯：`isSupport()` 與硬體旗標

前端會根據從 `httpApi` 取得的系統資訊，判斷以下幾個關鍵旗標：

- **PPPoE / DHCP / Static IP**：
    - **判斷方式**：這三者是所有路由器的「基本款」，除非是純 DSL 設備且未開啟乙太網路 WAN，否則預設皆為**支援**。
    - **Vue 實作建議**：直接列為預設選項，不需特別檢查 `capability`。

- **PPTP / L2TP**：
    - **判斷方式**：檢查 `isSupport("vpn")` 或 `isSupport("wan_vpn")`。
    - **目的**：並非所有低階型號都支援將 PPTP/L2TP 作為主要的 WAN 連線協定。

- **DSL / VDSL (寬頻撥接直接連線)**：
    - **判斷方式**：`isSupport("dsl")` 或 `isSupport("vdsl")`。
    - **影響**：若支援，`wan_type` 頁面會多出 DSL 設定選項，並可能跳轉至 `goTo.manualDSLWan()`。

- **4G/5G 行動網路 (USB Modem / Gobi)**：
    - **判斷方式**：`isSupport("gobi")`（內建 SIM 卡槽）或 `isSupport("modem")`（支援 USB 網卡）。
    - **影響**：在 `wan_type` 中會出現「USB Modem」或「Mobile Broadband」選項。

---

### 2. 特殊地區與 ISP 協議 (Advanced Protocols)

華碩針對特定市場（如日本、韓國）有特殊的連線協議，這些判斷非常依賴 `capability`：

- **日本專用 (V6Plus, OCN VC, DS-Lite)**：
    - **判斷方式**：`isSupport("v6plus")`, `isSupport("ocnvc")`, `isSupport("dslite")`。
    - **NVRAM 影響**：這些協定通常會設定 `ipv6_service` 與特殊的封裝方式。

- **HGW (Home Gateway)**：
    - **判斷方式**：`isSupport("hgw")`。
    - **影響**：這通常見於特定電信商客製機，會簡化某些 WAN 設定步驟。

---

### 3. Vue 3 的實作架構建議

在重整時，不建議在 HTML 裡面寫一堆 `v-if="isSupport('...')"`。建議在組件掛載時，先計算出一個「可用協議清單」。

#### 步驟 A：建立協議設定檔

```javascript
// config/wanProtocols.js
export const WAN_PROTOCOLS = [
    { id: "dhcp", label: "自動取得 IP (DHCP)", support: null }, // null 代表全部支援
    { id: "pppoe", label: "PPPoE", support: null },
    { id: "static", label: "固定 IP", support: null },
    { id: "pptp", label: "PPTP", support: "vpn" },
    { id: "l2tp", label: "L2TP", support: "vpn" },
    { id: "v6plus", label: "v6plus (Japan)", support: "v6plus" },
    { id: "modem", label: "USB Modem / 4G/5G", support: "modem" },
];
```

#### 步驟 B：在組件中過濾

```javascript
// WanType.vue
import { computed } from "vue";
import { useCapabilityStore } from "@/stores/capability";
import { WAN_PROTOCOLS } from "@/config/wanProtocols";

const capStore = useCapabilityStore();

const availableProtocols = computed(() => {
    return WAN_PROTOCOLS.filter((proto) => {
        if (!proto.support) return true;
        return capStore.isSupport(proto.support);
    });
});
```

### 4. 涉及的 NVRAM 值預覽

當你透過上述邏輯判斷並顯示給使用者後，使用者選中的項目會對應到 `wan_proto` 變數：

| 協議    | `wan_proto` 值                        |
| :------ | :------------------------------------ |
| 動態 IP | `dhcp`                                |
| 靜態 IP | `static`                              |
| PPPoE   | `pppoe`                               |
| PPTP    | `pptp`                                |
| L2TP    | `l2tp`                                |
| v6plus  | `v6plus` (或透過 `ipv6_service` 控制) |

### 總結

判斷支援協議的關鍵在於**解析後端傳回的 `capability` 物件**。在舊的 `handler.js` 中，這些判斷散落在各處，重整時應統一由一個 **Store** 管理，這樣當您更換不同型號的路由器測試時，UI 會自動根據硬體能力隱藏或顯示對應的 WAN 選項。

#### DHCP 模式

在 `wan_type` 頁面選擇 **DHCP (Automatic IP)** 後，這代表使用者希望路由器自動從 ISP（電信商）的大寬頻設備取得 IP 地址。

以下是選擇 DHCP 後的詳細執行流程與相關的 NVRAM 設定：

### 1. 執行流程 (以 `apply.wan_type` 為邏輯起點)

當使用者點擊「動態 IP (DHCP)」選項時，前端會觸發以下判斷：

1.  **設定協定變數**：
    - 將 `qisPostData.wan_proto` 設為 `"dhcp"`。
    - 這會覆蓋掉之前可能存在的 `pppoe` 或 `static` 設定。

2.  **特殊 ISP 檢查 (DHCP Option)**：
    - **判斷原因**：某些地區（如澳洲或特定歐洲 ISP）要求在 DHCP 請求中攜帶特定的 Option 60 或 Option 61（Client ID）。
    - **動作**：如果偵測到 `isSupport("wan_dhcp_option")` 為真，或者頁面上的相關勾選框被選中，系統會跳轉至 **`goTo.wan_dhcp_option()`** 頁面。

3.  **硬體/模式攔截 (以 `handler.js` 為準)**：
    - **USB Modem 檢查**：如果系統偵測到插有 USB 網卡（`hadPlugged("modem")`），可能會詢問是否改用行動網路，或導向 `goTo.Modem()`。
    - **行動寬頻 (Gobi)**：若支援內建 SIM 卡且狀態為 READY，可能會導向無線設定。

4.  **進入無線設定**：
    - 如果沒有上述特殊需求，DHCP 是最簡單的模式，系統會直接跳轉至 **`goTo.Wireless()`**，進入設定 Wi-Fi SSID 與密碼的階段。

---

### 2. 涉及的 NVRAM 與系統變數設定

雖然 DHCP 不需要帳號密碼，但為了確保連線正確，系統會寫入以下關鍵欄位：

| NVRAM 變數             | 設定值    | 說明                                             |
| :--------------------- | :-------- | :----------------------------------------------- |
| **`wan_proto`**        | `dhcp`    | 告知後端連線協議為動態取得。                     |
| **`wan_dhcpenable_x`** | `1`       | 啟用 WAN 端的 DHCP Client。                      |
| **`wan_dnsenable_x`**  | `1`       | 預設自動取得 DNS（除非使用者在進階設定中指定）。 |
| **`wan_unit`**         | `0`       | 指定第一組 WAN 介面。                            |
| **`wan_ipaddr_x`**     | `0.0.0.0` | 清空之前的靜態 IP 紀錄（預防衝突）。             |
| **`wan_netmask_x`**    | `0.0.0.0` | 清空之前的遮罩紀錄。                             |

---

### 3. Vue 3 重整建議：處理 DHCP 特殊邏輯

在 Vue 組件（例如 `QisDhcp.vue` 或 `WanType.vue`）中，您可以利用計算屬性來優化這段導航：

```javascript
// 在 WanType 組件中處理選擇 DHCP 的邏輯
const selectDhcp = () => {
    // 1. 更新全域狀態 (Pinia/Vuex)
    qisStore.updateWanProto("dhcp");

    // 2. 判斷是否有特殊的 DHCP Option 需求
    const needsDhcpOption = isSupport("wan_dhcp_option") && userSelectedSpecialISP;

    if (needsDhcpOption) {
        router.push({ name: "qis_dhcp_option" });
    } else if (capStore.isSupport("gobi") && simReady) {
        // 如果是行動路由且 SIM 卡 OK，直接去設無線
        router.push({ name: "qis_wireless" });
    } else {
        // 一般最常見的情況：直接去設 Wi-Fi
        router.push({ name: "qis_wireless" });
    }
};
```

### 4. 為什麼 DHCP 流程最簡單？

相較於 PPPoE 需要處理「帳號密碼驗證」或 Static IP 需要「手動輸入地址」，DHCP 的核心邏輯是**「清空舊資料並直接進入下一步」**。在舊的 `handler.js` 中，這部分通常是直接呼叫 `goTo.Wireless()`。

**總結：**
選取 DHCP 後，除非有特定的 **ISP Option (例如：Client ID)** 要求，否則流程會跳過所有 WAN 設定頁面，直接進入 **`goTo.Wireless()`** 設定無線網路。

#### goTo.Wireless()

在 `QIS_wizard.htm` 的流程中，`goTo.Wireless()` 是整個設定精靈的**最後一個關鍵輸入階段**。當使用者完成 WAN（網路連線）設定後，就會來到這裡配置 Wi-Fi。

以下是按下「套用」後的詳細流程、邏輯判斷以及最終寫入 NVRAM 的動作：

### 1. `apply.Wireless()` 執行流程

當使用者在無線設定頁面點擊「下一步」或「套用」時，`handler.js` 會執行以下邏輯：

- **資料驗證 (Validation)**：
    - 檢查 SSID 是否為空。
    - 檢查密碼長度：若加密方式為 WPA2，密碼必須在 8~63 字元之間。
    - **Vue 重整建議**：這裡可以使用 `validator.js` 的邏輯轉寫為 Vue 的 Form Validation。
- **同步頻段 (Band Synchronization)**：
    - 如果使用者開啟了 **Smart Connect**（或 `isSupport("smart_connect")`），系統會將 2.4G、5G（甚至 6G）的 SSID 與密碼設為相同。
    - 如果未開啟，則根據各個頻段的輸入框分別賦值。
- **例外檢查**：
    - 檢查是否存在 SSID 中文編碼問題（舊架構會將其轉為 Hex）。
    - 若支援 `mlo` (Wi-Fi 7 技術)，會額外處理 MLD 相關的變數。

---

### 2. 下一頁跳轉：`apply.done()` 或 `goTo.Login()`

無線設定完成後，下一步通常是確保路由器的管理員帳號密碼已設定：

1.  **檢查管理員密碼**：
    - 如果系統判斷這是在出廠狀態（`systemVariable.isDefault`），且前面步驟還沒要求設定過帳密。
    - **下一頁**：跳轉至 `goTo.Login()`。
2.  **結束設定**：
    - 如果帳密已設定過。
    - **下一頁**：跳轉至 `goTo.finish()` (顯示設定總結頁面)。

---

### 3. 設定到哪些 NVRAM 變數

這是 QIS 流程中對 `qisPostData` 賦值最密集的地方。最終這些值會透過 AJAX POST 寫入路由器硬體：

| NVRAM 變數範例         | 說明            | 典型值                           |
| :--------------------- | :-------------- | :------------------------------- |
| **`0:wl_ssid`**        | 2.4GHz SSID     | 使用者輸入的名稱                 |
| **`0:wl_wpa_psk`**     | 2.4GHz 無線密碼 | 使用者輸入的密碼                 |
| **`1:wl_ssid`**        | 5GHz SSID       | 使用者輸入的名稱                 |
| **`1:wl_auth_mode_x`** | 授權模式        | `psk2` (WPA2) 或 `sae` (WPA3)    |
| **`1:wl_crypto`**      | 加密類型        | `aes`                            |
| **`w_Setting`**        | **關鍵標記**    | `1` (告知系統無線已設定完成)     |
| **`x_Setting`**        | **關鍵標記**    | `1` (告知系統 QIS 流程已完成)    |
| **`qis_Setting`**      | **關鍵標記**    | `1` (確保下次開機不自動跳入 QIS) |

---

### 4. 最終提交：`/start_apply.htm`

在所有步驟（包含 `Login`）完成後，最後會呼叫 `httpApi.applyQis(qisPostData)`：

1.  **發送 POST**：將收集到的所有 `wan_`、`wl_`、`http_` 相關 NVRAM 變數一次性發送到後端。
2.  **觸發服務重啟**：後端會根據這些 NVRAM 重新啟動 `rc` 服務（如 `restart_wan`, `restart_wireless`）。
3.  **倒數計時**：
    - UI 進入 `goTo.loading()`。
    - 根據 `systemVariable.rebootTime` 顯示倒數進度條（通常 30~60 秒）。
4.  **導向首頁**：倒數結束後，使用 `window.location.href = "/index.asp"` 跳出 QIS。

---

### Vue 重整提示：

在 Vue 3 中，這部分建議使用 **Pinia** 來暫存 `qisPostData`：

- 在 `Wireless.vue` 的 `onUnmounted` 或點擊下一步時，將 `v-model` 綁定的資料寫入 Store。
- 在最後的 `Finish.vue` 或 `Login.vue` 中執行 `axios.post('/start_apply.htm', store.qisPostData)`。
- **注意**：務必確保 `w_Setting` 和 `qis_Setting` 有被加入 payload，否則重啟後路由器可能會再次回到精靈頁面。

| NVRAM 變數範例         | 說明            | 典型值                           |
| :--------------------- | :-------------- | :------------------------------- |
| **`0:wl_ssid`**        | 2.4GHz SSID     | 使用者輸入的名稱                 |
| **`0:wl_wpa_psk`**     | 2.4GHz 無線密碼 | 使用者輸入的密碼                 |
| **`1:wl_ssid`**        | 5GHz SSID       | 使用者輸入的名稱                 |
| **`1:wl_auth_mode_x`** | 授權模式        | `psk2` (WPA2) 或 `sae` (WPA3)    |
| **`1:wl_crypto`**      | 加密類型        | `aes`                            |
| **`w_Setting`**        | **關鍵標記**    | `1` (告知系統無線已設定完成)     |
| **`x_Setting`**        | **關鍵標記**    | `1` (告知系統 QIS 流程已完成)    |
| **`qis_Setting`**      | **關鍵標記**    | `1` (確保下次開機不自動跳入 QIS) |

---

### 4. 最終提交：`/start_apply.htm`

在所有步驟（包含 `Login`）完成後，最後會呼叫 `httpApi.applyQis(qisPostData)`：

1. **發送 POST**：將收集到的所有 `wan_`、`wl_`、`http_` 相關 NVRAM 變數一次性發送到後端。
2. **觸發服務重啟**：後端會根據這些 NVRAM 重新啟動 `rc` 服務（如 `restart_wan`, `restart_wireless`）。
3. **倒數計時**：
    - UI 進入 `goTo.loading()`。
    - 根據 `systemVariable.rebootTime` 顯示倒數進度條（通常 30~60 秒）。
4. **導向首頁**：倒數結束後，使用 `window.location.href = "/index.asp"` 跳出 QIS。

---

### Vue 重整提示

在 Vue 3 中，這部分建議使用 **Pinia** 來暫存 `qisPostData`：

- 在 `Wireless.vue` 的 `onUnmounted` 或點擊下一步時，將 `v-model` 綁定的資料寫入 Store。
- 在最後的 `Finish.vue` 或 `Login.vue` 中執行 `axios.post('/start_apply.htm', store.qisPostData)`。
- **注意**：務必確保 `w_Setting` 和 `qis_Setting` 有被加入 payload，否則重啟後路由器可能會再次回到精靈頁面。

#### ToS

# QIS 設定流程

針對 `ToS Check` (服務條款檢查) 的處理，在 Vue 3 的重整架構中，建議將其從原本的「DOM 閃爍」操作轉向**「狀態驅動」**與**「組件化」**。

在原始碼 `handler.js` 中，這段邏輯是透過 jQuery 直接操作高度並讓元素 `fadeOut/fadeIn`。在 Vue 中，我們可以做得更優雅且具備更好的擴展性。

### 1. 邏輯拆解：ToS Check 的觸發條件

根據 `apply.welcome()`，觸發 ToS 檢查的條件如下：

1.  `#tosCheckbox` 必須可見。
2.  `systemVariable.isDefault` 為 `true` (路由器處於出廠狀態)。
3.  `isSupport("ForceBWDPI")` 為 `true` (硬體支援趨勢科技的資安防護功能)。
4.  使用者**尚未勾選**該核取框。

### 2. Vue 3 建議實作方式

#### A. 定義狀態 (State)

在 `Welcome.vue` 組件中，使用 `v-model` 綁定勾選狀態，並定義一個響應式的錯誤狀態來觸發動畫。

```javascript
// Welcome.vue (Composition API)
import { ref, computed } from "vue";

const isAgreed = ref(false); // 綁定 checkbox
const hasTosError = ref(false); // 控制抖動或閃爍動畫的 class

// 模擬原始碼的 isSupport 與 systemVariable
const canShowTos = computed(() => {
    return systemVariable.isDefault && isSupport("ForceBWDPI");
});

const handleNextStep = () => {
    if (canShowTos.value && !isAgreed.value) {
        // 觸發錯誤處理
        hasTosError.value = true;

        // 滾動到最下方 (替代原本的 animate)
        window.scrollTo({ top: document.body.scrollHeight, behavior: "smooth" });

        // 3秒後移除錯誤狀態，讓使用者可以再次嘗試
        setTimeout(() => {
            hasTosError.value = false;
        }, 3000);
        return;
    }

    // 驗證通過，執行原有的 apply.welcome() 邏輯
    proceedToNextPage();
};
```

#### B. 範本與動畫 (Template & CSS)

利用 Vue 的動態類別取代 jQuery 的 `.fadeOut().fadeIn()`。

```html
<template>
    <div class="welcome-container">
        <div v-if="canShowTos" :class="['tos-section', { 'shake-error': hasTosError }]">
            <input type="checkbox" id="tos" v-model="isAgreed" />
            <label for="tos">我同意服務條款與隱私權政策</label>
        </div>

        <button @click="handleNextStep">下一步</button>
    </div>
</template>

<style scoped>
    /* 定義閃爍或抖動動畫 */
    .shake-error {
        animation: flash-red 0.5s ease infinite;
        border: 1px solid red;
        padding: 10px;
    }

    @keyframes flash-red {
        0%,
        100% {
            background-color: transparent;
        }
        50% {
            background-color: rgba(255, 0, 0, 0.1);
        }
    }
</style>
```

### 3. 進階：抽離成全域 Hook (composable)

由於 QIS 流程中多個頁面可能都會檢查不同的 EULA（例如 `Policy.vue`），你可以建立一個 `useTos`：

```javascript
// useTos.js
export function useTos() {
    const checkTos = (isAgreed, targetElement) => {
        if (!isAgreed) {
            targetElement.scrollIntoView({ behavior: "smooth" });
            // 返回驗證失敗結果
            return false;
        }
        return true;
    };

    return { checkTos };
}
```

### 4. 關於 NVRAM 的影響

這部分處理**不會寫入 NVRAM**。ToS 的勾選純粹是**前端攔截器**。

- **但是**，一旦使用者在 Welcome 點擊下一步成功，代表他同意了條款。在最後一步 `apply.done()` 提交時，後端通常會根據這次的導向結果，將 `eula_confirmed` 或相關變數設定為 `1` 並寫入 NVRAM，確保下次開機不再進入 QIS。

**總結建議：**
在 Vue 重整時，不需要模仿舊碼用 `jQuery.animate`。改用 CSS Animation 處理視覺提醒，並用 `v-model` 確保資料狀態（Data State）才是控制流程的核心。這樣你的代碼會比原始的 `handler.js` 乾淨得多。