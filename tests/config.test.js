import fs from "node:fs";
import os from "node:os";
import path from "node:path";

import { afterEach, describe, expect, it } from "vitest";

import { buildBreadcrumbRoutes } from "../src/config.js";

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
