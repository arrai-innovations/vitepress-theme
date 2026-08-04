# Repository Guide

This package provides the shared Arrai Innovations VitePress shell. Keep product-specific documentation behaviour in the
consuming repository.

## Commands

- Install dependencies: `pnpm install`
- Run all checks: `pnpm check`
- Run unit tests: `pnpm test`
- Build both downstream-shaped fixtures: `pnpm build:fixtures`
- Preview reactive-helpers integration: `pnpm dev:reactive-helpers`
- Preview VUEDA integration: `pnpm dev:vueda`
- Apply ESLint and Prettier fixes: `pnpm fix`

## Conventions

- Keep the default export suitable for a documentation site that needs no custom application setup.
- Add shared behaviour through `createArraiTheme` extension points instead of importing product code.
- Treat imports from `vitepress/dist` as a compatibility surface. Both fixture builds must pass when they change.
- Use Canadian spelling in prose.
- Always use braces for `if` statements.

## Committing

- Do not run `git commit` for the user.
- Use Conventional Commit suggestions without words beginning with `@`.
