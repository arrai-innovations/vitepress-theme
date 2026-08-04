import js from "@eslint/js";
import eslintConfigPrettier from "eslint-config-prettier";
import pluginVue from "eslint-plugin-vue";
import globals from "globals";

export default [
    {
        ignores: [
            ".prettierrc.cjs",
            "**/node_modules/**",
            "**/coverage/**",
            "**/.vitepress/cache/**",
            "**/.vitepress/.temp/**",
            "**/.vitepress/dist/**",
        ],
    },
    js.configs.recommended,
    ...pluginVue.configs["flat/recommended"],
    {
        files: ["**/*.{js,mjs,vue}"],
        languageOptions: {
            ecmaVersion: "latest",
            globals: {
                ...globals.browser,
                ...globals.node,
            },
        },
        rules: {
            "no-console": "off",
        },
    },
    {
        files: ["src/**/*.vue"],
        rules: {
            "vue/multi-word-component-names": "off",
        },
    },
    eslintConfigPrettier,
];
