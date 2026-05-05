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
      ],
      sidebar: [
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
            { text: "CLAUDE.md 樣板模型", link: "/asuswrt/CLAUDE" },
            { text: "Legacy QIS v3 解析", link: "/asuswrt/Legacy_QIS_v3_解析" },
            { text: "QIS Flow", link: "/asuswrt/QIS_flow" },
            { text: "ASUS EULA", link: "/asuswrt/asus_eula" },
            { text: "ASUS Privacy Policy", link: "/asuswrt/asus_pp" },
            { text: "QIS", link: "/asuswrt/qis" },
          ],
        },
      ],

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
