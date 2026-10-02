---
title: Contributing
description: How to report a pronoun that didn't parse, suggest changes to the spec, or contribute code to the reference packages.
sidebar:
  order: 4
---

OpenPronoun is a draft, and it improves with every perspective it hears.
Engineers, designers, linguists, clinicians, and anyone who has been misnamed by
software are all welcome here.

## Report a pronoun that didn't parse

If your pronouns didn't parse or display the way they should, that's a gap in
the lexicon, not a problem with you.
[Open an issue](https://github.com/openpronoun/spec/issues/new) with:

- what you typed, exactly as you'd type it in a form;
- what you expected to see (for example the five forms, or how it should
  display);
- anything about context or usage that matters, if you're comfortable sharing it.

You don't need to know the data model or write any code to help this way.

## Suggest a change to the spec

Ambiguities, missing cases, internationalization gaps, and UX guidance are all
fair game. Open an issue to discuss, or edit the page directly: every docs page
has an **Edit page** link at the bottom, and the source lives in
[`docs/src/content/docs`](https://github.com/openpronoun/spec/tree/main/docs/src/content/docs).

Normative changes (anything on the [Conformance](/specification/conformance/)
page, or rules it references) should explain the case they fix and how existing
implementations are affected.

## Contribute code

The repository is an npm workspaces monorepo built with
[Turborepo](https://turbo.build) and versioned with
[Changesets](https://github.com/changesets/changesets). It needs Node 24 or newer.

```sh
npm install            # install root + all workspaces
npm run build          # build packages, then docs
npm run test           # run tests
npm run lint           # lint
npm run typecheck      # type-check
npm run check:exports  # verify package exports (publint + attw)
npm run format         # format with Prettier
```

Changes to a published package need a changeset, which CI checks on pull
requests:

```sh
npm run changeset
```

New parsing or formatting behavior should come with fixtures in
[`@openpronoun/conformance`](https://github.com/openpronoun/spec/tree/main/packages/conformance),
so ports in other languages pick up the same expectations.

## Work on these docs

The site is built with [Astro](https://astro.build) and
[Starlight](https://starlight.astro.build) and deploys to GitHub Pages.

```sh
npm run docs:dev       # local dev server
npm run docs:build     # production build
npm run docs:preview   # preview the production build
```

The explainer animations on the home page live in `docs/public/media/` and are
shared with the repository README.
