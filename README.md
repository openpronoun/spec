# OpenPronoun

> A specification for representing, exchanging, parsing, and displaying personal pronouns in software systems.

This is the monorepo for the `@openpronoun/*` package ecosystem.

## Packages

| Package | Description | Status |
|---|---|---|
| [`@openpronoun/core`](./packages/core) | Core specification types and utilities | Placeholder |
| [`@openpronoun/react`](./packages/react) | React bindings for OpenPronoun | Placeholder |

## Documentation

The documentation site is built with [Astro](https://astro.build) + [Starlight](https://starlight.astro.build) and deploys to GitHub Pages.

```bash
npm run docs:dev      # local dev server
npm run docs:build    # production build
npm run docs:preview  # preview production build
```

## Development

```bash
# Install all dependencies (root + all workspaces)
npm install

# Build all packages and docs (in dependency order via Turborepo)
npm run build

# Run tests
npm run test

# Lint
npm run lint

# Type-check
npm run typecheck

# Verify package exports (publint + attw)
npm run check:exports

# Format code
npm run format
```

## Creating a new package

```bash
npm run new -- <name>           # standard package
npm run new -- <name> --react   # React adapter package (adds peer deps + core dep)
```

## Versioning and publishing

This monorepo uses [Changesets](https://github.com/changesets/changesets) for versioning and publishing.

```bash
npm run changeset    # create a changeset
npm run version      # apply changesets and bump versions
npm run release      # build and publish to npm
```

## License

[MIT](./LICENSE)
