---
title: class and style
---

# Class 與 Style 綁定

常見的資料綁定需求之一是操作元素的 `class` 列表以及它的行內樣式 (`style`)。因為兩者都是屬性，我們可以使用 `v-bind` 將它們綁定為字串：

## 綁定 HTML Class

### 綁定物件

我們可以傳遞一個物件給 `:class` (`v-bind:class` 的縮寫) 以動態切換 class：

```html
<div :class="{ active: isActive }"></div>
```

上面的語法表示 `active` 這個 class 是否存在，將取決於資料屬性 `isActive` 的真假值 (truthiness)。
你可以在物件中擁有多個欄位來切換多個 class。另外，`:class` 指令也可以與一般的 `class` 屬性共存：

```js
const isActive = ref(true)
const hasError = ref(false)
```

```html
<div
  class="static"
  :class="{ active: isActive, 'text-danger': hasError }"
></div>
```

它將渲染為：

```html
<div class="static active"></div>
```

### 綁定陣列

我們也可以綁定一個陣列給 `:class`，以便套用一個 class 列表：

```js
const activeClass = ref('active')
const errorClass = ref('text-danger')
```

```html
<div :class="[activeClass, errorClass]"></div>
```

它將渲染為：

```html
<div class="active text-danger"></div>
```

### 與元件一起使用

當你在具有單一根元素的自定義元件上使用 `class` 屬性時，這些 class 將被添加到該元素的根元素上。根元素上已有的 class 不會被覆寫。

```html
<!-- child 元件模板 -->
<p class="foo bar">Hi!</p>
```

```html
<!-- 使用 child 元件 -->
<MyComponent class="baz boo" />
```

渲染結果的 HTML 會是：

```html
<p class="foo bar baz boo">Hi!</p>
```

## 綁定行內樣式 (Inline Styles)

### 綁定物件

`:style` 支援綁定 JavaScript 物件值，對應於一個 HTML 元素的 `style` 屬性：

```js
const activeColor = ref('red')
const fontSize = ref(30)
```

```html
<div :style="{ color: activeColor, fontSize: fontSize + 'px' }"></div>
```

儘管建議使用 camelCase，`:style` 也支援 kebab-cased 鍵 (對應其被如何使用在 CSS 之中)。

```html
<div :style="{ 'font-size': fontSize + 'px' }"></div>
```

### 綁定陣列

我們可以將多個樣式物件組成一個陣列綁定給 `:style`。這些物件會被合併後應用在同一個元素上：

```html
<div :style="[baseStyles, overridingStyles]"></div>
```

### 自動前綴

當你在 `:style` 中使用一個需要[瀏覽器引擎前綴 (vendor prefix)](https://developer.mozilla.org/en-US/docs/Glossary/Vendor_Prefix) 的 CSS 屬性時，Vue 會自動在背後加入適當的前綴。
