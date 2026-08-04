import { describe, expect, it } from "vitest";

import { breadcrumbsForRoute } from "../src/breadcrumbs.js";

describe("breadcrumbsForRoute", () => {
    it("builds linked page crumbs and non-linking structural crumbs", () => {
        const routes = {
            "/reference": { text: "Reference", link: true },
            "/reference/api": { text: "API index", link: true },
            "/reference/api/use": { text: "use", link: false },
            "/reference/api/use/listInstance": { text: "listInstance", link: true },
        };

        expect(breadcrumbsForRoute("/reference/api/use/listInstance.html", routes)).toEqual([
            { text: "Reference", href: "/reference" },
            { text: "API index", href: "/reference/api" },
            { text: "use", href: null },
            { text: "listInstance", href: null },
        ]);
    });

    it("does not invent links for routes absent from the index", () => {
        expect(breadcrumbsForRoute("/guides/missing-page", { "/guides": "Guides" })).toEqual([
            { text: "Guides", href: "/guides" },
            { text: "Missing page", href: null },
        ]);
    });

    it("normalizes trailing slashes, query strings, and encoded segments", () => {
        expect(breadcrumbsForRoute("/core-concepts/data%20flow/?view=all")).toEqual([
            { text: "Core concepts", href: null },
            { text: "Data flow", href: null },
        ]);
    });

    it("returns no crumbs for the site root", () => {
        expect(breadcrumbsForRoute("/")).toEqual([]);
    });
});
