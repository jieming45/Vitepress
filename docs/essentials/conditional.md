---
title: conditional
---

# 條件渲染

## `v-if`

`v-if` 指令用來根據表達式的真假值，來有條件地渲染一個區塊。該區塊只有在指令表達式回傳真值時兩會被渲染。

```html
<h1 v-if="awesome">Vue is awesome!</h1>
```

## `v-else`

你可以使用 `v-else` 指令來表示 `v-if` 的一個「else 區塊」：

```html
<button @click="awesome = !awesome">Toggle</button>

<h1 v-if="awesome">Vue is awesome!</h1>
<h1 v-else>Oh no 😢</h1>
```

`v-else` 元素必須緊跟在 `v-if` 或 `v-else-if` 元素之後，否則它將無法被識別。

## `v-else-if`

`v-else-if`，顧名思義，充當 `v-if` 的「else-if 區塊」。它可以被連續使用多次：

```html
<div v-if="type === 'A'">
  A
</div>
<div v-else-if="type === 'B'">
  B
</div>
<div v-else-if="type === 'C'">
  C
</div>
<div v-else>
  Not A/B/C
</div>
```

與 `v-else` 類似，`v-else-if` 元素必須緊跟在 `v-if` 或另一個 `v-else-if` 元素之後。

## `<template>` 上的 `v-if`

因為 `v-if` 是一個指令，所以它必須綁定在一個元素上。但是，如果我們想要切換多個元素呢？在這種情況下，我們可以在一個 `<template>` 元素上使用 `v-if`，它可作為一個不可見的包裹元素。最終的渲染結果將不會包含這個 `<template>` 元素。

```html
<template v-if="ok">
  <h1>Title</h1>
  <p>Paragraph 1</p>
  <p>Paragraph 2</p>
</template>
```

## `v-show`

另一個用於條件渲染元素的選項是 `v-show` 指令。用法幾乎相同：

```html
<h1 v-show="ok">Hello!</h1>
```

不同之處在於，帶有 `v-show` 的元素將始終被渲染並保留在 DOM 中。`v-show` 只是切換該元素的 CSS `display` 屬性。

`v-show` 不支援 `<template>` 元素，也不能與 `v-else` 一起使用。

## `v-if` vs. `v-show`

`v-if` 是「真正的」條件渲染，因為它確保在條件切換的過程中，條件區塊內的事件監聽器和子元件會被適當地銷毀並重建。

`v-if` 也是**惰性 (lazy)** 的：如果在初始渲染時條件為假，它就什麼都不做，直到條件第一次變為真時，才會開始渲染條件區塊。

相比之下，`v-show` 就簡單得多：元素始終會被渲染，只是基於 CSS 進行切換。

通常來說，`v-if` 有較高的切換成本，而 `v-show` 有較高的初始渲染成本。因此，如果你需要非常頻繁地切換，請優先使用 `v-show`；如果條件在執行時不太可能改變，則優先使用 `v-if`。
