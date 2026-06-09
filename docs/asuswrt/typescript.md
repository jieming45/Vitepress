# TypeScript 介面 (Interface) 基本使用範例

在 TypeScript 中，我們經常使用 `interface` 或是 `type` 來定義物件的結構 (Shape) 與屬性型別。這樣做的好處是可以提供嚴格的型別檢查，確保物件只包含預期的屬性，防止打錯字或是意外新增未定義的屬性。

以下範例取自專案內的 `auth.api.ts`。

## 定義物件型別 (Interface)

在 `packages/shared/src/api/module/auth.api.ts` 中，定義了一個名為 `LoginInfo` 的介面，用來規範從伺服器解析出來的登入狀態資訊：

```typescript
/** 登入狀態資訊（從伺服器回應的 login_info 解析） */
export interface LoginInfo {
    error_status: string;
    lock_time: string;
    error_num: string;
    last_time_lock_warning: string;
    page: string;
}
```

## 如何使用

當我們宣告一個變數或常數為 `LoginInfo` 型別時，TypeScript 就會強制要求這個物件**必須符合**該介面的結構。

### 正確的用法

物件內只能包含 `LoginInfo` 定義的屬性，且型別完全一致 (皆為 `string`)：

```typescript
const validLoginInfo: LoginInfo = {
    error_status: "0",
    lock_time: "0",
    error_num: "0",
    last_time_lock_warning: "",
    page: "index.asp"
};
```

### 錯誤的用法 (TypeScript 會報錯)

一旦物件被宣告為特定的 `interface`，我們就**不能**新增任何未在介面中定義的屬性 (Property)。這可以避免開發時的許多潛在錯誤，如拼字錯誤或亂塞不相關的資料。

```typescript
const invalidLoginInfo: LoginInfo = {
    error_status: "0",
    lock_time: "0",
    error_num: "0",
    last_time_lock_warning: "",
    page: "index.asp",
    
    // ❌ TypeScript 會在此處報錯：
    // Object literal may only specify known properties, and 'unknown_prop' does not exist in type 'LoginInfo'.
    unknown_prop: "this will cause an error" 
};
```

同時，如果少給了屬性（且該屬性未標示為可選 `?`），或者給錯型別，TypeScript 同樣也會立刻擋下：

```typescript
const wrongTypeInfo: LoginInfo = {
    error_status: "0",
    // ❌ TypeScript 報錯：Property 'lock_time' is missing in type...
    
    error_num: 0, // ❌ TypeScript 報錯：Type 'number' is not assignable to type 'string'
    
    last_time_lock_warning: "",
    page: "index.asp",
};
```

## 總結
透過 `interface` 或是 `type`，我們賦予了物件一個明確的「合約」。一旦宣告綁定了這個合約，物件的行為與長相就被嚴格限制住了（包含不能隨意增加新屬性）。這為專案帶來了極高的穩定性與強大的 IDE 程式碼提示 (Auto-complete) 功能。
