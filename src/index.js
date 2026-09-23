import { h } from "vue";
import DefaultTheme from "vitepress/theme";

import Layout from "./Layout.vue";
import "./brand.css";
import "./home.css";

/**
 * Create an Arrai theme with product-specific layout slots and application setup.
 *
 * @param {object} options - Theme extension options.
 * @param {object} [options.layoutSlots] - Slots forwarded to the shared layout.
 * @param {(context: object) => void} [options.enhanceApp] - Product application setup.
 * @returns {object} VitePress theme.
 */
export const createArraiTheme = ({ layoutSlots = {}, enhanceApp } = {}) => ({
    ...DefaultTheme,
    Layout: () => h(Layout, null, layoutSlots),
    enhanceApp(context) {
        DefaultTheme.enhanceApp?.(context);
        enhanceApp?.(context);
    },
});

export { default as ArraiLayout } from "./Layout.vue";
export { default as Breadcrumbs } from "./components/Breadcrumbs.vue";
export { default as ArraiPreview } from "./components/ArraiPreview.vue";
export { breadcrumbsForRoute } from "./breadcrumbs.js";

export default createArraiTheme();
