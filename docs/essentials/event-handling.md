---
title: event handling
---

# 事件處理

## 監聽事件

我們可以使用 `v-on` 指令 (通常縮寫為 `@` 符號) 來監聽 DOM 事件，並在事件觸發時執行 JavaScript。用法為 `v-on:click="handler"` 或是 `@click="handler"`。

事件處理器 (handler) 的值可以是：

1. **行內處理器 (Inline handlers)**：當事件觸發時執行的行內 JavaScript (類似於原生 `onclick` 屬性)。
2. **方法處理器 (Method handlers)**：一個指向元件上定義的方法的屬性名稱或路徑。

## 行內處理器

行內處理器通常用於簡單的情境：

```js
const count = ref(0)
```

```html
<button @click="count++">Add 1</button>
<p>Count is: {{ count }}</p>
```

## 方法處理器

許多事件處理器的邏輯會很複雜，無法直接以行內處理器的方式撰寫。因此，`v-on` 也可以接受一個元件方法的名稱或路徑。

```vue
<script setup>
import { ref } from 'vue'

const name = ref('Vue.js')

function greet(event) {
  alert(`Hello ${name.value}!`)
  // `event` 是原生 DOM 事件
  if (event) {
    alert(event.target.tagName)
  }
}
</script>

<template>
  <!-- `greet` 是上方定義的方法名稱 -->
  <button @click="greet">Greet</button>
</template>
```

## 在行內處理器中存取事件參數

有時候我們需要在行內處理器中存取原生的 DOM 事件。你可以將一個特殊的 `$event` 變數傳入方法中，或是使用內聯箭頭函式：

```html
<!-- 使用特殊的 $event 變數 -->
<button @click="warn('Form cannot be submitted yet.', $event)">
  Submit
</button>

<!-- 使用內聯箭頭函式 -->
<button @click="(event) => warn('Form cannot be submitted yet.', event)">
  Submit
</button>
```

## 事件修飾符

在處理事件時呼叫 `event.preventDefault()` 或 `event.stopPropagation()` 是很常見的需求。雖然我們可以在方法內部輕鬆完成，但如果方法能單純處理資料邏輯，而不需去處理 DOM 事件細節會更好。

為了解決這個問題，Vue 為 `v-on` 提供了**事件修飾符 (Event Modifiers)**。修飾符是以點 (dot) 開頭的後綴：

- `.stop`
- `.prevent`
- `.self`
- `.capture`
- `.once`
- `.passive`

```html
<!-- 停止點擊事件冒泡 -->
<a @click.stop="doThis"></a>

<!-- 提交事件不再重新載入頁面 -->
<form @submit.prevent="onSubmit"></form>

<!-- 修飾符可以串連 -->
<a @click.stop.prevent="doThat"></a>
```

## 按鍵修飾符

在監聽鍵盤事件時，我們經常需要檢查特定的按鍵。Vue 允許在監聽 `v-on` 或 `@` 的鍵盤事件時，加入按鍵修飾符：

```html
<!-- 只有在 `key` 為 `Enter` 時呼叫 `submit` -->
<input @keyup.enter="submit" />
```
