<script setup>
import { withBase } from "vitepress";
import { useSidebar } from "vitepress/theme";

import { useBreadcrumbs } from "../useBreadcrumbs.js";

const { hasSidebar } = useSidebar();
const { crumbs, visible } = useBreadcrumbs();
</script>

<template>
    <nav v-if="visible" class="arrai-breadcrumbs" :class="{ 'has-sidebar': hasSidebar }" aria-label="Breadcrumb">
        <ol>
            <li v-for="crumb in crumbs" :key="crumb.text">
                <a v-if="crumb.href" :href="withBase(crumb.href)">{{ crumb.text }}</a>
                <span v-else :aria-current="crumb === crumbs.at(-1) ? 'page' : undefined">{{ crumb.text }}</span>
            </li>
        </ol>
    </nav>
</template>

<style scoped>
.arrai-breadcrumbs {
    width: 100%;
    padding: 0.5rem 24px;
    border-bottom: 1px solid var(--vp-c-gutter);
    color: var(--vp-c-text-2);
    background-color: var(--vp-local-nav-bg-color);
    font-size: 0.8rem;
}

@media (min-width: 768px) {
    .arrai-breadcrumbs {
        padding: 0.5rem 32px;
    }
}

@media (min-width: 960px) {
    .arrai-breadcrumbs {
        position: fixed;
        z-index: var(--vp-z-index-local-nav);
        top: var(--vp-nav-height);
        right: 0;
        left: 0;
        padding: 0.5rem 32px;
    }

    .arrai-breadcrumbs.has-sidebar {
        padding-left: calc(var(--vp-sidebar-width) + 32px);
    }
}

@media (min-width: 1440px) {
    .arrai-breadcrumbs.has-sidebar {
        padding-right: calc((100vw - var(--vp-layout-max-width)) / 2 + 32px);
        padding-left: calc((100vw - var(--vp-layout-max-width)) / 2 + var(--vp-sidebar-width) + 32px);
    }
}

.arrai-breadcrumbs ol {
    display: flex;
    flex-wrap: wrap;
    gap: 0.25rem 0.5rem;
    align-items: center;
    margin: 0;
    padding: 0;
    list-style: none;
}

.arrai-breadcrumbs li {
    display: inline-flex;
    gap: 0.5rem;
    align-items: center;
}

.arrai-breadcrumbs li + li::before {
    color: var(--vp-c-divider);
    content: "/";
}

.arrai-breadcrumbs a {
    color: var(--vp-c-text-2);
    text-decoration: none;
    transition: color 0.2s;
}

.arrai-breadcrumbs a:hover {
    color: var(--vp-c-brand-1);
}

.arrai-breadcrumbs [aria-current="page"] {
    color: var(--vp-c-text-1);
    font-weight: 500;
}
</style>
