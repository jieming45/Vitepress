---
title: component basics
---

# 元件基礎 (Component Basics)

元件允許我們將 UI 劃分為獨立、可重複使用的部分，並且可以對每個部分進行單獨的思考。在實際的應用中，通常元件會組織成一個巢狀的元件樹：

這非常類似於我們將 HTML 元素嵌套的方式，只不過 Vue 實現了自己的自定義元件模型，這允許我們在每個元件中封裝自定義內容與邏輯。

## 定義一個元件

當使用構建步驟時，我們通常在名為**單一元件檔 (Single-File Component, SFC)** 的獨立檔案中定義每個 Vue 元件，副檔名為 `.vue`：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)
</script>

<template>
  <button @click="count++">You clicked me {{ count }} times.</button>
</template>
```

如果不使用構建步驟，一個 Vue 元件可以定義為一個包含 Vue 特有選項的單純 JavaScript 物件：

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)
    return { count }
  },
  template: `
    <button @click="count++">
      You clicked me {{ count }} times.
    </button>`
}
```

## 使用一個元件

要使用一個子元件，我們需要在父元件中將其引入。假設我們把前一個計數器元件命名為 `ButtonCounter.vue`，並放在同一個資料夾底下。

在使用 `<script setup>` 的情況下，匯入的元件就可以直接在模板中使用：

```vue
<script setup>
import ButtonCounter from './ButtonCounter.vue'
</script>

<template>
  <h1>Here is a child component!</h1>
  <ButtonCounter />
</template>
```

元件可以被重複使用任意多次。每次使用元件都會建立該元件的一個新**實例**。

```vue-html
<h1>Here are many child components!</h1>
<ButtonCounter />
<ButtonCounter />
<ButtonCounter />
```

## 傳遞 Props

如果我們正在打造一個部落格，我們可能需要一個元件來表示單篇貼文。我們希望所有的貼文能共用相同的視覺佈局，但每個貼文都需要呈現不同的內容。這就是 **props** 派上用場的時候。

Props 是一種可以註冊在元件上的自定義屬性。要將屬性傳遞給我們的部落格貼文元件，我們必須首先在使用 `<script setup>` 的情況下，透過 `defineProps` 巨集宣告它接受哪些 props：

```vue
<!-- BlogPost.vue -->
<script setup>
defineProps(['title'])
</script>

<template>
  <h4>{{ title }}</h4>
</template>
```

一旦在元件中宣告了一個 prop，該 prop 就可以在元件的模板中使用。同時，我們也可以像傳遞 HTML 屬性一樣，將資料傳遞給這個自定義屬性：

```html
<BlogPost title="My journey with Vue" />
<BlogPost title="Blogging with Vue" />
<BlogPost title="Why Vue is so fun" />
```

## 監聽事件

隨著我們部落格的開發，貼文可能會需要和父元件進行溝通。例如，我們決定要在每個貼文中加入一個能放大字體的按鈕，同時保持頁面其他部分的大小不變。

為了解決這個問題，元件可以透過其內建的 `$emit` 方法拋出自定義事件。

在子元件中：

```html
<!-- BlogPost.vue -->
<button @click="$emit('enlarge-text')">Enlarge text</button>
```

在父元件中，我們可以像監聽原生 DOM 事件一樣使用 `v-on` 或 `@` 監聽這個事件：

```html
<BlogPost
  ...
  @enlarge-text="postFontSize += 0.1"
 />
```

我們可以透過 `defineEmits` 巨集選擇性地宣告一個元件會拋出的事件：

```vue
<script setup>
defineEmits(['enlarge-text'])
</script>
```

## 透過插槽 (Slots) 散發內容

如同原生的 HTML 元素一樣，將內容傳遞進一個元件是很有用的，像這樣：

```html
<AlertBox>
  Something bad happened.
</AlertBox>
```

這可以透過使用 Vue 內建的 `<slot>` 元素達成：

```vue
<!-- AlertBox.vue -->
<template>
  <div class="demo-alert-box">
    <strong>Error!</strong>
    <slot></slot>
  </div>
</template>
```
