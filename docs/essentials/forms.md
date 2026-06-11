---
title: forms
---

# 表單輸入綁定

在前端處理表單時，我們經常需要同步表單輸入元素的狀態和 JavaScript 中的狀態。手動連接值的綁定以及更改事件的監聽器會非常繁瑣：

```html
<input
  :value="text"
  @input="event => text = event.target.value">
```

`v-model` 指令可以幫助我們簡化這項操作：

```html
<input v-model="text">
```

此外，`v-model` 可以用於各種類型的輸入框，包含 `<input>`、`<textarea>` 以及 `<select>` 元素。它會根據所使用的元素，自動擴充到不同的 DOM 屬性與事件組合。

## 基本用法

### 文本 (Text)

```html
<p>Message is: {{ message }}</p>
<input v-model="message" placeholder="edit me" />
```

### 多行文本 (Multiline Text)

```html
<span>Multiline message is:</span>
<p style="white-space: pre-line;">{{ message }}</p>
<textarea v-model="message" placeholder="add multiple lines"></textarea>
```

### 複選框 (Checkbox)

單一複選框，綁定布林值：

```html
<input type="checkbox" id="checkbox" v-model="checked" />
<label for="checkbox">{{ checked }}</label>
```

我們也可以將多個複選框綁定到同一個陣列或 Set 中：

```js
const checkedNames = ref([])
```

```html
<div>Checked names: {{ checkedNames }}</div>

<input type="checkbox" id="jack" value="Jack" v-model="checkedNames" />
<label for="jack">Jack</label>

<input type="checkbox" id="john" value="John" v-model="checkedNames" />
<label for="john">John</label>
```

### 單選按鈕 (Radio)

```html
<div>Picked: {{ picked }}</div>

<input type="radio" id="one" value="One" v-model="picked" />
<label for="one">One</label>

<input type="radio" id="two" value="Two" v-model="picked" />
<label for="two">Two</label>
```

### 選擇器 (Select)

單選：

```html
<div>Selected: {{ selected }}</div>

<select v-model="selected">
  <option disabled value="">Please select one</option>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

多選 (綁定陣列)：

```html
<select v-model="selected" multiple>
  <option>A</option>
  <option>B</option>
  <option>C</option>
</select>
```

## 修飾符

### `.lazy`

預設情況下，`v-model` 會在每次 `input` 事件後同步輸入框的值和資料。你可以加上 `lazy` 修飾符，改為在 `change` 事件後才同步資料：

```html
<!-- 在 "change" 事件後而不是 "input" 事件後同步 -->
<input v-model.lazy="msg" />
```

### `.number`

如果你希望使用者的輸入能自動轉型為數字，你可以為 `v-model` 加上 `number` 修飾符：

```html
<input v-model.number="age" />
```

### `.trim`

如果你希望自動過濾掉使用者輸入的前後空白字元，可以為 `v-model` 加上 `trim` 修飾符：

```html
<input v-model.trim="msg" />
```
