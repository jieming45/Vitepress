---
title: list
---

# 列表渲染

## `v-for`

我們可以使用 `v-for` 指令基於一個陣列來渲染一個列表。`v-for` 指令需要使用 `item in items` 形式的特殊語法，其中 `items` 是來源資料陣列，而 `item` 則是迭代的陣列元素別名：

```js
const items = ref([{ message: 'Foo' }, { message: 'Bar' }])
```

```html
<li v-for="item in items">
  {{ item.message }}
</li>
```

在 `v-for` 區塊中，我們可以完整存取父作用域的屬性。`v-for` 也支援可選的第二個參數，用來表示當前項目的索引：

```html
<li v-for="(item, index) in items">
  {{ parentMessage }} - {{ index }} - {{ item.message }}
</li>
```

你也可以使用 `of` 代替 `in` 作為分隔符號，它更接近 JavaScript 的迭代器語法：

```html
<div v-for="item of items"></div>
```

## `v-for` 與物件

你也可以使用 `v-for` 來遍歷一個物件的屬性。迭代順序將基於呼叫 `Object.keys()` 的結果：

```js
const myObject = reactive({
  title: 'How to do lists in Vue',
  author: 'Jane Doe',
  publishedAt: '2016-04-10'
})
```

```html
<ul>
  <li v-for="value in myObject">
    {{ value }}
  </li>
</ul>
```

你可以提供第二個參數作為屬性名稱 (即 key)：

```html
<li v-for="(value, key) in myObject">
  {{ key }}: {{ value }}
</li>
```

## 在 `<template>` 上使用 `v-for`

與 `<template v-if>` 類似，你也可以在一個 `<template>` 標籤上使用 `v-for` 來渲染一個包含多個元素的區塊。例如：

```html
<ul>
  <template v-for="item in items">
    <li>{{ item.msg }}</li>
    <li class="divider" role="presentation"></li>
  </template>
</ul>
```

## 使用 `key` 維持狀態

當 Vue 正在更新使用 `v-for` 渲染的元素列表時，預設會使用「就地更新」策略。如果資料項目的順序被改變，Vue 不會移動 DOM 元素來匹配資料項目的順序，而是就地更新每個元素。

為了給 Vue 一個提示，讓它能追蹤每個節點的身分，進而重用並重新排序現有元素，你需要為每項提供一個唯一的 `key` 屬性：

```html
<div v-for="item in items" :key="item.id">
  <!-- 內容 -->
</div>
```

建議只要有可能，就在任何 `v-for` 中提供 `key` 屬性，除非迭代的 DOM 內容非常簡單，或者是你故意依賴預設行為以獲得效能提升。
