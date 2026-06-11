---
title: computed
---

# 計算屬性 (Computed Properties)

## 基礎範例

我們推薦使用**計算屬性 (computed properties)** 來描述依賴於響應式狀態的複雜邏輯。這是一個範例：

```vue
<script setup>
import { reactive, computed } from 'vue'

const author = reactive({
  name: 'John Doe',
  books: [
    'Vue 2 - Advanced Guide',
    'Vue 3 - Basic Guide',
    'Vue 4 - The Mystery'
  ]
})

// 計算屬性 ref
const publishedBooksMessage = computed(() => {
  return author.books.length > 0 ? 'Yes' : 'No'
})
</script>

<template>
  <p>Has published books:</p>
  <span>{{ publishedBooksMessage }}</span>
</template>
```

在這裡我們宣告了一個計算屬性 `publishedBooksMessage`。`computed()` 預期接收一個 getter 函式，而它會回傳一個包含計算結果的 ref 物件。

## 計算屬性快取 vs. 方法

你可能注意到我們可以透過呼叫方法來達成相同的結果：

```html
<p>{{ calculateBooksMessage() }}</p>
```

```js
// 在元件中
function calculateBooksMessage() {
  return author.books.length > 0 ? 'Yes' : 'No'
}
```

結果完全相同。然而，不同之處在於**計算屬性會基於其響應式依賴進行快取**。計算屬性只會在其響應式依賴改變時才會重新求值。這代表只要 `author.books` 沒有改變，多次存取 `publishedBooksMessage` 會立即回傳之前計算好的結果，而不需要再次執行 getter 函式。

## 可寫入的計算屬性

計算屬性預設是唯讀的。當你嘗試修改一個計算屬性時，你會收到一個執行階段的警告。但在某些情況下，你可能會需要一個「可寫入」的計算屬性。你可以透過同時提供 getter 和 setter 來建立它：

```vue
<script setup>
import { ref, computed } from 'vue'

const firstName = ref('John')
const lastName = ref('Doe')

const fullName = computed({
  // getter
  get() {
    return firstName.value + ' ' + lastName.value
  },
  // setter
  set(newValue) {
    // 注意：這裡使用解構賦值語法
    [firstName.value, lastName.value] = newValue.split(' ')
  }
})
</script>
```
