const humanizeSegment = (segment) => {
    let value;
    try {
        value = decodeURIComponent(segment);
    } catch {
        value = segment;
    }

    return value
        .replace(/[-_]+/g, " ")
        .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
        .replace(/^\p{Ll}/u, (letter) => letter.toUpperCase());
};

const normalizeRoute = (route) => {
    const withoutQuery = route.split(/[?#]/, 1)[0] || "/";
    if (withoutQuery === "/") {
        return withoutQuery;
    }
    return withoutQuery.replace(/\.html$/, "").replace(/\/+$/, "");
};

const normalizeEntry = (entry, fallbackText) => {
    if (typeof entry === "string") {
        return { text: entry, link: true };
    }
    if (entry) {
        return { text: entry.text || fallbackText, link: entry.link !== false };
    }
    return { text: fallbackText, link: false };
};

/**
 * Build breadcrumb items for a VitePress route.
 *
 * Only routes present in the route index become links. Virtual grouping routes
 * therefore remain readable without creating links to pages that do not exist.
 *
 * @param {string} route - Current VitePress route.
 * @param {object} routes - Route metadata keyed by absolute route.
 * @returns {Array<{text: string, href: string | null}>} Breadcrumb items.
 */
export const breadcrumbsForRoute = (route, routes = {}) => {
    const normalized = normalizeRoute(route);
    if (normalized === "/") {
        return [];
    }

    const segments = normalized.slice(1).split("/");
    let accumulated = "";

    return segments.map((segment, index) => {
        accumulated += `/${segment}`;
        const entry = normalizeEntry(routes[accumulated], humanizeSegment(segment));
        const isLast = index === segments.length - 1;
        return {
            text: entry.text,
            href: !isLast && entry.link ? accumulated : null,
        };
    });
};
