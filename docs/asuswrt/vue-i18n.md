# Vue-i18n 多國語系處理方式與操作指南

在 `vue3-wrt-project` 中，為了實現與 ASUS 路由器原生多國語系功能的接軌，並確保開發體驗與效能的最佳化，專案採用了 `vue-i18n` (v9+) 搭配 Vue 3 的 Composition API 進行處理。

以下詳細說明語系的處理方式、運作原理以及開發者的操作指南。

## 1. 核心架構與運作原理

### 1.1 初始化與配置
語系實體的核心設定檔位於 `packages/shared/src/i18n.ts`：

```typescript
import { createI18n } from 'vue-i18n';

// 透過 Vite 內建的 import.meta.glob 自動載入所有語系檔
const modules = import.meta.glob<{ default: Record<string, string> }>('./locales/*.ts', { eager: true });

// 將模組檔名轉換為 i18n 認可的 messages 物件
const messages: Record<string, Record<string, string>> = Object.fromEntries(
    Object.entries(modules).map(([path, module]) => {
        const locale = path.match(/\/([a-zA-Z_-]+)\.ts$/)![1];
        return [locale, module.default];
    }),
);

const i18n = createI18n({
    legacy: false,          // 關閉 Options API 模式，全面採用 Composition API
    locale: 'TW',           // 預設語系
    fallbackLocale: 'EN',   // 降級回退語系
    messages,               // 自動載入的翻譯訊息字典
});

export default i18n;
```

**運作原理重點：**
- **禁用 Legacy 模式 (`legacy: false`)**: 完全擁抱 Vue 3 的 Composition API。這意味著在組件中，我們不再使用 `this.$t`，而是必須透過 `useI18n()` 取得 `t` 函數。
- **自動化載入 (`import.meta.glob`)**: 藉由 Vite 的功能，開發者只要在 `locales` 目錄下新增如 `FR.ts` 的檔案，系統就會自動將其註冊為可用語系，無需手動去 `i18n.ts` 內 `import`。

### 1.2 語系打包與 Vite 效能優化
雖然 `import.meta.glob` 使用了 `{ eager: true }` 來確保初始化時所有語系字典立即可用，但為了避免首屏載入過多無用的 JavaScript 代碼，專案在 `apps/web/vite.config.ts` 的 `manualChunks` 中做了特殊優化：

```typescript
// vite.config.ts 節錄
manualChunks(id) {
    // 將語系檔統一打包為 locales chunk
    if (id.includes('/locales/') && !id.includes('/locales/dict/')) {
        return 'locales';
    }
}
```
透過打包策略，所有 `locales/*.ts` 會被獨立編譯成單獨的 Chunk，使得主要的業務邏輯代碼不會與龐大的語言包混雜在一起，提高瀏覽器緩存效率與載入速度。

---

## 2. 開發與操作指南

### 2.1 新增或修改翻譯字串
所有語系檔統一放置在 `packages/shared/src/locales/` 目錄底下。
檔案以地區代碼命名，例如 `TW.ts`、`EN.ts`、`CN.ts`。

**範例：修改 `TW.ts`**
```typescript
const base = {
    LOGIN: `登入`,
    LOGOUT: `登出`,
    PASSWORD: `密碼`,
    // 在此加入新的翻譯 Key...
    NEW_FEATURE_TITLE: `新功能標題`,
};
export default base;
```
> **規範**：翻譯 Key 請一律使用大寫及底線 (MACRO_CASE)，以確保團隊代碼的一致性。

### 2.2 在 Vue 組件中使用 (Composition API)
在 `<script setup>` 中，我們必須先引入 `useI18n`。

```html
<template>
  <div>
    <!-- 模板中直接呼叫 t() -->
    <h1>{{ t('LOGIN') }}</h1>
    <p>{{ t('NEW_FEATURE_TITLE') }}</p>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n';

// 取得 t 函數 (負責翻譯)
const { t } = useI18n();

// 可以在 script 內處理邏輯
const handleLogin = () => {
    console.log(t('LOGIN_SUCCESS'));
};
</script>
```

### 2.3 動態切換系統語系
當使用者從介面切換語言時，可以藉由 `useI18n` 拿到的 `locale` 變數來更改當前語系。

> **注意**：若要在獨立的 Composable (例如 `useChangeLanguage.ts`) 內改變「全域」語系，請務必在調用時加上 `{ useScope: 'global' }`。

**範例：`useChangeLanguage.ts`**
```typescript
import { useI18n } from 'vue-i18n';

export function useChangeLanguage() {
    // 取得全域的 locale ref
    const { locale } = useI18n({ useScope: 'global' });

    const changeLang = (langCode: string) => {
        // 直接修改 locale.value 即可觸發畫面全域重繪
        locale.value = langCode;
        
        // (可選) 也可以在這裡同步打 API 告訴硬體設備語系已變更
        // api.applyApp({ action_mode: 'change_lang', lang: langCode });
    };

    return { changeLang };
}
```

---

## 3. 測試環境 (Vitest) 中的處理

在撰寫單元測試時，若是測試到有引用 `vue-i18n` 的組件或 Composable，為了避免測試拋出 Injection 錯誤或依賴實際的翻譯包，我們通常會在測試檔的頂部 Mock 掉 `useI18n`：

```typescript
import { vi } from 'vitest';

// 模擬 vue-i18n，讓 t 函數直接回傳 Key 本身，便於斷言
vi.mock('vue-i18n', () => ({
    useI18n: () => ({
        t: (key: string) => key,
        locale: { value: 'TW' }
    }),
}));
```
這樣在驗證畫面渲染時，我們只需要斷言畫面上是否有印出大寫的 Key (例如 `expect(wrapper.text()).toContain('LOGIN')`)，不僅能加速測試執行，也能降低測試對語系檔案的耦合。

---

## 4. 最佳實踐建議

1. **模組化字典管理**: 若未來設備支援的語系單字量暴增，可以考慮將單一巨大 `.ts` 拆分為以功能模組分類的 JSON 檔，並藉由 Vite 外掛於 build 階段自動合併。
2. **避免在 Template 寫死中文字**: 由於 WRT 設備會面向全球出貨，強烈建議開發新功能時「先寫 Key，再補字」，並養成隨手修改 `EN.ts` 與 `TW.ts` 的好習慣。
3. **保持與舊系統字典同步**: 硬體內部可能有一份遺留的字典檔 (`dict`)。專案可考慮寫腳本定時從硬體撈取 `dict` 轉化為 `.ts`，或是透過 Webpack/Vite External 屬性讓這些動態字典在 Runtime 即時載入，避免前端包體積過大。