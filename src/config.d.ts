import type { BreadcrumbRouteIndex } from "./index.js";

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
