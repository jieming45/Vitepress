---
title: template refs
---

# 模板參考 (Template Refs)

雖然 Vue 的宣告式渲染模型為我們抽象化了大部分對 DOM 的直接操作，但在某些情況下，我們仍然需要直接存取底層的 DOM 元素。為此，我們可以使用特殊的 `ref` 屬性：

```html
<input ref="input">
```

`ref` 是一個特殊的屬性，與 `v-for` 中的 `key` 類似。它允許我們在一個特定的 DOM 元素或子元件實例掛載後，獲得對它的直接參考。這在需要以程式化方式將焦點移到輸入框上，或在元素上初始化第三方函式庫時非常有用。

## 存取 Refs

為了要獲得透過 `ref` 屬性標記的 DOM 元素或元件實例的參考，我們可以在組合式 API 中宣告一個同名的 ref：

```vue
<script setup>
import { ref, onMounted } from 'vue'

// 宣告一個名稱與模板 ref 屬性相符的 ref
const input = ref(null)

onMounted(() => {
  input.value.focus()
})
</script>

<template>
  <input ref="input" />
</template>
```

請注意，你只能**在元件掛載後**才能存取到 ref。如果你試圖在模板中的表達式存取 `input`，在初次渲染時它將會是 `null`。這是因為在初次渲染完成之前，這個元素還不存在呢！

## 在 `v-for` 中的 Refs

> 此功能需要 Vue 3.2.25 以上版本。

當 `ref` 被用在 `v-for` 內時，對應的 ref 將會包含一個在掛載後填滿所有元素的陣列：

```vue
<script setup>
import { ref, onMounted } from 'vue'

const list = ref([
  /* ... */
])

const itemRefs = ref([])

onMounted(() => {
  console.log(itemRefs.value)
})
</script>

<template>
  <ul>
    <li v-for="item in list" ref="itemRefs">
      {{ item }}
    </li>
  </ul>
</template>
```

請注意，ref 陣列並**不**保證與來源陣列的順序相同。

## 函式形式的 Refs

除了字串的鍵值，`ref` 屬性也可以綁定到一個函式，在每次元件更新時都會呼叫該函式。函式接收該元素參考作為第一個參數：

```html
<input :ref="(el) => { /* 將 el 賦值給一個變數或屬性 */ }">
```

當元素被卸載時，該函式也會被呼叫，此時傳入的參數將是 `null`。

## 元件上的 Refs

`ref` 屬性也可以用於子元件上。此時，得到的參考會是該元件的實例：

```vue
<script setup>
import { ref, onMounted } from 'vue'
import Child from './Child.vue'

const child = ref(null)

onMounted(() => {
  // 可以存取 child 元件實例
})
</script>

<template>
  <Child ref="child" />
</template>
```

如果子元件使用的是 `<script setup>`，它預設是**封閉的**。也就是說，父元件無法存取該子元件在 `<script setup>` 內部宣告的任何屬性與方法，除非子元件透過 `defineExpose` 巨集顯式地暴露：

```vue
<script setup>
import { ref } from 'vue'

const a = 1
const b = ref(2)

// 顯式地暴露屬性或方法
defineExpose({
  a,
  b
})
</script>
```
