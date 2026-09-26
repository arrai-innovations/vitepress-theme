import { fileURLToPath } from "node:url";

import { buildBreadcrumbRoutes, buildSocialHead } from "@arrai-innovations/vitepress-theme/config";
import { defineConfig } from "vitepress";

const docsRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
    title: "VUEDA",
    description: "A fixture for an extended Arrai documentation theme.",
    base: "/vueda/",
    transformPageData(pageData, { siteConfig }) {
        return {
            frontmatter: {
                ...pageData.frontmatter,
                head: [
                    ...(pageData.frontmatter.head ?? []),
                    ...buildSocialHead({
                        siteUrl: "https://docs.example.com",
                        base: siteConfig.site.base,
                        pageData,
                        siteData: siteConfig.site,
                        image: "/social-card.png",
                        imageSize: { width: 1200, height: 630 },
                    }),
                ],
            },
        };
    },
    themeConfig: {
        breadcrumbs: {
            routes: buildBreadcrumbRoutes({
                docsRoot,
                virtualRoutes: { "/reference/api": { text: "API", link: false } },
            }),
        },
        nav: [
            { text: "Core Concepts", link: "/core-concepts/" },
            { text: "Reference", link: "/reference/api/client/button" },
        ],
        sidebar: [
            { text: "Core Concepts", link: "/core-concepts/metadata" },
            { text: "Custom containers", link: "/core-concepts/containers" },
            { text: "Button", link: "/reference/api/client/button" },
        ],
    },
});
