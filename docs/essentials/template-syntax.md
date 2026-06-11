---
title: template syntax
---

# 模板語法

Vue 使用基於 HTML 的模板語法，允許你宣告式地將渲染的 DOM 與底層元件實例的資料綁定在一起。所有的 Vue 模板都是語法正確的 HTML，可以被符合規範的瀏覽器和 HTML 解析器解析。

在底層，Vue 將模板編譯成高度優化的 JavaScript 程式碼。結合響應式系統，Vue 能夠聰明地找出最少數量的元件進行重新渲染，並在應用程式狀態改變時，將 DOM 的操作降至最低。

## 文本插值

最基礎的資料綁定形式是使用「Mustache」語法 (雙大括號) 的文本插值：

```html
<span>Message: {{ msg }}</span>
```

大括號內的標籤將被替換為對應元件實例中的 `msg` 屬性值。它也會在 `msg` 屬性更改時同步更新。

## 原始 HTML

雙大括號會將資料解釋為純文字，而非 HTML。如果你想要輸出真正的 HTML，你需要使用 `v-html` 指令：

```html
<p>Using text interpolation: {{ rawHtml }}</p>
<p>Using v-html directive: <span v-html="rawHtml"></span></p>
```

:::warning 安全性警告
在網站上動態渲染任意的 HTML 可能是非常危險的，因為這很容易導致 [XSS 攻擊](https://en.wikipedia.org/wiki/Cross-site_scripting)。請只在受信任的內容上使用 `v-html`，**永遠不要**使用在使用者提供的內容上。
:::

## 屬性綁定

雙大括號不能在 HTML 屬性 (attributes) 中使用。此時應使用 `v-bind` 指令：

```html
<div v-bind:id="dynamicId"></div>
```

由於 `v-bind` 非常常用，它有專屬的簡寫語法：

```html
<div :id="dynamicId"></div>
```

### 布林屬性

布林屬性是一旦存在於元素上，就代表其值為 true 的屬性，例如 `disabled`：

```html
<button :disabled="isButtonDisabled">Button</button>
```

如果 `isButtonDisabled` 具有真值 (truthy value)，或是空字串，則 `disabled` 屬性將會被包含。如果是其他假值 (falsy values)，則該屬性會被省略。

## 使用 JavaScript 表達式

到目前為止，我們僅綁定了簡單的屬性鍵。但 Vue 實際上支援所有資料綁定內完整的 JavaScript 表達式：

```html
{{ number + 1 }}

{{ ok ? 'YES' : 'NO' }}

{{ message.split('').reverse().join('') }}

<div :id="`list-${id}`"></div>
```

這些表達式將作為 JavaScript，在當前元件實例的作用域中被求值。

## 指令 (Directives)

指令是帶有 `v-` 前綴的特殊屬性。Vue 內建了多個指令，包括我們先前見過的 `v-html` 和 `v-bind`。

一個指令屬性值預期會是一個單一的 JavaScript 表達式 (除了一些我們後續會討論的例外，如 `v-for`、`v-on` 和 `v-slot`)。指令的職責是，當其表達式的值改變時，響應式地對 DOM 進行更新。

```html
<p v-if="seen">Now you see me</p>
```

這裡的 `v-if` 指令會根據表達式 `seen` 的真假值來移除或插入 `<p>` 元素。

### 參數 (Arguments)

有些指令可以接受一個「參數」，在指令名稱之後以冒號 (:) 表示。例如，`v-bind` 指令被用來響應式地更新一個 HTML 屬性：

```html
<a v-bind:href="url"> ... </a>

<!-- 簡寫 -->
<a :href="url"> ... </a>
```

另一個範例是 `v-on` 指令，它監聽 DOM 事件：

```html
<a v-on:click="doSomething"> ... </a>

<!-- 簡寫 -->
<a @click="doSomething"> ... </a>
```

### 動態參數

也可以在指令參數中使用 JavaScript 表達式，只要用方括號將其包起：

```html
<a v-bind:[attributeName]="url"> ... </a>

<!-- 簡寫 -->
<a :[attributeName]="url"> ... </a>
```

### 修飾符 (Modifiers)

修飾符是以小數點 (.) 結尾的特殊後綴，用來表示指令應以某種特殊方式綁定。例如，`.prevent` 修飾符告訴 `v-on` 指令在觸發事件時呼叫 `event.preventDefault()`：

```html
<form @submit.prevent="onSubmit">...</form>
```
