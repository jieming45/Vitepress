# vue3-wrt-project 專案資料夾結構詳解

---

### 技術棧（Tech Stack）

| 類別       | 技術                                            | 用途                                            |
| ---------- | ----------------------------------------------- | ----------------------------------------------- |
| 前端框架   | **Vue 3**（Composition API + `<script setup>`） | UI 元件與響應式                                 |
| 建置工具   | **Vite 8**                                      | 開發伺服器、Proxy、打包                         |
| 狀態管理   | **Pinia**                                       | 全域狀態（裝置資訊、認證、QIS 設定流程）        |
| 路由       | **Vue Router**（Hash 模式）                     | 頁面導航，路由器環境不支援 History API          |
| 多國語系   | **vue-i18n**                                    | 25 種語言切換                                   |
| HTTP       | **Axios**                                       | 對路由器 CGI / NVRAM API 發送請求               |
| 單元測試   | **Vitest**（jsdom）                             | 元件 / store / util 測試                        |
| E2E 測試   | **Playwright**                                  | 跨瀏覽器端對端測試                              |
| 程式碼品質 | **ESLint + oxlint + Prettier**                  | Lint 與格式化                                   |
| UI 元件庫  | **Quasar 2**                                    | 版面（Layout / Drawer / Page）、元件、SASS 主題 |
| 圖表       | **Chart.js**                                    | 流量分析 / 即時流量圖表                         |

## 二、根目錄檔案（專案設定與入口）

| 檔案                                   | 用途說明                                                                                                                                                                                              |
| -------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `package.json`                         | 專案的核心設定檔。定義了專案依賴 (Vue, Quasar, Pinia, Axios, Chart.js) 與開發腳本 (如 dev, build, test:e2e, lint, 以及各類語系注入腳本)。                                                             |
| `index.html`                           | SPA 唯一的 HTML 入口；`<div id="app">` 為 Vue 掛載點，應用程式的進入點，Vite 從此處掛載 src/main.ts。                                                                                                 |
| `vite.config.ts`                       | Vite 建置設定。1. 配置了 Vue、Quasar 插件，路徑別名 (@ 指向 src)重點：2.開發模式下將 `*.cgi` / `*.asp` 等請求 **proxy 到路由器**；3. 打包時的 chunk 切分策略（vendor / QIS / views / locales 分包）。 |
| `vitest.config.ts`                     | 單元測試設定，使用 jsdom 環境，掃描 `__tests__` / `__test__` 內的 `.test.ts`。                                                                                                                        |
| `playwright.config.ts`                 | Playwright 端到端 (E2E) 測試框架設定，支援多瀏覽器 (Chromium, Firefox, WebKit) 測試。                                                                                                                 |
| `tsconfig.json`                        | TypeScript 編譯設定，繼承 Vue 官方 DOM 設定，定義 `@/*` 路徑別名指向 `src/`。                                                                                                                         |
| `env.d.ts`                             | 定義 TypeScript 環境變數型別，確保 import.meta.env 的自動補全與型別檢查。                                                                                                                             |
| `eslint.config.ts` / `.oxlintrc.json`  | 程式碼語法檢查設定。（Vue + TS + Playwright + Vitest + oxlint 整合）。                                                                                                                                |
| `.prettierrc.json` / `.prettierignore` | Prettier 格式化規則與忽略清單。                                                                                                                                                                       |
| `.env.development`                     | 開發環境變數：設定 `VITE_ROUTER_URL`（路由器位址），API base 留空走 Vite proxy。                                                                                                                      |
| `.env.production`                      | 正式環境變數：API 走同源相對路徑（由路由器 httpd 直接服務）。                                                                                                                                         |

---

## 三、`src/` — 應用程式原始碼（核心）

### 3.1 應用入口

| 檔案          | 用途說明                                                                                                                                           |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `src/main.ts` | **應用程式啟動入口**。建立 Vue app，依序註冊 Pinia、Router、Quasar（含 Loading 外掛與中文語系）、i18n，最後掛載到 `#app`。                         |
| `src/App.vue` | **根元件**，負責頂層版面切換邏輯：1. 未認證 → 顯示 Login；2. QIS 流程 → 精簡版面（無側欄）；3. 已認證 → 完整版面（Header + 左右欄位 + 頁面容器）。 |
| `src/i18n.ts` | i18n 初始化。以 `import.meta.glob` 自動載入 `locales/*.ts` 全部語系檔，預設語言 TW、fallback EN。                                                  |

---

### 3.2 `src/api/` — 後端通訊層（CGI / NVRAM API）

封裝路由器舊式 CGI 介面，是前端與路由器溝通的管道。

#### `src/api/core/` — HTTP 核心

| 檔案       | 用途                                                                                                           |
| ---------- | -------------------------------------------------------------------------------------------------------------- |
| `http.ts`  | 建立 Axios 實例（`withCredentials`、10s timeout），並**依序註冊四個攔截器**（auth → form → mock → response）。 |
| `types.ts` | API 共用型別 TypeScript 型別定義。                                                                             |

#### `src/api/plugins/` — Axios 攔截器（順序很重要）

| 檔案                 | 用途                                                                                                               |
| -------------------- | ------------------------------------------------------------------------------------------------------------------ |
| `auth.plugin.ts`     | 認證攔截器：處理 session / 未授權導轉。                                                                            |
| `form.plugin.ts`     | 表單攔截器：將 POST 資料轉成路由器期望的 form-urlencoded 格式。                                                    |
| `mock.plugin.ts`     | **Mock 降級攔截器**：開發模式下若後端不存在（404 / 連線失敗），自動注入假資料，避免畫面卡死。嚴格限定僅 dev 生效。 |
| `response.plugin.ts` | 回應攔截器：統一解包回應 body、錯誤處理。                                                                          |

#### `src/api/module/` — 各功能域 API 模組

| 檔案                      | 用途                                                                     |
| ------------------------- | ------------------------------------------------------------------------ |
| `auth.api.ts`             | 登入(支援 legacy 與 v2 nonce) / 登出 API（`login.cgi` / `logout.cgi`）。 |
| `device.api.ts`           | 裝置資訊查詢（型號、支援能力、網路狀態）。                               |
| `dashboard.api.ts`        | 儀表板診斷 CGI（流量、乙太網埠狀態、活躍裝置、DNS ping、Aura 燈效）。    |
| `gameAcceleration.api.ts` | 電競加速相關 API（三段加速、Trend Micro EULA）。                         |
| `trafficAnalyzer.api.ts`  | 流量分析統計 API（WAN / App 流量）。                                     |
| `trafficMonitor.api.ts`   | 即時流量監控 API。                                                       |
| `user.api.ts`             | 使用者 / 帳號相關 API。                                                  |

#### 根層 API（共用基礎）

| 檔案            | 用途                                                                                     |
| --------------- | ---------------------------------------------------------------------------------------- |
| `hook.api.ts`   | 封裝 `appGet.cgi?hook=xxx()` 的 hook 查詢（路由器資料讀取的主要方式）。                  |
| `nvram.api.ts`  | 封裝 NVRAM 讀寫：`nvram_get` / `nvram_default_get` 讀取設定值，`applyapp.cgi` 寫入設定。 |
| `reboot.api.ts` | 重新開機 API。                                                                           |

`fetchHook` 定義：

```js
export function fetchHook<T = unknown>(hookName: string): Promise<T> {
    return http.get('appGet.cgi', {
        params: { hook: `${hookName}()` },
    });
}
```

`fetchHook` 範例:

送出請求
`GET /appGet.cgi?hook=get_ui_support()`

```js
import { fetchHook } from '@/api/hook.api';

async function checkAuth() {
    const res = await fetchHook<Record<string, unknown>>('get_ui_support');
}
```

`fetchNvram` 定義：

```js
export function fetchNvram<T = unknown>(nvramList: string[]): Promise<T> {
    const hook = nvramList.map((item) => `nvram_get(${item})`).join(';');
    return http.get('appGet.cgi', { params: { hook } });
}
```

`fetchNvram` 範例:

```js
import { fetchNvram } from '@/api/nvram.api';

// 讀取路由器目前的語言設定
const resNvram = await fetchNvram(['preferred_lang']);
const { preferred_lang } = resNvram as { preferred_lang: string };

currentLanguage.value = preferred_lang || 'EN';
```

`setNvram` 定義：

```js
export function setNvram<T = unknown>(setData: Record<string, unknown>): Promise<T> {
    return http.post('applyapp.cgi', setData);
}
```

```setNvram` 範例:

```js
import { setNvram } from '@/api/nvram.api';

const changeLanguage = (langCode: string) => {
    locale.value = langCode;
    setNvram({ action_mode: 'apply', preferred_lang: langCode });
};
```

---

### 3.3 `src/stores/` — Pinia 全域狀態管理

> 命名約定：`xxx.ts` 為 store 本體；`xxx.parsers.ts` 為純函式資料解析器（把路由器回傳的原始字串轉成型別化物件，方便獨立測試）。

| 檔案                                                | 用途                                                                                                              |
| --------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| `auth.store.ts`                                     | **認證狀態**：`isAuthenticated` / `authReady`，提供 `checkAuth` / `login` / `logout`。                            |
| `device.store.ts`                                   | **裝置資訊中樞**：型號、`deviceSupport`（機種能力旗標）、運作模式、乙太 WAN 清單等，是全 App 判斷硬體差異的依據。 |
| `systemVariable.ts`                                 | **QIS 流程系統變數**：運作模式、AP 掃描清單（papList）、多頻段 PAP 追蹤等設定精靈狀態。                           |
| `qisPostData.ts`                                    | **QIS 表單暫存**：累積整個設定精靈過程要送出的 postData，提供 set / update / remove / insert 模板操作。           |
| `dashboard.ts`                                      | 儀表板狀態（整合多個診斷 API 資料）。                                                                             |
| `dashboard.parsers.ts`                              | 儀表板原始資料解析器（WAN、CPU/RAM、流量、DNS ping、埠狀態、Aura、WiFi、裝置清單）。                              |
| `gameAcceleration.ts`                               | 電競加速狀態。                                                                                                    |
| `trafficAnalyzer.ts` / `trafficAnalyzer.parsers.ts` | 流量分析狀態與解析器。                                                                                            |
| `trafficMonitor.ts` / `trafficMonitor.parsers.ts`   | 即時流量監控狀態與解析器。                                                                                        |

`auth.store.ts` 範例：

```ts
import { defineStore } from "pinia";
import { ref } from "vue";
import { loginRouter } from "@/api/module/auth.api";
import { fetchHook } from "@/api/hook.api";

// ① 定義 Store：'auth' 是全域唯一識別名稱
export const useAuthStore = defineStore("auth", () => {
  // ② State（狀態）：用 ref 宣告，是響應式的
  const isAuthenticated = ref(false); // 是否已登入
  const authReady = ref(false); // 認證確認是否完成

  // ③ Actions（動作）：可以是 async，可呼叫 API
  async function checkAuth() {
    try {
      const res = await Promise.race([
        fetchHook<Record<string, unknown>>("get_ui_support"),
        new Promise<null>((_, reject) =>
          setTimeout(() => reject(new Error("timeout")), 5000),
        ),
      ]);
      // 直接修改 state，Pinia 自動通知所有用到它的元件更新
      isAuthenticated.value =
        res != null && typeof res === "object" && "get_ui_support" in res;
    } catch {
      isAuthenticated.value = false;
    } finally {
      authReady.value = true;
    }
  }

  async function login(username: string, password: string) {
    await loginRouter(username, password);
    await checkAuth(); // 登入後重新確認認證狀態
  }

  function logout() {
    isAuthenticated.value = false;
  }

  // ④ 回傳 → 這些才是外部可使用的
  return { isAuthenticated, authReady, checkAuth, login, logout };
});
```

`App.vue` 中使用範例：

```js
// 呼叫 useAuthStore() 取得 store 實例
const authStore = useAuthStore();

// 讀取 state（響應式，狀態改變時畫面自動更新）
authStore.isAuthenticated; // false / true
authStore.authReady; // false / true

// 呼叫 action
authStore.checkAuth(); // 非同步確認登入狀態
authStore.login("admin", "password");
authStore.logout();
```

---

### 3.4 `src/views/` — 頁面元件（路由對應）

#### 頂層頁面（非 QIS）

| 檔案                                                      | 用途                                                                                   |
| --------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| `Dashboard.vue`                                           | **儀表板首頁**：WAN 資訊、系統狀態、乙太網埠、裝置清單、Aura RGB、即時流量等卡片彙整。 |
| `Login.vue`                                               | 登入頁。                                                                               |
| `GameBoost.vue` / `GameAcceleration/GameAcceleration.vue` | 電競加速頁。                                                                           |
| `AiProtection.vue`                                        | AiProtection 安全防護頁。                                                              |
| `OpenNAT.vue`                                             | OpenNAT（遊戲連接埠）頁。                                                              |
| `ParentControls.vue`                                      | 家長監護頁。                                                                           |
| `TrafficAnalyzer/Statistics/TrafficAnalyzer.vue`          | 流量分析統計頁。                                                                       |
| `TrafficMonitor/TrafficMonitor.vue`                       | 即時流量監控頁。                                                                       |
| `QIS_wizard.vue`                                          | **QIS 精靈外殼**：所有 QIS 子頁面的 `<RouterView>` 容器與共用版面。                    |

#### `src/views/QIS/` — 快速設定精靈（80+ 子頁面）

這是專案最龐大的區塊，每個檔案對應設定流程中的一個步驟畫面。依功能分群：

- **流程起點**：`Welcome.vue`、`OperationMode.vue`（選運作模式）、`ChooseRole.vue`、`AdvancedSettings.vue`、`ChangePassword.vue`。
- **WAN 連線設定**：`WanPhyType.vue`、`WanProtocolType.vue`、`PPPoE.vue`、`StaticIp.vue`、`WanDhcpOption.vue`、`AutoWanHint.vue`、`SpecialIspRequirement.vue`。
- **無線設定**：`WirelessSettings.vue`、`SiteSurvey.vue`、`PapList.vue`、`WlcKey.vue`、`AxMode.vue`。
- **AiMesh（多節點組網）**：`AmasIntro.vue`、`AmasNode.vue`、`AmasSearch.vue`、`AmasOnboarding.vue`、`AmasBundle.vue`、`AmasRestore.vue`、`AmasConnCap.vue`、`AmasOption.vue`、`AmasErrConnRouter.vue`、`AmasErrManual.vue`。
- **AP / WISP / Mesh 模式**：`WispMode.vue`、`MeshMode.vue`、`WaitingAp.vue`、`NoWanAp.vue`、`ResetModemAp.vue`。
- **特殊 ISP（日本 v6plus / OCN / DS-Lite）**：`V6Plus.vue`、`V6Opt.vue`、`OcnVc.vue`、`DsLite.vue`、`Waiting46.vue`、`Wan46Detection.vue`、`Wan46Result.vue`。
- **DSL 機種專用**：`DslPppConfig.vue`、`DslMerConfig.vue`、`DslManualSetting.vue`、`DslIptv.vue`、`DslWaiting.vue` 等十餘頁。
- **行動網路 / SIM**：`UsbModem.vue`、`PhoneAsModem.vue`、`SimPin.vue`、`SimPuk.vue`、`SimUnlock.vue`。
- **Site-to-Site VPN**：`Site2Site.vue`、`Site2SiteWifiSelect.vue`、`Site2SiteSummary.vue`、`VpnSettings.vue`、`VpnIpType.vue`。
- **SDN / IoT 情境**：`SdnIot.vue`、`SdnScenarios.vue`。
- **等待 / 完成 / 韌體**：`Waiting.vue`、`WaitingDsl.vue`、`Finish.vue`、`FirmwareUpdate.vue`、`Upgrading.vue`。
- **法律條款**：`AsusToS.vue`、`TmToS.vue`、`PolicyPage.vue`。

---

### 3.5 `src/components/` — 可重用元件

| 子資料夾 / 檔案                            | 用途                                                                                                                                                                                                                                                                                                                                                           |
| ------------------------------------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Dialog.vue`                               | 共用對話框元件。                                                                                                                                                                                                                                                                                                                                               |
| `LanguageList.vue`                         | 語言選單元件。                                                                                                                                                                                                                                                                                                                                                 |
| `icons/`（39 個 `Icon*.vue` + `index.ts`） | **SVG 圖示元件庫**，涵蓋功能選單、品牌 Logo（ASUS / ROG）、操作圖示，由 `index.ts` 統一匯出。                                                                                                                                                                                                                                                                  |
| `dashboard/`                               | **儀表板卡片元件群**：`DashboardCard`（卡片殼）、`WanInfoCard`、`SystemStatusCard`、`EthernetPortsCard` + `PortTile`、`ClientsCard`、`AuraRgbCard` + `AuraEffectPreview`、`TrafficMonitorCard`、`WifiInsightCard`、`DnsTestCard`、`SparklineChart`（迷你折線圖）。另有 `aura.assets.ts`（燈效圖檔對照）、`dashboard.strategies.ts`（**機種硬體差異策略表**）。 |
| `qis/`                                     | QIS 共用元件：`QisContentPanel` / `QisSidebarPanel`（左右版面）、`ActionButtonLayout`（操作按鈕列）、`PasswordStrengthBar`（密碼強度條）。                                                                                                                                                                                                                     |
| `game_acceleration/`                       | 電競加速元件：`GameDeviceLevel` / `GamePacketLevel` / `GameServerLevel`（三段加速）、`TermsAgreement`。                                                                                                                                                                                                                                                        |
| `traffic_analyzer/statistics/`             | 流量分析圖表：`TrafficDoughnut`（環圈圖）、`TrafficTrendChart`（趨勢圖）、`TrafficStatisticsTable`（統計表）、`TrafficFilterBar`、`Top5Card`。另有 `chartjs.ts`（Chart.js 註冊）。                                                                                                                                                                             |
| `TrafficMonitor/`                          | 即時流量元件：`RealTimeTrafficChart`、`InterfaceSelector`、`InterfaceTrafficCard`、`TrafficSpeedMetrics`。                                                                                                                                                                                                                                                     |

---

### 3.6 `src/composables/` — 組合式函式（可重用邏輯）

| 檔案                                          | 用途                                                                                               |
| --------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| `useQisNavigation.ts`                         | **QIS 模式導航核心**：封裝各運作模式（RT / AP / RP / Mesh / WISP）的 postData 設定與頁面跳轉邏輯。 |
| `useQisSubmit.ts`                             | QIS 設定送出邏輯。                                                                                 |
| `useTheme.ts`                                 | 主題系統（依機種套用 ROG / ASUS 品牌色與深淺色）。                                                 |
| `useMenu.ts`                                  | 側邊選單建構。                                                                                     |
| `useChangeLanguage.ts` / `useLanguageList.ts` | 語言切換與語言清單。                                                                               |
| `useDialog.ts`                                | 對話框控制。                                                                                       |
| `useLoading.ts`                               | 全域載入狀態。                                                                                     |
| `usePolling.ts`                               | 輪詢機制（定時刷新即時資料）。                                                                     |
| `useReboot.ts`                                | 重新開機流程控制。                                                                                 |

`useReboot.ts` 範例：

```ts
import { useI18n } from "vue-i18n";
import { fetchHook } from "@/api/hook.api";
import { rebootDevice } from "@/api/reboot.api";
import useLoading from "@/composables/useLoading"; // ← Composable 可以呼叫另一個 Composable

export default function useReboot() {
  // ① 從其他 composable 取出需要的函式
  const { showLoading } = useLoading();
  const { t } = useI18n();

  // ② 定義業務邏輯
  const reboot = async () => {
    try {
      // Step 1：查路由器的預設重開機等待秒數
      const res = await fetchHook("get_default_reboot_time()");
      const { get_default_reboot_time } = res as {
        get_default_reboot_time: number;
      };

      // Step 2：送出重開機指令 → POST /apply.cgi
      await rebootDevice(get_default_reboot_time);

      // Step 3：顯示倒數 Loading（例如 60 秒）
      showLoading({
        message: t("REBOOTING"),
        waitSeconds: get_default_reboot_time,
      });
    } catch (error) {
      console.error("Error during reboot:", error);
    }
  };

  // ③ 回傳給元件使用
  return { reboot };
}
```

`reboot.api.ts` 範例：

```ts
export function rebootDevice(rebootTime: number = 60): Promise<void> {
  return http.post("/apply.cgi", {
    action_mode: "reboot",
    action_script: "",
    action_wait: rebootTime, // 告訴路由器等幾秒後重開
  });
}
```

`Header.vue` 中使用範例：

```vue
<script setup>
import useReboot from "@/composables/useReboot";
import useDialog from "@/composables/useDialog";
import { IconReboot } from "@/components/icons";
import { useI18n } from "vue-i18n";

const { t } = useI18n();
const { showDialog, dialogMessage, openDialog, handleConfirm } = useDialog();
const { reboot } = useReboot();

const i18nText = {
  rebootRemind: computed(() => t("REBOOT_REMIND_DESC_1")),
};
</script>
<template>
  <q-btn flat @click="openDialog(i18nText.rebootRemind.value, reboot)">
    <IconReboot :size="32" />
  </q-btn>
</template>
```

---

### 3.7 `src/layouts/` — 版面元件

| 檔案              | 用途                                               |
| ----------------- | -------------------------------------------------- |
| `Header.vue`      | 頂部標題列（Logo、選單切換、登出、重開機、語言）。 |
| `Navigation.vue`  | 左側功能導航抽屜。                                 |
| `RightDrawer.vue` | 右側抽屜（次要設定 / 資訊）。                      |

---

### 3.8 設定 / 常數 / 型別 / 工具 / 服務

| 資料夾           | 檔案                      | 用途                                                                                         |
| ---------------- | ------------------------- | -------------------------------------------------------------------------------------------- |
| `src/config/`    | `menu.ts`                 | 功能選單結構定義。                                                                           |
|                  | `iconMap.ts`              | 選單字串 → 圖示元件對照表。                                                                  |
| `src/constants/` | `qisPostDataTemplates.ts` | **QIS postData 模板常數**：各運作模式 / WAN 型態的預設設定物件（對應 legacy `qisData.js`）。 |
| `src/types/`     | `menu.ts`                 | 選單項目型別。                                                                               |
|                  | `papProfile.ts`           | AP 掃描檔案（PAP）型別。                                                                     |
| `src/services/`  | `logout.service.ts`       | 登出服務：呼叫 API 清 session + 重設狀態 + 導回首頁。                                        |
| `src/utils/`     | `index.ts`                | 工具函式統一匯出。                                                                           |
|                  | `qis.ts`                  | QIS 流程判斷工具。                                                                           |
|                  | `isSupport.ts`            | **判斷機種是否支援某功能**（讀 `rc_support`）。                                              |
|                  | `isSwMode.ts`             | 判斷目前運作模式（RT / AP / RP…）。                                                          |
|                  | `menuRules.ts`            | 選單顯示規則。                                                                               |
|                  | `sdnCompat.ts`            | SDN（軟體定義網路）相容性判斷。                                                              |
|                  | `validators.ts`           | 表單驗證（IP / 密碼 / 欄位）。                                                               |
|                  | `passwordScore.ts`        | 密碼強度計算。                                                                               |
|                  | `sha256.ts`               | SHA-256 雜湊（密碼處理）。                                                                   |
|                  | `randomString.ts`         | 隨機字串產生。                                                                               |
|                  | `debounce.ts`             | 防抖函式。                                                                                   |

---

### 3.9 `src/locales/` — 多國語系

| 內容                                                                                     | 用途                                                                                      |
| ---------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------- |
| `BR/CN/CZ/DA/DE/EN/ES/FI/FR/HU/IT/JP/KR/MS/NL/NO/PL/RO/RU/SL/SV/TH/TR/TW/UK.ts`（25 檔） | **各語言翻譯字串檔**（vue-i18n 使用），預設 TW，fallback EN。                             |
| `locales/dict/*.dict`（25 檔）                                                           | **Legacy 字典原始檔**：舊韌體的翻譯來源，由 `scripts/` 的注入腳本讀取後轉成上面的 `.ts`。 |

`src/locales/TW.ts` 範例：

```ts
// TW.ts
const base = {
  LOGIN: "登入",
  LOGOUT: "登出",
  LOGOUT_CONFIRM: "確定要登出嗎？",
  REBOOT: "重新開機",
  REBOOTING: "重新開機中...",
  PASSWORD: "密碼",
};
export default base;
```

`src/i18n.ts` 初始化設定

```ts
import { createI18n } from "vue-i18n";

// 自動掃描 locales/ 下所有 .ts → 不用手動 import 25 個
const modules = import.meta.glob("./locales/*.ts", { eager: true });

const messages = Object.fromEntries(
  Object.entries(modules).map(([path, module]) => {
    const locale = path.match(/\/([a-zA-Z_-]+)\.ts$/)![1]; // 'TW' / 'EN' / 'JP'...
    return [locale, module.default];
  }),
);

const i18n = createI18n({
  legacy: false,
  locale: "TW", // 預設繁中
  fallbackLocale: "EN", // 找不到 key 時 fallback 英文
  messages,
});

export default i18n;
```

```vue
<script setup>
import { useI18n } from "vue-i18n";
import { computed } from "vue";

const { t, locale } = useI18n();

// t('KEY') → 依目前語系回傳對應字串
t("LOGOUT"); // 繁中 → '登出' ／ 英文 → 'Logout'
t("LOGOUT_CONFIRM"); // 繁中 → '確定要登出嗎？'

// computed 包起來 → locale 切換時自動更新
const rebootTitle = computed(() => t("REBOOT"));
const rebootMessage = computed(() => t("REBOOT_REMIND_DESC_1"));
</script>

<template>
  <q-btn>{{ t("LOGOUT") }}</q-btn>

  <q-btn>{{ rebootTitle }}</q-btn>
  <q-tooltip>{{ rebootMessage }}</q-tooltip>
</template>
```

`切換語言`

```ts
import { useI18n } from "vue-i18n";
import { setNvram } from "@/api/nvram.api";

export default function useChangeLanguage() {
  const { locale } = useI18n({ useScope: "global" });

  const changeLanguage = (langCode: string) => {
    locale.value = langCode;
    setNvram({ action_mode: "apply", preferred_lang: langCode });
  };

  return { changeLanguage };
}
```

---

### 3.10 `src/assets/` — 靜態資源

| 內容                                                                   | 用途                                                                   |
| ---------------------------------------------------------------------- | ---------------------------------------------------------------------- |
| `main.css` / `base.css` / `button.css` / `qis.css` / `color-table.css` | 全域樣式表（基礎重置、按鈕、QIS、色彩表）。                            |
| `quasar-variables.scss`                                                | Quasar SASS 變數覆寫（品牌色）。                                       |
| `logo.svg`                                                             | 專案 Logo。                                                            |
| `fonts/`                                                               | 字型檔（Roboto、Roboto Condensed、ROG 專用字型 rogfonts / xolonium）。 |
| `images/dashboard/`（含 `aura/`）                                      | 儀表板圖片，特別是 Aura RGB 各種燈效的 SVG。                           |
| `images/qis/`                                                          | QIS 流程插圖（數據機接線、AiMesh 拓樸、密碼強度漸層等）。              |
| `images/game_acceleration/`                                            | 電競加速圖（網易 UU、Outfox、GT Booster banner）。                     |
| `images/traffic_analyzer/` / `images/traffic_monitor/`                 | 流量相關圖示（上/下行箭頭、刪除）。                                    |
| `images/theme/`                                                        | 主題背景圖（ROG 深淺色背景）。                                         |

---

## 四、測試與工具腳本

### 4.1 `e2e/` — Playwright 端對端測試

| 內容              | 用途                                                                                                                       |
| ----------------- | -------------------------------------------------------------------------------------------------------------------------- |
| `*.spec.ts`       | 測試案例：`login`、`dashboard`、`dashboard-mock`、`layout`、`game-acceleration`、`qis-four-mode`、`qis-full-flow`、`vue`。 |
| `pages/*.page.ts` | **Page Object 模式**：把頁面操作封裝成物件（`login` / `dashboard` / `gameAcceleration` / `qis`），測試碼更易讀。           |
| `tsconfig.json`   | E2E 專用 TS 設定。                                                                                                         |

> 補充：各原始碼資料夾內的 `__tests__/`（或 `__test__/`）放的是 **Vitest 單元測試**，與被測檔案相鄰，涵蓋 api、stores、composables、utils、components、views、layouts、router。

### 4.2 `scripts/` — 一次性建置工具

| 檔案                                   | 用途                                                      |
| -------------------------------------- | --------------------------------------------------------- |
| `inject-dashboard-locales.mjs`         | 把儀表板所需字串從 legacy `.dict` 注入到 `locales/*.ts`。 |
| `inject-game-acceleration-locales.mjs` | 同上，電競加速字串。                                      |
| `inject-traffic-analyzer-locales.mjs`  | 同上，流量分析字串。                                      |
| `inject-traffic-monitor-locales.mjs`   | 同上，即時流量字串。                                      |

### 4.3 `public/`

| 檔案          | 用途                                   |
| ------------- | -------------------------------------- |
| `favicon.ico` | 網站圖示，建置時原樣複製到輸出根目錄。 |

---

## 五、整體資料流（簡報重點圖解）

```
使用者操作
    │
    ▼
 views / components （畫面）
    │  呼叫
    ▼
 composables （可重用邏輯，如 useQisNavigation）
    │  讀寫
    ▼
 stores (Pinia) ──► parsers （把原始字串解析成型別物件）
    │  發送請求
    ▼
 api/module ──► api/core/http（Axios + 4 個攔截器）
    │
    ├─ 正式：proxy / 同源 ──► 路由器 CGI（appGet.cgi / applyapp.cgi）
    └─ 開發無後端：mock.plugin ──► api/mock 假資料
```

---
