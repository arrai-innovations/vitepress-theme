import type { Component, Slots } from "vue";
import type { Theme } from "vitepress";

export interface ArraiThemeOptions {
    layoutSlots?: Slots;
    enhanceApp?: NonNullable<Theme["enhanceApp"]>;
}

export interface BreadcrumbItem {
    text: string;
    href: string | null;
}

export function createArraiTheme(options?: ArraiThemeOptions): Theme;
export function breadcrumbsForRoute(route: string, routes?: BreadcrumbRouteIndex): BreadcrumbItem[];

export interface BreadcrumbRoute {
    text: string;
    link?: boolean;
}

export type BreadcrumbRouteIndex = Record<string, string | BreadcrumbRoute>;

export const ArraiLayout: Component;
export const Breadcrumbs: Component;

declare const theme: Theme;
export default theme;
