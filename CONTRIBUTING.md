# Contributing

Run `pnpm check` before proposing a change. It verifies source style, unit behaviour, the minimal reactive-helpers
integration, the extended VUEDA integration, and the published package contents.

Keep changes in the shared theme only when both downstream shapes can use them. Product navigation, documentation
generation, demo frameworks, and deployment behaviour belong downstream.

When updating VitePress, inspect every import from `vitepress/dist`, then build both fixtures. A successful unit suite
is not sufficient because those imports are not part of VitePress's public API.
