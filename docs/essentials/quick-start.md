---
title: quick start
---

# 快速開始

## 線上嘗試 Vue

- 要快速體驗 Vue，你可以直接在 [Vue SFC Playground](https://sfc.vuejs.org/) 上嘗試。
- 如果你偏好使用純 HTML/JS 且不使用構建步驟的環境，你可以試試 [JSFiddle 上的這個範例](https://jsfiddle.net/yyx990803/240p8uoz/)。

## 建立一個 Vue 應用程式

在本節中，我們將介紹如何在本地端建立一個具備構建工具的 Vue 單頁應用程式 (SPA)。我們建立的專案將使用 [Vite](https://vitejs.dev/) 作為構建工具，並允許我們使用 Vue 的單一元件檔 (SFC)。

確保你已經安裝了 Node.js 且版本為 18.3 或更高，然後在命令列中執行以下指令：

```sh
npm create vue@latest
```

這個指令會安裝並執行 `create-vue`，它是 Vue 官方的專案鷹架工具。你將會看到一些可選功能的提示，例如 TypeScript 支援和測試支援：

```sh
Vue.js - The Progressive JavaScript Framework

✔ Project name: … <your-project-name>
✔ Add TypeScript? … No / Yes
✔ Add JSX Support? … No / Yes
✔ Add Vue Router for Single Page Application development? … No / Yes
✔ Add Pinia for state management? … No / Yes
✔ Add Vitest for Unit testing? … No / Yes
✔ Add an End-to-End Testing Solution? … No / Cypress / Playwright
✔ Add ESLint for code quality? … No / Yes
✔ Add Prettier for code formatting? … No / Yes

Scaffolding project in ./<your-project-name>...
Done.
```

如果不知道是否需要某個功能，直接按 Enter 選擇 `No` 即可。專案建立完成後，執行以下指令：

```sh
cd <your-project-name>
npm install
npm run dev
```

現在你應該已經成功執行了你的第一個 Vue 專案！

## 不使用構建工具使用 Vue

要不使用構建工具開始使用 Vue，你只需將以下程式碼複製並貼到一個 HTML 檔案中：

```html
<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>

<div id="app">{{ message }}</div>

<script>
  const { createApp, ref } = Vue

  createApp({
    setup() {
      const message = ref('Hello vue!')
      return {
        message
      }
    }
  }).mount('#app')
</script>
```
