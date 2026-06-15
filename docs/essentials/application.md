---
title: application
---

# 建立一個 Vue 應用程式

## 應用程式實例

每個 Vue 應用程式都是透過 `createApp` 函式建立一個新的**應用程式實例 (application instance)** 開始的：

```js
import { createApp } from 'vue'

const app = createApp({
  /* 根元件的選項 */
})
```

## 根元件

我們傳遞給 `createApp` 的物件實際上是一個元件。每個應用程式都需要一個「根元件」，它可以包含其他子元件。
如果你使用的是單一元件檔 (SFC)，我們通常會從另一個檔案匯入根元件：

```js
import { createApp } from 'vue'
// 從一個單一元件檔匯入根元件
import App from './App.vue'

const app = createApp(App)
```

## 掛載應用程式

應用程式實例必須在呼叫其 `.mount()` 方法後才會被渲染出來。它接收一個「容器」參數，可以是一個實際的 DOM 元素，或是 CSS 選擇器字串：

```html
<div id="app"></div>
```

```js
app.mount('#app')
```

`.mount()` 方法應該永遠在整個應用程式設定與資產註冊完成後被呼叫。同時請注意，它的回傳值與多數會回傳應用程式實例本身的方法不同，它回傳的是根元件的實例。

## 應用程式配置

應用程式實例提供了一個 `.config` 物件，允許我們設定一些應用程式層級的選項，例如定義一個全域的錯誤處理函式，以捕捉所有子元件中的錯誤：

```js
app.config.errorHandler = (err) => {
  /* 處理錯誤 */
}
```

應用程式實例也提供了一些註冊全域資源的方法。例如，註冊一個所有元件皆可使用的全域元件：

```js
app.component('TodoDeleteButton', TodoDeleteButton)
```

## 多個應用程式實例

`createApp` API 讓多個 Vue 應用程式可以存在同一個頁面上，每個應用程式都有各自獨立的範圍和設定：

```js
const app1 = createApp({
  /* ... */
})
app1.mount('#container-1')

const app2 = createApp({
  /* ... */
})
app2.mount('#container-2')
```

如果你使用 Vue 來增強由伺服器渲染 HTML 並只需讓特定的區塊具備互動能力，就可以建立多個小的應用程式實例掛載到所需的元素上。
