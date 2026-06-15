# Pinia 狀態管理基本概念

在 Vue 3 專案中，我們使用 [Pinia](https://pinia.vuejs.org/) 來做全域的狀態管理。
相較於過去的 Vuex，Pinia 提供了更直覺的 Composition API (Setup Store) 寫法，並且對 TypeScript 有極佳的支援。

以下我們從專案中的 `auth.store.ts` 簡化出一個基本的範例來說明其核心概念。

## 基礎範例 (`auth.store.ts`)

```typescript
import { defineStore } from 'pinia';
import { ref } from 'vue';

// 1. 定義 Store：第一個參數是整個應用中唯一的 ID (這裡為 'auth')，第二個參數是 setup 函式
export const useAuthStore = defineStore('auth', () => {
    
    // 2. State (狀態)：使用 Vue 的 ref 或 reactive 來定義資料
    const isAuthenticated = ref(false);
    
    // 3. Actions (動作/方法)：定義一般的 function，用來處理邏輯與修改 State (支援同步與非同步)
    function logout() {
        isAuthenticated.value = false;
    }
    
    async function login(username, password) {
        // ... 實作呼叫登入 API 的邏輯 ...
        isAuthenticated.value = true;
    }

    // 4. 回傳 (Return)：將需要在外部元件中使用的 State 與 Actions 暴露出去
    return { isAuthenticated, login, logout };
});
```

## 核心概念對照

在 Composition API (Setup Store) 的寫法中，Pinia 的核心概念可以簡單對應到我們熟悉的 Vue 3 API：

*   **`ref()` / `reactive()`** 對應到 Pinia 的 **`State`** (存放資料的地方)。
*   **`computed()`** 對應到 Pinia 的 **`Getters`** (基於 State 衍生計算出來的狀態，本例省略)。
*   **`function()`** 對應到 Pinia 的 **`Actions`** (修改資料或處理非同步邏輯的方法)。

## 在元件中如何使用？

在 Vue 元件中，只需引入定義好的 store 並呼叫它，就可以像一般的物件一樣直接存取裡面的變數與方法。

```vue
<script setup lang="ts">
import { useAuthStore } from '@/stores/auth.store';

// 實例化 Store
const authStore = useAuthStore();

// 呼叫 action
const handleLogout = () => {
    authStore.logout(); // 會將 authStore.isAuthenticated 改為 false
};
</script>

<template>
    <!-- 直接在模板綁定 Store 的 State -->
    <div v-if="authStore.isAuthenticated">
        您已登入！ <button @click="handleLogout">登出</button>
    </div>
</template>
```

簡而言之，Pinia 就是讓我們可以把共用的變數與邏輯抽離到一個獨立的檔案中，並在任何需要它的 Vue 元件內自由且安全的取用。
