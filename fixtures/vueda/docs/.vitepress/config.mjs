import { fileURLToPath } from "node:url";

import { buildBreadcrumbRoutes } from "@arrai-innovations/vitepress-theme/config";
import { defineConfig } from "vitepress";

const docsRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
    title: "VUEDA",
    description: "A fixture for an extended Arrai documentation theme.",
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
            { text: "Button", link: "/reference/api/client/button" },
        ],
    },
});
