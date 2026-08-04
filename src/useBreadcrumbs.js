import { computed } from "vue";
import { useData, useRoute } from "vitepress";

import { breadcrumbsForRoute } from "./breadcrumbs.js";

/**
 * Resolve the current page's configured breadcrumb state.
 *
 * @returns {{crumbs: import("vue").ComputedRef, visible: import("vue").ComputedRef}} Breadcrumb state.
 */
export const useBreadcrumbs = () => {
    const route = useRoute();
    const { frontmatter, theme } = useData();

    const crumbs = computed(() => {
        if (frontmatter.value.layout === "home" || frontmatter.value.layout === false) {
            return [];
        }
        if (frontmatter.value.breadcrumbs === false) {
            return [];
        }

        const options = theme.value.breadcrumbs || {};
        return breadcrumbsForRoute(route.path, options.routes || theme.value.routeTitles || {});
    });

    const visible = computed(() => {
        const minimumDepth = theme.value.breadcrumbs?.minDepth ?? 2;
        return crumbs.value.length >= minimumDepth;
    });

    return { crumbs, visible };
};
