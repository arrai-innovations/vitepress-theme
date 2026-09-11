import type { HeadConfig } from "vitepress";

import type { BreadcrumbRouteIndex } from "./index.js";

export const arraiThemeRoot: string;

export interface BuildBreadcrumbRoutesOptions {
    docsRoot: string;
    exclude?: (relativePath: string) => boolean;
    getTitle?: (page: BreadcrumbSourcePage) => string | null | undefined;
    virtualRoutes?: BreadcrumbRouteIndex;
}

export interface BreadcrumbSourcePage {
    filePath: string;
    relativePath: string;
    route: string;
    source: string;
}

export function buildBreadcrumbRoutes(options: BuildBreadcrumbRoutesOptions): BreadcrumbRouteIndex;

export interface SocialCardPage {
    relativePath?: string;
    title?: string;
    description?: string;
    frontmatter?: Record<string, unknown>;
}

export interface SocialCardSite {
    title?: string;
    description?: string;
}

export interface SocialCardImageSize {
    width: number | string;
    height: number | string;
}

export interface BuildSocialHeadOptions {
    siteUrl: string;
    base?: string;
    pageData: SocialCardPage;
    siteData?: SocialCardSite;
    image?: string;
    imageSize?: SocialCardImageSize;
    imageAlt?: string;
    cardType?: string;
    themeColor?: string;
}

export function buildSocialHead(options: BuildSocialHeadOptions): HeadConfig[];
