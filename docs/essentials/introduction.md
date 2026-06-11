---
title: introduction
---

# 簡介

:::info 你正在閱讀的是 Vue 3 的文件！
- Vue 2 的支援已於 **2023 年 12 月 31 日** 結束。
- 正在從 Vue 2 升級嗎？請參考[遷移指南](https://v3-migration.vuejs.org/)。
:::

## 什麼是 Vue？

Vue (發音為 /vjuː/，類似 **view**) 是一個用於建構使用者介面的 JavaScript 框架。它建立在標準 HTML、CSS 和 JavaScript 之上，並提供宣告式、組件化的程式設計模型，協助你有效率地開發任何複雜度的使用者介面。

這是一個最簡單的範例：

```js
import { createApp, ref } from 'vue'

createApp({
  setup() {
    return {
      count: ref(0)
    }
  }
}).mount('#app')
```

```vue-html
<div id="app">
  <button @click="count++">
    Count is: {{ count }}
  </button>
</div>
```

上面的範例展示了 Vue 的兩個核心功能：

- **宣告式渲染 (Declarative Rendering)**：Vue 擴展了標準 HTML 的模板語法，允許我們基於 JavaScript 狀態宣告式地描述 HTML 的輸出。
- **響應式 (Reactivity)**：Vue 會自動追蹤 JavaScript 狀態的變化，並在狀態改變時有效率地更新 DOM。

## 漸進式框架

Vue 是一個框架，同時也是一個生態系統。它的設計非常靈活，可以漸進式地採用。根據你的使用情境，你可以用不同的方式來使用 Vue：

- 在無需構建步驟的情況下增強靜態 HTML
- 作為 Web Components 嵌入任何頁面
- 單頁應用程式 (SPA)
- 全端 / 伺服器端渲染 (SSR)
- 靜態網站生成 (SSG)
- 開發桌面端、行動端應用程式

## 單一元件檔 (Single-File Components)

在大多數啟用了構建工具的 Vue 專案中，我們會使用一種類似 HTML 的檔案格式來編寫 Vue 元件，稱為**單一元件檔** (也稱為 `*.vue` 檔案，縮寫為 **SFC**)。一個 Vue SFC 將元件的邏輯 (JavaScript)、模板 (HTML) 和樣式 (CSS) 封裝在同一個檔案中。

## API 風格

Vue 的元件可以透過兩種不同的 API 風格來編寫：**選項式 API (Options API)** 和**組合式 API (Composition API)**。

### 選項式 API (Options API)

使用選項式 API，我們可以使用包含多個選項的物件來定義元件的邏輯，例如 `data`、`methods` 和 `mounted`。選項所定義的屬性都會暴露在 `this` 上，它指向當前的元件實例。

### 組合式 API (Composition API)

使用組合式 API，我們可以使用導入的 API 函式來定義元件的邏輯。在 SFC 中，組合式 API 通常會搭配 `<script setup>` 使用。

哪一種比較好？
兩種 API 風格完全能夠實現相同的功能。選項式 API 更容易上手，而組合式 API 則提供了更好的邏輯複用性和型別推導。
