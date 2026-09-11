import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

/** Absolute package root for Vite's local-link filesystem allowlist. */
export const arraiThemeRoot = fileURLToPath(new URL("..", import.meta.url));

const absoluteUrlPattern = /^https?:\/\//i;

const toPosixPath = (value) => value.split(path.sep).join("/");

/**
 * Resolve a Markdown path to its served page path, in VitePress clean-URL form.
 *
 * Directory indexes keep their trailing slash so a canonical URL points at the
 * directory rather than at a sibling page.
 */
const pagePathFromRelativePath = (relativePath) => {
    const normalized = toPosixPath(relativePath).replace(/\.md$/, "");
    if (normalized === "index") {
        return "/";
    }
    if (normalized.endsWith("/index")) {
        return `/${normalized.slice(0, -"index".length)}`;
    }
    return `/${normalized}`;
};

/** Breadcrumb route key for a Markdown path: the page path without a trailing slash. */
const routeFromRelativePath = (relativePath) => {
    const pagePath = pagePathFromRelativePath(relativePath);
    if (pagePath === "/") {
        return pagePath;
    }
    return pagePath.replace(/\/$/, "");
};

/** Normalize a deployment base to a leading and trailing slash, so `/` stays `/`. */
const normalizeBase = (base) => {
    const trimmed = base.replace(/^\/+|\/+$/g, "");
    if (!trimmed) {
        return "/";
    }
    return `/${trimmed}/`;
};

/** Resolve a site-root-relative path against the origin and base, passing absolute URLs through. */
const withOrigin = (origin, base, pathname) => {
    if (absoluteUrlPattern.test(pathname)) {
        return pathname;
    }
    return `${origin}${base}${pathname.replace(/^\/+/, "")}`;
};

const frontmatterTitle = (source) => {
    const frontmatter = source.match(/^---\r?\n([\s\S]*?)\r?\n---/);
    if (!frontmatter) {
        return null;
    }
    const title = frontmatter[1].match(/^title:\s*["']?(.+?)["']?\s*$/m);
    return title?.[1] || null;
};

const headingTitle = (source) => source.match(/^#\s+(.+?)\s*$/m)?.[1] || null;

const walkMarkdown = (directory, found = []) => {
    for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
        const absolutePath = path.join(directory, entry.name);
        if (entry.isDirectory()) {
            if (entry.name !== ".vitepress" && entry.name !== "node_modules") {
                walkMarkdown(absolutePath, found);
            }
        } else if (entry.name.endsWith(".md")) {
            found.push(absolutePath);
        }
    }
    return found;
};

/**
 * Index Markdown pages for breadcrumb labels and safe links.
 *
 * Virtual routes can label structural segments that have no page. They are
 * non-linking by default, which prevents breadcrumb links to missing indexes.
 *
 * @param {object} options - Index options.
 * @param {string} options.docsRoot - Absolute VitePress source directory.
 * @param {(relativePath: string) => boolean} [options.exclude] - Page exclusion predicate.
 * @param {(page: object) => string | null} [options.getTitle] - Custom page-title resolver.
 * @param {object} [options.virtualRoutes] - Additional structural route labels.
 * @returns {object} Route metadata for `themeConfig.breadcrumbs.routes`.
 */
export const buildBreadcrumbRoutes = ({ docsRoot, exclude = () => false, getTitle, virtualRoutes = {} }) => {
    if (!path.isAbsolute(docsRoot)) {
        throw new TypeError("docsRoot must be an absolute path.");
    }

    const routes = {};
    for (const filePath of walkMarkdown(docsRoot)) {
        const relativePath = toPosixPath(path.relative(docsRoot, filePath));
        if (exclude(relativePath)) {
            continue;
        }

        const source = fs.readFileSync(filePath, "utf8");
        const route = routeFromRelativePath(relativePath);
        const fallback = path.basename(filePath, ".md");
        routes[route] = {
            text:
                getTitle?.({ filePath, relativePath, route, source }) ||
                frontmatterTitle(source) ||
                headingTitle(source) ||
                fallback,
            link: true,
        };
    }

    for (const [route, entry] of Object.entries(virtualRoutes)) {
        routes[route] = typeof entry === "string" ? { text: entry, link: false } : { link: false, ...entry };
    }

    return routes;
};

/**
 * Build the Open Graph and Twitter card tags for one page.
 *
 * Link-preview crawlers read the served HTML and run no JavaScript, so these
 * tags belong in a build-time hook such as `transformPageData`. They also
 * resolve nothing relative, which is why `siteUrl` is required and every
 * emitted URL is absolute.
 *
 * Per-site values stay with the consuming repository. This helper only shapes
 * them, reusing the page-path rule that also produces breadcrumb routes.
 *
 * @param {object} options - Card options.
 * @param {string} options.siteUrl - Absolute site origin, such as `https://docs.arrai.dev`.
 * @param {string} [options.base] - Deployment base path, matching the VitePress `base`.
 * @param {object} options.pageData - VitePress page data for the page being rendered.
 * @param {object} [options.siteData] - VitePress site data, used for title and description fallbacks.
 * @param {string} [options.image] - Card image, absolute or site-root-relative. Crawlers ignore SVG.
 * @param {{width: number | string, height: number | string}} [options.imageSize] - Card image dimensions.
 * @param {string} [options.imageAlt] - Card image alternative text.
 * @param {string} [options.cardType] - Twitter card type. Defaults to `summary_large_image`.
 * @param {string} [options.themeColor] - Browser and preview accent colour.
 * @returns {Array<[string, object]>} Head tags for `frontmatter.head`.
 */
export const buildSocialHead = ({
    siteUrl,
    base = "/",
    pageData = {},
    siteData = {},
    image,
    imageSize,
    imageAlt,
    cardType = "summary_large_image",
    themeColor,
}) => {
    if (typeof siteUrl !== "string" || !absoluteUrlPattern.test(siteUrl)) {
        throw new TypeError("siteUrl must be an absolute http or https URL.");
    }

    const origin = siteUrl.replace(/\/+$/, "");
    const basePath = normalizeBase(base);
    const frontmatter = pageData.frontmatter ?? {};
    const siteName = siteData.title || "";
    const title = frontmatter.title || pageData.title || siteName;
    const description = frontmatter.description || pageData.description || siteData.description || "";
    const pageUrl = withOrigin(origin, basePath, pagePathFromRelativePath(pageData.relativePath ?? "index.md"));

    const head = [["meta", { property: "og:type", content: "website" }]];
    if (siteName) {
        head.push(["meta", { property: "og:site_name", content: siteName }]);
    }
    if (title) {
        head.push(["meta", { property: "og:title", content: title }]);
    }
    if (description) {
        head.push(["meta", { property: "og:description", content: description }]);
    }
    head.push(["meta", { property: "og:url", content: pageUrl }]);
    if (image) {
        head.push(["meta", { property: "og:image", content: withOrigin(origin, basePath, image) }]);
        if (imageSize) {
            head.push(["meta", { property: "og:image:width", content: String(imageSize.width) }]);
            head.push(["meta", { property: "og:image:height", content: String(imageSize.height) }]);
        }
        if (imageAlt) {
            head.push(["meta", { property: "og:image:alt", content: imageAlt }]);
        }
    }
    if (cardType) {
        head.push(["meta", { name: "twitter:card", content: cardType }]);
    }
    if (themeColor) {
        head.push(["meta", { name: "theme-color", content: themeColor }]);
    }

    return head;
};
