import { fileURLToPath } from "node:url";

import { buildBreadcrumbRoutes } from "@arrai-innovations/vitepress-theme/config";
import { defineConfig } from "vitepress";

const docsRoot = fileURLToPath(new URL("..", import.meta.url));
const routes = buildBreadcrumbRoutes({
    docsRoot,
    virtualRoutes: {
        "/reference/api/use": "use",
    },
});

export default defineConfig({
    title: "reactive-helpers",
    description: "Reactive composition utilities for Vue 3.",
    themeConfig: {
        breadcrumbs: { routes },
        nav: [
            { text: "How-to", link: "/guide/" },
            { text: "Reference", link: "/reference/" },
        ],
        sidebar: {
            "/guide/": [{ text: "How-to", items: [{ text: "Data layer", link: "/guide/data-layer" }] }],
            "/reference/": [
                {
                    text: "Reference",
                    items: [{ text: "listInstance", link: "/reference/api/use/listInstance" }],
                },
            ],
        },
    },
});
