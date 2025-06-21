# JavaScript 模組化規範

## 什麼是模組化

-   將程序文件依據依定規則拆分成多個文件，這種編碼方式就是模組化的編碼方式
-   拆分出來每個文件就是一個模塊，模塊中的數據都是私有的，模塊之間互相隔離
-   同時也能通過一些手段，可以把模塊內的指定數據"交出去"，供其他模塊使用
-   模塊化的核心思想就是模塊之間是隔離的，通過導入和導出進行數據和功能的共享。
    -   導出:模塊公開其內部的一部分(如變量、函數等)，使這些內容可以被其他模塊使用
    -   導入:模塊引用和使用其他模塊導出的內容，以重用代碼和功能

## 為什麼需要模塊化

隨著應用的複雜度越來越高，其代碼量和文件數量都會急遽增加，會逐漸以發下列問題:

1. 全局汙染問題
2. 依賴混亂問題
3. 數據安全問題

#### 全局汙染問題

在 HTML 引入兩個 JS 檔案，兩個檔案有相同的函示`getData`。
這時候後引入的`add.js`的`getData`會覆蓋`sum.js`的`getData`，所以這時候呼叫`getData`會得到`67890`

```html
<script src="./sum.js"></script>
<script src="./add.js"></script>
```

###### sum.js

```javascript
function getData() {
    return "12345";
}
```

###### add.js

```javascript
function getData() {
    return 67890;
}
```

#### 依賴混亂問題

如果`Bootstrap.js`需要用到`jQuery.js`，但是引用的時候，`jQuery.js`被放在`Bootstrap.js`之後，就會出現錯誤訊息

```html
<script src="./Bootstrap.js"></script>
<script src="./jQuery.js"></script>
```

#### 數據安全問題

只要一引入`data.js`，則裡面定義的變數 object 就會被加到全域變數 window 上

```html
<script src="./data.js"></script>
```

```javascript
// data.js
let object = {
    name: "ABD",
    number: 12345,
};
```

## CommonJS

###### 導出數據有兩種方式

-   module.exports = value;
-   export.name = value;

```javascript
// index.js
const data = require("./add.js");

// 如果沒有導出內容，預設是個空物件
console.log(data);

// 輸出內容
{ number: 12345, getData: [Function: getData] }


// add.js
let number = 12345;

function getData() {
    return "add" + number;
}

// 第一種導出方法
exports.number = number;
exports.getData = getData;

// 第二種導出方法
module.exports = { number, getData };
```

::: warning

1. 每個模塊內部的:this、exports、module.exports 在初始時，都指向同一個空對象，該空對象就是當前模塊導出的數據。
2. 無論如何修改導出對象，最後導出的都是 module.exports 的值
3. exports 是對 module.exports 的初始引用，僅為了方便給導出對象添加屬性，所以不能使用 exports = value 的形式導出數據，但是可以使用 module.exports = value 導出數據
   :::

###### 導入數據

```javascript
// index.js
import * as data from "./add.js";

console.log(number);
console.log(getData);

// 輸出內容
12345;
add12345;

// add.js
let number = 12345;

function getData() {
    return "add" + number;
}

module.exports = { number, getData };
```

## ES6 模塊化規範

###### 導入全部

```javascript
// index.js
import * as data from "./add.js";

console.log(data.number);
console.log(data.getData());

// 輸出內容
12345;
add12345;

// add.js
const number = 12345;

function getData() {
    return "add" + number;
}

export { number, getData };
```

###### 命名導入(分別導出、統一導出時可用)

```javascript
// index.js
// 導入數據可以順便裡用物件的解構賦值語法
import { number, getData } from "./add.js";

console.log(number);
console.log(getData());

// 輸出內容
12345;
add12345;

// add.js
const number = 12345;

export function getData() {
    return "add" + number;
}

export { number };
```

###### 默認導入

```javascript
// index.js
// number可以改成任何合法變數名稱
import number from "./add.js";

console.log(number);
console.log(getData());

// 輸出內容
12345;
add12345;

// add.js
const number = 12345;

function getData() {
    return "add" + number;
}

export default number;
```

###### 默認導入、個別導入同時使用

```javascript
// index.js
import number, { getData } from "./add.js";

console.log(number);
console.log(getData());

// 輸出內容
12345;
add12345;

// add.js
const number = 12345;

export function getData() {
    return "add" + number;
}

export default number;
```

##### 動態導入

```javascript
btn.onclick= ()=>{
    const result = await import('./add.js');
    console.log(result);
}
```

###### import 可以不接受任何數據

```javascript
import "./sum.js";
```

###### 個別導出

```javascript
export const number = 12345;

export function getData() {
    return "add" + number;
}
```

###### 統一導出

```javascript
const number = 12345;

function getData() {
    return "add" + number;
}

// 後面的{}不是物件
export { number, getData };
```

###### 默認導出

```javascript
// index.js
import number from "./add.js";

console.log(number);

// 輸出內容
12345;

// add.js
const number = 12345;

function getData() {
    return "add" + number;
}

// 類似交出{default: number}
// 這時候導出的就是一個物件
export default number;
```

###### HTML 引用 ES6 module 的檔案用法

```html
<!-- 引用須加上type="module" -->
<script type="module" src="./index.js"></script>
```
