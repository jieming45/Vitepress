---
title: reactivity fundamentals
---

# 響應式基礎

## 宣告響應式狀態

### `ref()`

在組合式 API 中，我們推薦使用 `ref()` 函式來宣告響應式狀態：

```js
import { ref } from 'vue'

const count = ref(0)
```

`ref()` 會接收參數，並將其包裹在一個帶有 `.value` 屬性的 ref 物件中回傳：

```js
const count = ref(0)

console.log(count) // { value: 0 }
console.log(count.value) // 0

count.value++
console.log(count.value) // 1
```

要在元件的模板中存取 ref，請在元件的 `setup()` 函式中宣告並回傳它：

```js
import { ref } from 'vue'

export default {
  setup() {
    const count = ref(0)

    function increment() {
      count.value++
    }

    // 將 count 暴露給模板
    return {
      count,
      increment
    }
  }
}
```

```html
<button @click="increment">
  {{ count }}
</button>
```

### `<script setup>`

手動在 `setup()` 中暴露狀態與方法可能很繁瑣。當你使用單一元件檔 (SFC) 時，可以使用 `<script setup>` 大幅簡化：

```vue
<script setup>
import { ref } from 'vue'

const count = ref(0)

function increment() {
  count.value++
}
</script>

<template>
  <button @click="increment">
    {{ count }}
  </button>
</template>
```

在 `<script setup>` 中定義的頂層導入、變數和函式都會自動在同一元件的模板中可用。

### 深層響應性

在 Vue 中，狀態預設是深層響應式的。這表示即使你改變了巢狀物件或陣列的內容，Vue 也能夠偵測到這些變化：

```js
import { ref } from 'vue'

const obj = ref({
  nested: { count: 0 },
  arr: ['foo', 'bar']
})

function mutateDeeply() {
  // 這些都會如預期般作用
  obj.value.nested.count++
  obj.value.arr.push('baz')
}
```

## `reactive()`

還有一種宣告響應式狀態的方式是使用 `reactive()`。與 `ref` 將內部值包裹在一個特殊的物件中不同，`reactive()` 是讓物件本身具有響應性：

```js
import { reactive } from 'vue'

const state = reactive({ count: 0 })
```

### `reactive()` 的限制

`reactive()` API 有幾項限制：

1. **只能用於物件型別**：它只適用於物件型別 (物件、陣列及如 `Map`、`Set` 等集合型別)。它無法用來保存如 `string`、`number` 或 `boolean` 這種基本型別。
2. **不能替換整個物件**：因為 Vue 的響應性追蹤是透過屬性訪問進行的，我們必須永遠保持對同一個響應式物件的參考。
3. **對解構不友善**：當我們將響應式物件的基本型別屬性解構為局部變數時，這些變數將失去響應性。

基於這些限制，我們強烈建議使用 `ref()` 作為宣告響應式狀態的主要 API。
