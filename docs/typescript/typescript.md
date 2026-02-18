## 環境設定

##### 安裝 TypeScript

```sh
npm i -g typescript
```

##### 初始化環境，並生成配置文件 tsconfig.json

```sh
tsc --init
```

## 執行 TypeScript

##### 監視模式

-   監視整個資料夾

```sh
tsc --watch
```

-   監視個別檔案

```sh
tsc --watch index.ts
```

## 類型聲明

```typescript
let str: string;
let num: number;
let c: "Hello";
str = "Hello";
num = 123;
c = "Hello"; // c 是字面量類型，就只能存宣告的類型'Hello'
```

## 類型推斷

```typescript
let num = 123;
num = "Hello"; //會有警告，因為num已經被推斷是 number 類型
```

## 類型總覽

1. string
2. number
3. boolean
4. null
5. undefined
6. bigint
7. symbol
8. object (包含 Array, Function, Date, Error ...等)
9. any
10. unknown
11. never
12. void
13. tuple
14. enum
15. type
16. interface

```typescript
// 這兩個是有差別的
let str1: string; //官方推薦寫法
str1 = "Hello";
str1 = new String("Hello"); //這邊會出現錯誤

let str2: String;
str2 = "Hello";
str2 = new String("Hello");
```

::: tip
在 JavaScript 中的這些內置構造函數: Number、String、Boolean, 他們用於創建對應的包裝對象，在日常開發很少使用，在 TypeScipt 中也是同理，所以在 TypeScript 中進行類型聲明時，通常是用小寫的 number、string、boolean
:::

##### String 使用範例

```javascript
let str = "Hello";

//當訪問str.length時，JavaScript引擎做了以下工作
let size = (function () {
    // 1. 自動裝箱: 創建一個臨時的String對象包裝原始字串
    let tempStringObject = new String(str);

    // 2. 訪問String對象的length屬性
    let lengthValue = tempStringObject.length;

    // 3. 銷毀臨時對象，返回長度值
    // (JavaScript引擎自動處理對象銷毀，開發者無感)
    return lengthValue;
})();

console.log(size); //輸出5
```

## 常用類型

1. `any`  
   任意類型，一但將變量類型限制為 `any`，那就意味著放棄了對該變量的類型檢查

    ```typescript
    // 顯示any: 明確的表示str是any
    let str: any;

    str = 123; //無警告
    str = "Hello"; //無警告
    str = false; //無警告

    // 隱式any: 沒有明確的表示num的類型是any，但TypeScript推斷出來num是any
    let num;
    num = 123; //無警告
    num = "Hello"; //無警告
    num = false; //無警告
    ```

    ::: tip
    `any` 類型的變量，可以賦值給任意類型的變量，且不會出現警告
    :::

    ```typescript
    let num: any;
    num = 9;

    let str: string;
    str = num; //不會報錯
    ```

2. `unknown`  
   可以理解為是一個類型安全的 `any`，適用於不確定數據的具體類型

    ```typescript
    let num: unknown;

    num = 123; //無警告
    num = "Hello"; //無警告
    num = false; //無警告

    let str: string;
    str = num; //有警告，不能將類型unknown分配給類型string
    ```

    ```typescript
    // unknown 會強制開發者在使用之前進行類型檢查，從而提供更強的類型安全性
    let str1: unknown;
    str1 = "Hello";

    let str2: string;

    //第一種
    if (typeof str1 === "string") {
        str2 = str1;
    }

    //第二種(斷言)
    str2 = str1 as string;
    str2 = <string>str1;
    ```

    ::: tip
    讀取 `any` 類型數據的任何屬性都不會報錯，而 `unknown` 剛好相反
    :::

    ```typescript
    let str1: string;
    str1 = "Hello";
    str1.toUpperCase(); //無警告

    let str2: any;
    str2 = "Hello";
    str2.toUpperCase(); //無警告

    let str3: unknown;
    str3 = "Hello";
    str3.toUpperCase(); //顯示警告，str3 的類型為未知
    (str3 as string).toUpperCase(); //無警告
    ```

3. `never`  
   任何值都不是，就是不能有值，undefined、null、' '、0 都不行

    - 幾乎不會用 `never` 去限制變量，因為沒有意義

    ```typescript
    let str: never;

    str = 1; //警告
    str = "Hello"; //警告
    str = false; //警告
    ```

    - `never` 一般都是 TypeScript 去堆斷出來的

    ```typescript
    let str: string;

    str = "Hello";
    if (typeof str === "string") {
        console.log(str.toUpperCase());
    } else {
        console.log(str); // 這時候str是never
    }
    ```

    - `never` 也可用於限制函數的返回值

    ```typescript
    // 返回never的函數不能具有可訪問的終結點
    //  throw error:
    //      1. 不順利調用
    //      2. 永遠調不完
    function demo(): never {
        throw new Error("Error");
    }

    let result = demo();
    console.log(result);
    ```

4. `void`  
   `void` 通常用於函數返回值聲明。函數返回值為空，調用者也不應依賴其返回值進行任何操作

    ```typescript
    function log(msg: string): void {
        console.log(msg);
    }
    ```

    ::: tip
    因為沒有 return 所以有隱式的 undefined 回傳值，而 void 可以接受。所以 undefined 是 void 可以接受的一種
    :::

    ```typescript
    // 無警告
    function log(msg: string): void {
        console.log(msg);
    }

    // 無警告
    function log(msg: string): void {
        console.log(msg);
        return;
    }

    // 無警告
    function log(msg: string): void {
        console.log(msg);
        return undefined;
    }
    ```

    ```typescript
    // 不應利用返回值進行任何操作
    function demo1(): void {
        console.log("");
    }

    let result = demo1();

    if (result === undefined) {
    } // 出現警告
    ```

    ::: tip 總結

    - `void` 是一個廣泛的概念，用來表達空，而 undefined 則是這種空得具體實現之一．因此可以說 undefined 是 `void` 能接受的空狀態的一種具體形式
    - 若函數返回類型為`void`
        - 從語法上講: 函數是可以返回 undefined 的，至於顯示返回還是隱式返回無所謂
        - 從語意上講: 函數調用者不應關心函數返回的值，也不應依賴返回值進行任何操作．即使返回了 undefined 值

    :::

5. `object`  
   關於 object 與 Object，實際開發中用到的相對較少，因為範圍太大了
   object: 所有非原始類型，可存儲: 對象、函數、數組等，由於限制的範圍比較廣泛，在實際開發中使用相對較少
   Object: 可以調用到 Object 方法的類型。null、undefined 無法儲存

    ##### 聲明對象類型

    - 一般限制對象的用法

    ```typescript
    // 限制person1對象也必須有name屬性，age為可選屬性
    let person1: { name: string; age?: number };

    // 意義同，用換行作分隔
    let person2: {
        name: string;
        age?: number;
    };

    person1 = { name: "張三", age: 18 };
    person2 = { name: "張三", age: 18, gender: "男" }; //警告，因為類型限制中沒有gender屬性
    ```

    - 索引簽名，允許定義對象可以具有任意數量的屬性，這些屬性的鍵和類型是可變的，常用於描述類型不確定的屬性(具有動態屬性的對象)

    ```typescript
    let person: {
        name: string;
        age?: number;
        [key: string]: any; //索引簽名，key名稱可以更換
    };
    person = { name: "張三", age: 18, gender: "男" };
    ```

    - 聲明函數類型

    ```typescript
    let count:(a:number, b:number) => number
    const = function(x, y){
        return x + y;
    }
    ```

    ::: tip

    - TypeScript 中 => 在函數類型聲明時表示函數類型，描述其參數類型與返回類型
    - JavaScript 中 => 是一種定義函數的語法，是具體函數實現
    - 函數類型聲明還可以使用 接口、自定義類型等方式
      :::

    - 聲明數組類型

    ```typescript
    let arr1: string[];
    let arr2: Array<string>;
    ```

6. `tuple`  
   是一種特殊的數組類型，可以存儲固定數量的元素，並且每個元素的類型是已知的且可以不同。元組用於精確描述一組值得類型

    ```typescript
    // 第一個元素必須是string類型，第二個元素是number類型
    let arr1: [string, number];

    // 第一個元素必須是number類型，第二個元素是可選的，如果存在必須要boolean類型
    let arr2: [number, boolean?];

    //第一個元素必須是number類型，後面的元素可以是任意數量的string類型
    let arr3: [number, ...string[]];
    ```

7. `enum`  
   枚舉可以定義一組命名常量，他能增強代碼的可讀性，也讓代碼更好維護

    ```typescript
    enum Direction {
        Up,
        Down,
        Left,
        Right,
    }

    function walk(data: Direction) {
        if (data === Direction.Up) {
            console.log("往上走");
        } else if (data === Direction.Down) {
            console.log("往下走");
        } else if (data === Direction.Left) {
            console.log("往左走");
        } else if (data === Direction.Right) {
            console.log("往右走");
        } else {
            console.log("未知方向");
        }
    }
    ```

    - 數字枚舉
      一種常見的枚舉類型，其成員的值會自動遞增，且數字枚舉還具備反向映射的特點

    - 字串枚舉

    ```typescript
    // 沒有反向映射
    enum Direction {
        Up = "up",
        Down = "down",
        Left = "left",
        Right = "right",
    }
    ```

    - 常量枚舉
      常量枚舉是一種特殊枚舉類型，他使用 const 關鍵字定義，在編譯時會被內聯，避免生成一些額外的代碼

    ```typescript
    // 沒有反向映射
    const enum Direction {
        Up,
        Down,
        Left,
        Right,
    }
    ```

8. `type`  
   可以為任意類型創建別名，讓代碼更簡潔可讀性更強，同時更方便地進行類型復用和擴展

    - 基本用法

    ```typescript
    type num = number;

    let price: num;
    price = 100;
    ```

    - 聯合類型

    ```typescript
    type Status = number | string;

    function printState(status: Status) {
        console.log(status);
    }

    printStatus(404);
    printStatus("Hello");
    ```

    - 交叉類型
      將多個類型合併為一個，常用於對象類型

    ```typescript
    type Area = {
        height: number
        width: number
    }

    type Address = {
        num: number
        cell:number
        room:string
    }

    type House = Area & Address

    const house:House{
        height: 180,
        width:75,
        num:3,
        cell:4,
        room:'111'
    }
    ```

9. `interafce`  
   是一種定義結構的方式，主要作用是為類、對象、函數等規定一種契約，這樣可以確保代碼一制性和類型安全，但要注意 `interface`只能定義格式不能包含任何實現

    - 定義類結構

    ```typescript
    interface PersonInterface {
        name: string;
        age: string;
        speak(n: number): void;
    }

    class Person implements PersonInterface {
        constructor(public name: string, public age: number) {}

        speak(n: number): void {
            console.log(n);
        }
    }
    ```

    - 定義對象結構

    ```typescript
    interface UserInterface {
        name: string;
        readonly gender: string
        age?: string;
        run(n: number): void;
    }

    const user:UserInterface = {
        name: '張三'
        gender: '男'
        age: 18
        run(n){
            console.log(n)
        }
    }
    ```

    - 定義函數結構

    ```typescript
    interface CountInterface {
        (a: number, b: number): number;
    }

    const count: CountInterface = (x, y) => {
        return x + y;
    };
    ```

    - `interface`之間的繼承

    ```typescript
    interface PersonInterface{
        name: string
        age: number
    }

    interface StudentInterface extends PersonInterface{
        grade: string
    }

    const stu:StudentInterface = {
        name: '張三'
        age: 18
        grade: '高一'
    }
    ```

    - `interface`自動合併(可重複定義)

    ```typescript
    interface PersonInterface {
        name: string;
        age: number;
    }

    interface PersonInterface {
        grade: string;
    }


    const stu:PersonInterface = {
        name: '張三'
        age: 18
        grade: '高一'
    }
    ```

    ::: tip 總結
    何時使用`interface`:

    1. 定義對象的格式: 描述數據類型、API 響應格式、配置對象..等，是開發中用的最多的場景
    2. 類的契約: 規定一個類需要實現哪些屬性和方法
    3. 自動合併: 一般用於括展第三方庫的類型，這種特性在大型項目中可能會用到
       :::

10. 一些相似概念的區別
    `interface` 與 `type` 的區別
    相同點: `interface` 和 `type` 都可以用於定義對象結構，兩者在許多場景中是可以互換的
    不同點:
    `interface`: 更專注於定義對象和類的結構，支持繼承、合併
    `type`: 可以定義類型別名、聯合類型、交叉類型，但不支持繼承和自動合併

    ```typescript
    // 使用interface定義Person對象
    interface PersonInterface {
        name: string;
        age: number;
        speak(): void;
    }

    // 使用type定義Person對象
    type Person = {
        name: string;
        age: number;
        speak(): void;
    };
    ```

    ```typescript
    // interface 自動合併
    interface PersonInterface {
        name: string;
        age: number;
    }

    interface PersonInterface {
        speak(): void;
    }

    interface StudentInterface extends PersonInterface {
        grade: string;
    }

    // 使用type實現interface自動合併
    type PersonType = {
        name: string;
        age: number;
    } & {
        speak: () => void;
    };

    type StudentType = PersonType & {
        grade: string;
    };
    ```

    ##### `interface` 與抽象類的區別

    - 相同點: 都用於定義一個類的格式
    - 不同點:
        - `interface`: 只能描述結構，不能有任何實現代碼，一個類可以實現多個接口
        - 抽象類: 既可以包含抽象對象，也可以包含具體方法，一個類只能繼承一個抽象類

    ```typescript
    interface FlyInterface {
        fly(): void;
    }

    interface SwimInterface {
        swim(): void;
    }

    // 一個類實現多個接口
    class Duck implements FlyInterface, SwimInterface {
        fly(): void {
            console.log("fly");
        }

        swim(): void {
            console.log("swim");
        }
    }
    ```

11. `泛型`  
    `泛型`允許我們在定義函數、類或接口時，使用類型參數來表示未指定的類型，這些參數在具體使用時才被指定具體的類型，`泛型`能讓同一段代碼是用於多種類型，同時能保持類型的安全性

    ```typescript
    function log<T>(data: T) {
        console.log(data);
    }

    log<number>(123);
    log<string>("Hello");
    ```

    ```typescript
    // 泛型可以有多格
    function log<T, U>(data1: T, data2: U ): T | U{
        console.log(data1, data2);
    }

    log<number, string>(123, "Hello"));
    ```

    ```typescript
    // 泛型接口
    interface PersonInterface<T> {
        name: string
        age: number
        extraInfo: T
    }

    let p1: PersonInterface<number>
    p1 = {
        name: '張三'
        ageL 18
        extraInfo: 100
    }
    ```

    ```typescript
    // 泛型約束
    interface PersonInterface<T> {
       name: string
       age: number
       extraInfo: T
    }

    type JobInfo = {
        tile: string
        company: string
    }

    let p1: PersonInterface<number>
    p1 = {
       name: '張三'
       ageL 18
       extraInfo: 100
    }

    let p2: PersonInterface<JobInfo>
    p2 = {
        name: '張三'
        ageL 18
        extraInfo: {
            title: 'ABC'
            company: 'Engineer'
       }
    }
    ```

    ```typescript
    // 泛型類
    class Person<T>{
        constructor(
            public name: string
            public age: number
            public extraInfo: T
        ){}

        speak(){
            console.log('Hello')
        }
    }

    const p1 = new Person<number>("tom", 30, 250)
    type JobInfo = {
        tile: string
        company: string
    }

    const p2 = new Person<JobInfo>("tom", 30, {title: 'ABC', company 'Enginner'})
    ```

12. 類型聲明文件  
    類型聲明文件是 TypeScript 中的一種特殊文件，通常以.d.ts 作為擴展名。他的主要作用是為現有的 JavaScript 代碼提供類型信息，使得 TypeScript 能夠在使用這些 JavaScript 庫或模塊時進行類型檢查和提示

    ```javascript
    // demo.js
    export function add(a, b) {
        return a + b;
    }

    export function mul(a, b) {
        return a * b;
    }
    ```

    ```typescript
    // demo.d.ts
    declare function add(a: number, b: number): number;
    declare function mul(a: number, b: number): number;

    export { add, mul };
    ```

    ```typescript
    // index.ts
    import { add, mul } from "./demo.js";

    console.log(add(1, 2));
    ```

13. 屬性修飾符

    - public: 公開的．可以被`類內部`、`子類`、`類外部`訪問
    - protected: 受保護的。可以被`類內部`、`子類`訪問
    - private: 私有的。可以被`類內部`訪問
    - readonly: `唯讀`屬性。屬性無法修改

    ```typescript
    // public 修飾符
    class Person {
        public name: string;
        public age: number;
        constructor(name: string, age: number) {
            this.name = name;
            this.age = age;
        }
        public speak() {
            console.log(this.name); // public 在類內部訪問
        }
    }

    class Student extends Person {
        study() {
            console.log(this.name); // public 在類的子類訪問
        }
    }

    const p1 = new Person("tom", 18);
    p1.name; // public 在類的外部訪問
    p1.age;
    p1.speak();
    ```

    ```typescript
    // 屬性簡寫形式
    class Person {
        // public name: string;
        // public age: number;
        constructor(public name: string, public age: number) {
            // this.name = name;
            // this.age = age;
        }
    }
    ```

    ```typescript
    // protected修飾符
    class Person {
        constructor(protected name: string, protected age: number) {}
        protected getDetails() {
            console.log(this.name); // protected 在類內部訪問
        }

        introduce() {
            console.log(this.getDetails());
        }
    }

    class Student extends Person {
        study() {
            this.introduce(); //無警告
            console.log(this.name); // protected 在類的子類訪問
        }
    }

    const p1 = new Person("tom", 18);
    p1.name; // 出現警告，類的外部不能使用
    p1.getDetails(); // 出現警告，類的外部不能使用
    p1.getDetails(); // 出現警告，類的外部不能使用
    p1.introduce(); // public 類的外部可以使用

    const p2 = new Student("Anna", 19);
    p2.study();
    ```

    ```typescript
    // privated修飾符
    class Person {
        constructor(
            public name: string,
            public age: number
            private id:strin) {}
        getInfo(){
            return this.name
        }

        private getPrivateInfo(){
            return this.id
        }

        getFullInfo(){
            return this.getInfo() + ', ' + this.getPrivateInfo()
        }
    }



    const p1 = new Person("tom", 18, '123456789');
    p1.name
    p1.id   // 出現警告，因為是private
    p1.getFullInfo()
    p1.getPrivateInfo() // 出現警告，因為是private
    ```

    ```typescript
    // readonly 修飾符
    class Person {
        constructor(public name: string, public readonly age: number) {}
    }

    const p1 = new Person("tom", 18, "123456789");
    p1.name;
    p1.age; // 出現警告，因為是readonly
    ```

14. 抽象類  
    抽象類是一種無法被實例化的類(無法用 new)，專門用來定義類的結構和行為，類中可以寫抽象方法，也可以寫具體實現。  
    抽象類主要用來為其派生類提供一個基礎結構，要求其派生類必須實現其中的抽象方法

    > 抽象類不能實例化，其意義是可以被繼承，抽象類裡可以有普通方法，也可以有抽象方法

    ```typescript
    abstract class Package {
        constructor(public weight: number) {}

        //抽象方法
        abstract claculate(): number;

        //具體方法
        printPackage() {
            console.log(this.calculate());
        }
    }

    class StandardPackage extends Package {
        constructor(weight: number, public unitPrice: number) {
            super(weight);
        }

        calculate(): number {
            return thie.weight * this.unitPrice;
        }
    }

    const s1 = new StandardPackage(10, 5);
    s1.printPackage();
    ```

    ::: tip 總結
    何時使用抽象類

    1. 定義通用接口: 為一組相關的類定義通用的行為(方法和屬性)時
    2. 提供基礎實現: 在抽象類中提供某些方法或為其提供基礎實現，這樣子類就可以繼承這些實現
    3. 確保關鍵實現: 強制子類實現一關鍵行為
    4. 共享代碼和邏輯: 當多個類需要共享部分代碼時，抽象類可以避免代碼重複
       :::
