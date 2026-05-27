import { defineConfig } from "vitepress";
import { withMermaid } from "vitepress-plugin-mermaid";

// https://vitepress.dev/reference/site-config
export default withMermaid(
  defineConfig({
    title: "技術文件網站",
    description: "Technical Documents written by Jieming Chen",
    lang: "zh-TW",
    base: "/documents/",
    srcExclude: ["**/README.md", "**/TODO.md"],
    assetsDir: "assets",
    cacheDir: "./.vitepress/.cache",
    ignoreDeadLinks: true,
    lastUpdated: true,
    cleanUrls: true,
    themeConfig: {
      lastUpdatedText: "最後更新時間",
      siteTitle: "ARC",
      nav: [
        { text: "Home", link: "/" },
        { text: "TypeScript", link: "/typescript" },
        { text: "Asuswrt", link: "/asuswrt/" },
        { text: "Travel", link: "/Travel/" },
      ],
      sidebar: {
        "/asuswrt/": [
          {
            text: "Asuswrt 導覽",
            items: [
              { text: "目錄總覽", link: "/asuswrt/" },
            ],
          },
          {
            text: "快速網路設定 (QIS)",
            collapsed: false,
            items: [
              { text: "QIS Flow (流程)", link: "/asuswrt/QIS_flow" },
              { text: "QIS 詳細設定", link: "/asuswrt/qis" },
              { text: "Legacy QIS v3 解析", link: "/asuswrt/Legacy_QIS_v3_解析" },
              { text: "Flow Chart 整合", link: "/asuswrt/flowChart" },
            ],
          },
          {
            text: "網路模式切換",
            collapsed: false,
            items: [
              { text: "AP to RT Mode", link: "/asuswrt/AP_to_RT_mode" },
              { text: "RT Mode", link: "/asuswrt/RT_mode" },
            ],
          },
          {
            text: "條款與隱私權",
            collapsed: false,
            items: [
              { text: "Asus EULA", link: "/asuswrt/asus_eula" },
              { text: "Asus Privacy Policy", link: "/asuswrt/asus_pp" },
            ],
          },
          {
            text: "API 與進階操作",
            collapsed: false,
            items: [
              { text: "API 操作說明", link: "/asuswrt/api_operation" },
              { text: "API Definition", link: "/asuswrt/api/api_definition" },
              { text: "API Flowchart", link: "/asuswrt/api/api_flowchart" },
              { text: "API Guide", link: "/asuswrt/api/api_guide" },
            ],
          },
          {
            text: "其他文件",
            collapsed: true,
            items: [
              { text: "CLAUDE", link: "/asuswrt/CLAUDE" },
              { text: "TASK", link: "/asuswrt/TASK" },
              { text: "Test", link: "/asuswrt/Test" },
              { text: "Theme", link: "/asuswrt/Theme" },
              { text: "Wrap", link: "/asuswrt/wrap" },
            ],
          },
        ],
        "/Travel/": [
          {
            text: "旅遊指南",
            items: [
              { text: "旅遊首頁", link: "/Travel/" },
            ],
          },
          {
            text: "東京 & 周邊 (Tokyo)",
            collapsed: false,
            items: [
              { text: "東京篇總覽", link: "/Travel/Tokyo/" },
              { text: "橫濱親子遊", link: "/Travel/Tokyo/橫濱" },
              { text: "川越一日遊", link: "/Travel/Tokyo/川越" },
              { text: "輕井澤避暑", link: "/Travel/Tokyo/輕井澤" },
              { text: "鎌倉江之島", link: "/Travel/Tokyo/鐮倉" },
              { text: "日光世界遺產", link: "/Travel/Tokyo/日光" },
              { text: "河口湖富士五湖", link: "/Travel/Tokyo/河口湖" },
            ],
          },
        ],
        "/": [
          {
            text: "清單",
            items: [
              { text: "TypeScript", link: "/typescript/typescript" },
              { text: "JavaScript Module", link: "/javascript_module" },
            ],
          },
          {
            text: "ASUSWRT",
            items: [
              { text: "進入 Asuswrt 專區", link: "/asuswrt/" },
            ],
          },
          {
            text: "TRAVEL",
            items: [
              { text: "進入 Travel 專區", link: "/Travel/" },
            ],
          },
        ],
      },

      socialLinks: [
        { icon: "github", link: "https://github.com/vuejs/vitepress" },
      ],
      footer: {
        message: "Released under the MIT License.",
        copyright: "Copyright 2025-present Jieming Chen",
      },
      search: {
        provider: "local",
      },
    },
    vite: {},
    vue: {},
    markdown: {
      container: {
        tipLabel: "提示",
        warningLabel: "注意",
        dangerLabel: "危險",
        infoLabel: "資訊",
        detailsLabel: "詳細資訊",
      },
      image: {
        lazyLoading: true,
      },
    },
  })
);
