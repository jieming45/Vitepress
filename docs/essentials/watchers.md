---
title: watchers
---

# 偵聽器 (Watchers)

計算屬性可以讓我們宣告式地計算衍生值。然而在某些情況下，我們需要的是在狀態改變時執行特定的「副作用 (side effects)」—— 例如改變 DOM、或是基於非同步操作的結果改變另一部分的狀態。

在組合式 API 中，我們可以使用 `watch` 函式在響應式狀態改變時觸發回呼函式：

```vue
<script setup>
import { ref, watch } from 'vue'

const question = ref('')
const answer = ref('Questions usually contain a question mark. ;-)')

// 偵聽 question 的變化
watch(question, async (newQuestion, oldQuestion) => {
  if (newQuestion.indexOf('?') > -1) {
    answer.value = 'Thinking...'
    try {
      const res = await fetch('https://yesno.wtf/api')
      const json = await res.json()
      answer.value = json.answer
    } catch (error) {
      answer.value = 'Error! Could not reach the API. ' + error
    }
  }
})
</script>

<template>
  <p>
    Ask a yes/no question:
    <input v-model="question" />
  </p>
  <p>{{ answer }}</p>
</template>
```

## 偵聽的資料來源型別

`watch` 的第一個參數可以是不同形式的響應式來源：它可能是一個 ref (包含計算屬性)、一個響應式物件、一個 getter 函式，或甚至是一個包含多種來源的陣列：

```js
const x = ref(0)
const y = ref(0)

// 單一 ref
watch(x, (newX) => {
  console.log(`x is ${newX}`)
})

// getter 函式
watch(
  () => x.value + y.value,
  (sum) => {
    console.log(`sum of x + y is: ${sum}`)
  }
)

// 多個來源陣列
watch([x, () => y.value], ([newX, newY]) => {
  console.log(`x is ${newX} and y is ${newY}`)
})
```

## 深層偵聽器

當你直接將一個響應式物件傳遞給 `watch` 時，偵聽器會預設建立一個深層偵聽器 (Deep Watcher) - 所有巢狀層級的屬性變更都會觸發回呼函式：

```js
const obj = reactive({ count: 0 })

watch(obj, (newValue, oldValue) => {
  // 對於巢狀屬性的變更，newValue 和 oldValue 會是同一個物件！
})

obj.count++
```

如果你想要偵聽某個巢狀屬性的變更，你需要使用 getter 函式，或者明確地傳遞 `{ deep: true }` 選項。

## 立即執行偵聽器 (Eager Watcher)

`watch` 預設是懶惰執行的 (lazy)：只有當偵聽的來源發生改變時才會呼叫回呼函式。然而，有時我們希望在建立偵聽器時立即執行一次回呼函式，例如拉取初始資料。我們可以透過傳入 `immediate: true` 選項來達成：

```js
watch(
  source,
  (newValue, oldValue) => {
    // 會在初始設置時立刻執行，並且在狀態改變時再次執行
  },
  { immediate: true }
)
```

## `watchEffect()`

在回呼函式中，我們通常需要使用那些會同時觸發重新執行的相同響應式狀態，這時候宣告依賴可能會變得有些繁瑣。`watchEffect()` 允許我們自動追蹤回呼函式內的響應式依賴：

```js
const todoId = ref(1)
const data = ref(null)

watchEffect(async () => {
  const response = await fetch(
    `https://jsonplaceholder.typicode.com/todos/${todoId.value}`
  )
  data.value = await response.json()
})
```
