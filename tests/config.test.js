import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { arraiThemeRoot, buildBreadcrumbRoutes, buildSocialHead } from "../src/config.js";

const temporaryDirectories = [];

const fixtureDocs = () => {
    const docsRoot = fs.mkdtempSync(path.join(os.tmpdir(), "arrai-vitepress-theme-"));
    temporaryDirectories.push(docsRoot);
    fs.mkdirSync(path.join(docsRoot, "guide"));
    fs.mkdirSync(path.join(docsRoot, "reference", "api", "use"), { recursive: true });
    fs.writeFileSync(path.join(docsRoot, "index.md"), "# Home\n");
    fs.writeFileSync(path.join(docsRoot, "guide", "index.md"), "---\ntitle: How-to\n---\n\n# Guide\n");
    fs.writeFileSync(path.join(docsRoot, "guide", "draft.md"), "# Draft\n");
    fs.writeFileSync(path.join(docsRoot, "reference", "api", "use", "list.md"), "# use/list\n");
    return docsRoot;
};

afterEach(() => {
    for (const directory of temporaryDirectories.splice(0)) {
        fs.rmSync(directory, { recursive: true, force: true });
    }
});

describe("buildBreadcrumbRoutes", () => {
    it("exposes the package root for linked-package dev servers", () => {
        expect(path.isAbsolute(arraiThemeRoot)).toBe(true);
        expect(fs.existsSync(path.join(arraiThemeRoot, "package.json"))).toBe(true);
    });

    it("indexes authored and generated pages and merges structural routes", () => {
        const docsRoot = fixtureDocs();

        expect(
            buildBreadcrumbRoutes({
                docsRoot,
                exclude: (relativePath) => relativePath === "guide/draft.md",
                getTitle: ({ route }) => (route === "/reference/api/use/list" ? "list" : null),
                virtualRoutes: { "/reference/api/use": "use" },
            }),
        ).toEqual({
            "/": { text: "Home", link: true },
            "/guide": { text: "How-to", link: true },
            "/reference/api/use/list": { text: "list", link: true },
            "/reference/api/use": { text: "use", link: false },
        });
    });

    it("requires an absolute docs root", () => {
        expect(() => buildBreadcrumbRoutes({ docsRoot: "docs" })).toThrow("docsRoot must be an absolute path");
    });
});

const siteData = { title: "reactive-helpers", description: "Reactive composition utilities for Vue 3." };

const contentFor = (head, key) =>
    head.find(([, attributes]) => attributes.property === key || attributes.name === key)?.[1].content ?? null;

describe("buildSocialHead", () => {
    it("describes the root index with absolute URLs and site fallbacks", () => {
        expect(
            buildSocialHead({
                siteUrl: "https://docs.example.com/",
                pageData: { relativePath: "index.md", title: "", description: "", frontmatter: { layout: "home" } },
                siteData,
                image: "/social-card.png",
                imageSize: { width: 1200, height: 630 },
                imageAlt: "reactive-helpers documentation",
                themeColor: "#101014",
            }),
        ).toEqual([
            ["meta", { property: "og:type", content: "website" }],
            ["meta", { property: "og:site_name", content: "reactive-helpers" }],
            ["meta", { property: "og:title", content: "reactive-helpers" }],
            ["meta", { property: "og:description", content: "Reactive composition utilities for Vue 3." }],
            ["meta", { property: "og:url", content: "https://docs.example.com/" }],
            ["meta", { property: "og:image", content: "https://docs.example.com/social-card.png" }],
            ["meta", { property: "og:image:width", content: "1200" }],
            ["meta", { property: "og:image:height", content: "630" }],
            ["meta", { property: "og:image:alt", content: "reactive-helpers documentation" }],
            ["meta", { name: "twitter:card", content: "summary_large_image" }],
            ["meta", { name: "theme-color", content: "#101014" }],
        ]);
    });

    it("keeps a nested index on its directory URL", () => {
        const head = buildSocialHead({
            siteUrl: "https://docs.example.com",
            pageData: {
                relativePath: "reference/api/index.md",
                title: "Reference",
                description: "Generated API reference.",
                frontmatter: {},
            },
            siteData,
        });

        expect(contentFor(head, "og:url")).toBe("https://docs.example.com/reference/api/");
        expect(contentFor(head, "og:title")).toBe("Reference");
        expect(contentFor(head, "og:description")).toBe("Generated API reference.");
    });

    it("prefers frontmatter over resolved page metadata", () => {
        const head = buildSocialHead({
            siteUrl: "https://docs.example.com",
            pageData: {
                relativePath: "guide/data-layer.md",
                title: "Data layer",
                description: "The inferred description.",
                frontmatter: { title: "Data layer guide", description: "The authored description." },
            },
            siteData,
        });

        expect(contentFor(head, "og:url")).toBe("https://docs.example.com/guide/data-layer");
        expect(contentFor(head, "og:title")).toBe("Data layer guide");
        expect(contentFor(head, "og:description")).toBe("The authored description.");
    });

    it("falls back to the site description, then omits the tag when neither page nor site has one", () => {
        const withSiteDescription = buildSocialHead({
            siteUrl: "https://docs.example.com",
            pageData: { relativePath: "guide/data-layer.md", title: "Data layer", description: "", frontmatter: {} },
            siteData,
        });
        const withoutAnyDescription = buildSocialHead({
            siteUrl: "https://docs.example.com",
            pageData: { relativePath: "guide/data-layer.md", title: "Data layer", description: "", frontmatter: {} },
            siteData: { title: "reactive-helpers" },
        });

        expect(contentFor(withSiteDescription, "og:description")).toBe("Reactive composition utilities for Vue 3.");
        expect(contentFor(withoutAnyDescription, "og:description")).toBe(null);
    });

    it("resolves page and image URLs through a versioned base", () => {
        const head = buildSocialHead({
            siteUrl: "https://docs.example.com",
            base: "/v25/",
            pageData: { relativePath: "guide/index.md", title: "How-to", description: "", frontmatter: {} },
            siteData,
            image: "social-card.png",
        });

        expect(contentFor(head, "og:url")).toBe("https://docs.example.com/v25/guide/");
        expect(contentFor(head, "og:image")).toBe("https://docs.example.com/v25/social-card.png");
    });

    it("accepts a base written without surrounding slashes and an externally hosted image", () => {
        const head = buildSocialHead({
            siteUrl: "https://docs.example.com",
            base: "vueda",
            pageData: { relativePath: "index.md", title: "About VUEDA", description: "", frontmatter: {} },
            siteData: { title: "VUEDA" },
            image: "https://cdn.example.com/vueda/social-card.png",
            cardType: "summary",
        });

        expect(contentFor(head, "og:url")).toBe("https://docs.example.com/vueda/");
        expect(contentFor(head, "og:image")).toBe("https://cdn.example.com/vueda/social-card.png");
        expect(contentFor(head, "twitter:card")).toBe("summary");
    });

    it("omits image tags when no card image is configured", () => {
        const head = buildSocialHead({
            siteUrl: "https://docs.example.com",
            pageData: { relativePath: "index.md", title: "", description: "", frontmatter: {} },
            siteData,
            imageSize: { width: 1200, height: 630 },
            imageAlt: "Unused without an image",
        });

        expect(head.some(([, attributes]) => String(attributes.property).startsWith("og:image"))).toBe(false);
    });

    it("requires an absolute site URL", () => {
        expect(() => buildSocialHead({ siteUrl: "/docs", pageData: { relativePath: "index.md" } })).toThrow(
            "siteUrl must be an absolute http or https URL",
        );
    });
});
