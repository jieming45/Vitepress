import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
    title: "技術文件網站",
    //itleTemplate: ":title - ARC",
    description: "Technical Documents written by Jieming Chen",
    lang: "zh-TW",
    // base: "/technical-documents/",
    cleanUrls: false,
    // srcDir: "docs",
    srcExclude: ["**/README.md", "**/TODO.md"],
    outDir: "./.vitepress/dist",
    assetsDir: "assets",
    cacheDir: "./.vitepress/.cache",
    ignoreDeadLinks: false,
    lastUpdated: false,
    themeConfig: {
        // https://vitepress.dev/reference/default-theme-config
        // logo: '',
        // siteTitle: "",
        nav: [
            { text: "Home", link: "/" },
            { text: "TypeScript", link: "/typescript" },
            // { text: "Examples", items: [{ text: "Examples", link: "/markdown-examples" }] },
        ],

        sidebar: [
            {
                text: "清單",
                items: [
                    { text: "TypeScript", link: "/typescript" },
                    // { text: "Runtime API Examples", link: "/api-examples" },
                ],
            },
        ],

        socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
        footer: {
            message: "Released under the MIT License.",
            copyright: "Copyright 2025-present Jieming Chen",
        },
        // editLink: {
        //     pattern: "[GITHUB PATH]",
        //     text: "Edit this page on GitHub",
        // },
        // lastUpdatedText: "更新时间",
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
        // lineNumbers: true,
        image: {
            lazyLoading: true,
        },
    },
    // async transformPageData(pageData, { siteConfig }) {
    //     if (!pageData.lastUpdated) {
    //         // 这里可以设置你的自定义时间逻辑
    //         pageData.lastUpdated = new Date("2023-11-15"); // 静态时间
    //         // 或者从其他来源获取时间
    //     }
    // },
});
