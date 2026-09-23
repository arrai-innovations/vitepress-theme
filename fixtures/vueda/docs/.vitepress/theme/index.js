import { createArraiTheme } from "@arrai-innovations/vitepress-theme";
import { h } from "vue";

import VersionFooter from "./components/VersionFooter.vue";
import HomePreview from "./components/HomePreview.vue";

export default createArraiTheme({
    layoutSlots: {
        "home-hero-image": () => h(HomePreview),
        "layout-bottom": () => h(VersionFooter),
    },
    enhanceApp({ app }) {
        app.component("FixtureBadge", {
            props: { text: { type: String, required: true } },
            template: '<span class="fixture-badge">{{ text }}</span>',
        });
    },
});
