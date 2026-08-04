# Arrai VitePress theme

The shared VitePress shell for Arrai Innovations public projects. It provides the common visual system, responsive
breadcrumbs, and extension points needed by both small documentation sites and application-backed component docs.

The theme deliberately leaves navigation, sidebars, public logo files, generated documentation, and product components
with each downstream project.

## Requirements

- Node.js 22 or newer
- VitePress 1.6
- Vue 3.5

## Install

```bash
pnpm add -D @arrai-innovations/vitepress-theme vitepress vue
```

Use the default theme when a site has no custom Vue setup:

```js
// docs/.vitepress/theme/index.js
export { default } from "@arrai-innovations/vitepress-theme";
```

The package imports the Arrai styles and locally served variable fonts. The font dependencies include their own SIL Open
Font License notices.

## Breadcrumbs

Build route metadata in the VitePress config. Existing Markdown pages become safe links. Structural routes that have no
landing page remain labels, so generated API hierarchies do not produce dead links.

```js
// docs/.vitepress/config.mjs
import { fileURLToPath } from "node:url";

import { buildBreadcrumbRoutes } from "@arrai-innovations/vitepress-theme/config";
import { defineConfig } from "vitepress";

const docsRoot = fileURLToPath(new URL("..", import.meta.url));

export default defineConfig({
    themeConfig: {
        breadcrumbs: {
            routes: buildBreadcrumbRoutes({
                docsRoot,
                virtualRoutes: {
                    "/reference/api/config": "config",
                    "/reference/api/use": "use",
                    "/reference/api/utils": "utils",
                },
            }),
        },
    },
});
```

For a local `link:` install, allow the resolved theme root through Vite's dev-server filesystem guard. Published
installs are already inside the downstream dependency tree, but keeping this configuration supports both forms:

```js
import { arraiThemeRoot } from "@arrai-innovations/vitepress-theme/config";

export default defineConfig({
    vite: {
        server: {
            fs: { allow: [repoRoot, arraiThemeRoot] },
        },
    },
});
```

Breadcrumbs appear when a page has at least two route segments. Change that threshold globally with `minDepth`, or set
`breadcrumbs: false` in a page's frontmatter.

```js
themeConfig: {
    breadcrumbs: {
        minDepth: 3,
        routes,
    },
}
```

The index helper accepts an `exclude(relativePath)` predicate for draft pages and other files omitted from the
production site. Its optional `getTitle({ filePath, relativePath, route, source })` callback lets a downstream reuse an
existing frontmatter or generated-reference parser. A virtual route also accepts `{ text, link }` when a custom route is
safe to link.

## Extend the theme

Use `createArraiTheme` when a downstream site registers components or adds content around the shared layout:

```js
// docs/.vitepress/theme/index.js
import { createArraiTheme } from "@arrai-innovations/vitepress-theme";
import { h } from "vue";

import VersionFooter from "./components/VersionFooter.vue";

export default createArraiTheme({
    layoutSlots: {
        "layout-bottom": () => h(VersionFooter),
    },
    enhanceApp({ app }) {
        app.component("ProductDemo", ProductDemo);
    },
});
```

`createArraiTheme` calls the VitePress default `enhanceApp` before the downstream callback. Layout slots use the names
from VitePress's default theme, including `layout-top`, `layout-bottom`, `doc-before`, and `doc-after`.

## Downstream adoption

### reactive-helpers

The `fixtures/reactive-helpers` site models the intended minimal integration:

1. Replace the local theme export with the package default.
2. Build breadcrumb routes in `config.mjs` using the existing draft exclusion rules.
3. Declare `config`, `use`, and `utils` as non-linking virtual routes until group landing pages exist.
4. Retain the downstream cube logo, favicons, navigation, sidebar, home content, and deployment base.

### VUEDA

The `fixtures/vueda` site models the extended integration:

1. Replace the local branded CSS, font files, layout, and breadcrumb component with this package.
2. Keep the version footer through the `layout-bottom` slot.
3. Keep demo components, Pinia, Font Awesome, Tailwind, and product theme setup in the downstream `enhanceApp` callback.
4. Replace `routeTitles` with `breadcrumbs.routes`, retaining the existing generated route scan and exclusions.

## Development

```bash
pnpm install
pnpm check
```

The fixture builds are executable integration tests for the two downstream shapes:

```bash
pnpm dev:reactive-helpers
pnpm dev:vueda
pnpm build:fixtures
```

The shared layout imports VitePress 1 default-theme internals because VitePress does not expose the required breadcrumb
placement through a stable layout slot. The peer dependency and both fixture builds make that compatibility surface
explicit.

## Public API

| Export                                 | Purpose                                             |
| -------------------------------------- | --------------------------------------------------- |
| Package default                        | Ready-to-use Arrai theme                            |
| `createArraiTheme`                     | Theme factory for application and layout extensions |
| `ArraiLayout`                          | Shared layout component                             |
| `Breadcrumbs`                          | Shared breadcrumb component                         |
| `breadcrumbsForRoute`                  | Pure route-to-crumb utility                         |
| `buildBreadcrumbRoutes` from `/config` | Node-side Markdown route indexer                    |
| `/brand.css`                           | Styles without the theme object                     |

## Licence

BSD 3-Clause. Bundled font dependencies are licensed separately under the SIL Open Font License 1.1.
