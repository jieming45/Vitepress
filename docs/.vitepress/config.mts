import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
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
        ],

        socialLinks: [{ icon: "github", link: "https://github.com/vuejs/vitepress" }],
        footer: {
            message: "Released under the MIT License.",
            copyright: "Copyright 2025-present Jieming Chen",
        },
        search: {
            provider: "local",
        },

        // editLink: {
        //     pattern: "[GITHUB PATH]",
        //     text: "Edit this page on GitHub",
        // },
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
    // async transformPageData(pageData, { siteConfig }) {
    //     if (!pageData.lastUpdated) {
    //         // 这里可以设置你的自定义时间逻辑
    //         pageData.lastUpdated = new Date("2023-11-15"); // 静态时间
    //         // 或者从其他来源获取时间
    //     }
    // },
});
