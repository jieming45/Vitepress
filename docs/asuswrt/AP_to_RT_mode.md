# Role

你是一位資深的 Vue.js 架構師，專精於 Vue 3、Quasar (v2+)、Vite 與 TypeScript。你擅長維護大型專案的 CSS 架構，堅持「組件封裝 (Encapsulation)」與「代碼重用性 (Reusability)」的原則。

# Context

我們正在重構舊版 Web UI 到現代化架構。

- 專案架構: Vue 3 (Composition API) + Quasar + Vite。
- 目標區域: `views/qis/*.vue` 系列頁面。
- 痛點: 目前的 QIS Advanced Settings中，當我選擇從Access Point mode轉換回Router mode，會看到我的LAN IP address(br0) 是先前Access Point mode的IP，而不是原本預期的192.168.50.1，也就是subnet mask無效

- **目標檔案 (Target):** `C:/Users/Jieming/Documents/GitHub/vue3-wrt-project/packages/shared/src/views/qis/*.vue`

### 目錄結構

src/
components/qis/
views/qis/
QisWizard.vue

Legacy Project folder
C:\Users\Jieming\Desktop\GT-BE98_PRO

# Objective

1. 新分析C:\Users\Jieming\Desktop\GT-BE98_PRO\QIS_Wizard.htm 整體的運作架構，以及需要用到的檔案與參數
2. 在 `vue3-wrt-project` 中實作 Access Point mode轉換回Router mode 轉換時需要設定的nvram參數詳細檢查確認是否有缺少未設定到的，目前遇到Access Point mode 切換回Router mode，IP Address後還是維持先前Acccess Point 的IP，subnet 沒有更換、IP address 沒有更新(預期是192.168.50.1)，導致網路不通
   Advanced Settings Access Point mode下選擇 Router mode，WAN type 選擇第一組WAN Port，WAN protocol選擇DHCP (不選DHCP選項)
   SSID: 2.4 GHz: ASUS_Jieming_BE98_PRO
   SSID: 5 GHz: ASUS_Jieming_BE98_PRO_5G
   SSID: 6 GHz-1: ASUS_Jieming_BE98_PRO_6G-1
   SSID: 6 GHz-2: ASUS_Jieming_BE98_PRO_6G-2

3. 同樣的情況，詳細檢查Router mode 切換到Access Point mode，有哪些nvram 參數需要設定，避免切換後運作有錯誤
4. 參考C:\Users\Jieming\Desktop\GT-BE98_PRO\QIS_Wizard.htm 以及C:\Users\Jieming\Desktop\GT-BE98_PRO\mobile\* legacy 專案整體參數，並且移植到新專案vue3-wrt-project

# Constraints

1. 實作策略: 參考C:\Users\Jieming\Desktop\GT-BE98_PRO\QIS_Wizard.htm，以及C:\Users\Jieming\Desktop\GT-BE98_PRO\mobile\* legacy 專案，整體參數。根據這些legacy 專案的參數移植到vue3-wrt-project
2. 相容性: 確保在 iOS/Android (Chrome/Safari) 及桌面瀏覽器上有 100% 的一致性。
3. 可維護性: nvram參數統一在 vue3-wrt-project\packages\shared\src\stores\qisPostData.ts 儲存

# Instructions & Deliverables

1. **架構說明**: 根據分析的C:\Users\Jieming\Desktop\GT-BE98_PRO\QIS_Wizard.htm 架構與參數，將正確的需要設定的流程與參數搬移到vue3-wrt-project/packages/shared/src/views/QIS_wizard.vue
2. **參數儲存**: 根據分析的C:\Users\Jieming\Desktop\GT-BE98_PRO\QIS_Wizard.htm 參數，將正確的需要設定的的參數儲存到vue3-wrt-project/packages/shared/src/stores/qisPostData.ts
3. **Refactoring**: 根據GT-BE98_PRO/QIS_wizard.htm，如果.js 的function 有共用，則先統一存放在src/qis.js
