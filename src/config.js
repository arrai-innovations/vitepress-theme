import fs from "node:fs";
import path from "node:path";

const toPosixPath = (value) => value.split(path.sep).join("/");

const routeFromRelativePath = (relativePath) => {
    const normalized = toPosixPath(relativePath);
    if (normalized === "index.md") {
        return "/";
    }
    if (normalized.endsWith("/index.md")) {
        return `/${normalized.slice(0, -"index.md".length)}`.replace(/\/$/, "") || "/";
    }
    return `/${normalized.replace(/\.md$/, "")}`;
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
