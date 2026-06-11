---
title: lifecycle
---

# 生命週期鉤子 (Lifecycle Hooks)

每個 Vue 元件實例在建立時都會經歷一系列的初始化步驟 —— 例如，它需要設置資料觀察、編譯模板、將實例掛載至 DOM，並且在資料變化時更新 DOM。在這一路上，它也會執行稱為**生命週期鉤子 (lifecycle hooks)** 的函式，讓開發者有機會在特定階段加入自己的程式碼。

## 註冊生命週期鉤子

例如，`onMounted` 鉤子可以用來在元件完成初始渲染並建立 DOM 節點之後執行程式碼：

```vue
<script setup>
import { onMounted } from 'vue'

onMounted(() => {
  console.log(`the component is now mounted.`)
})
</script>
```

還有其他許多可以在元件實例生命週期的不同階段被呼叫的鉤子，最常用的包含 `onMounted`、`onUpdated` 和 `onUnmounted`。

當你呼叫像 `onMounted` 這樣的生命週期鉤子時，Vue 會自動將該回呼函式與當前活躍的元件實例相關聯。這表示這些鉤子**必須在元件 `setup()` 執行期間同步註冊**。例如，請不要在 `setTimeout` 的回呼中呼叫生命週期鉤子：

```js
// 這樣會失敗
setTimeout(() => {
  onMounted(() => {
    // 這裡有些代碼
  })
}, 100)
```

請注意，生命週期鉤子不需要一定要在 `setup()` 內部文法層面被呼叫。只要調用棧是同步在 `setup()` 內部觸發，它們也可以在外部函式中被呼叫。

## 生命週期圖示

下面是元件實例生命週期的圖示。目前你不需要完全理解圖中的所有內容，但隨著你學習與開發進度的增加，它將成為一個有用的參考。

![Component lifecycle diagram](https://vuejs.org/assets/lifecycle.16e4c08e.png)

*(注意：上圖來自 Vue 的官方文檔。)*
