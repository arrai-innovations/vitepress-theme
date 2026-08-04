import { createArraiTheme } from "@arrai-innovations/vitepress-theme";
import { h } from "vue";

import VersionFooter from "./components/VersionFooter.vue";

export default createArraiTheme({
    layoutSlots: {
        "layout-bottom": () => h(VersionFooter),
    },
    enhanceApp({ app }) {
        app.component("FixtureBadge", {
            props: { text: { type: String, required: true } },
            template: '<span class="fixture-badge">{{ text }}</span>',
        });
    },
});
