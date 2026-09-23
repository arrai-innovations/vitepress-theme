import { createArraiTheme } from "@arrai-innovations/vitepress-theme";
import { h } from "vue";

import HeroCode from "./components/HeroCode.vue";

export default createArraiTheme({
    layoutSlots: { "home-hero-image": () => h(HeroCode) },
});
