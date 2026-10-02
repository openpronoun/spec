<div align="center">

<picture>
  <source media="(prefers-color-scheme: dark)" srcset="docs/public/media/logo-dark.svg">
  <img alt="OpenPronoun" src="docs/public/media/logo-light.svg" width="364">
</picture>

### An open technical standard for getting pronouns right in software.

Model them, parse them, store them, and display them the way each person asked — consistently, across every system that touches their name.

[![Read the docs](https://img.shields.io/badge/docs-openpronoun.github.io%2Fspec-a400c0)](https://openpronoun.github.io/spec/)
[![Spec status: Draft 0.1](https://img.shields.io/badge/spec-draft%200.1-e3b6ed)](https://openpronoun.github.io/spec/specification/conformance/)
[![npm: @openpronoun/core](https://img.shields.io/npm/v/@openpronoun/core?label=%40openpronoun%2Fcore&color=614e78)](https://www.npmjs.com/package/@openpronoun/core)
[![License: MIT](https://img.shields.io/badge/license-MIT-412e55)](./LICENSE)

**[Documentation](https://openpronoun.github.io/spec/)** ·
**[Specification](https://openpronoun.github.io/spec/specification/conformance/)** ·
**[Usage examples](https://openpronoun.github.io/spec/usage/)** ·
**[Components](#drop-in-components)** ·
**[Packages](#packages)** ·
**[Contributing](#contributing)**

</div>

---

## Why a standard?

Pronouns show up everywhere a person's name does: profiles, patient charts, HR systems, class rosters, chat apps, the emails your product sends on someone's behalf. Today almost every team solves this from scratch, and the usual answers fall short:

- **Free-text fields** are flexible, but software can't use them. You can't safely write "_They_ updated _their_ settings" from a string someone typed.
- **Short dropdowns** leave people out. "He / She / They / Other" tells everyone whose pronouns aren't listed that they're the exception.
- **Nothing interoperates.** Pronouns entered in one system don't survive the trip to the next.

Getting this wrong isn't cosmetic. Misgendering erodes trust, and in settings like healthcare it can discourage people from seeking care at all. OpenPronoun gives teams a shared, well-tested answer so they don't have to invent one — and so the people using their software are addressed correctly everywhere.

## How it works

### 1. Parse whatever people actually type

<p align="center">
  <img src="docs/public/media/openpronoun-parse.webp" alt="Animation: the inputs 'They/Them', 'they / them / theirs' and 'them/they' drift into a pair of curly braces and come out as one structured set with five labelled forms — they (subjective), them (objective), their (possessive adjective), theirs (possessive pronoun), themselves (reflexive)." width="100%">
</p>

Different spellings, spacing, capitalization, and word order all normalize to one canonical **pronoun set** with every grammatical form filled in. Multiple sets (`she/her, they/them`), neopronouns (`xe/xem`, `fae/faer`), and preferences like _any pronouns_, _no pronouns — use my name_, or _ask me_ are first-class, not edge cases. → [Parsing & normalization](https://openpronoun.github.io/spec/specification/parsing/)

### 2. Store once, display everywhere

<p align="center">
  <img src="docs/public/media/openpronoun-display.webp" alt="Animation: a structured record in curly braces sends data along dotted lines to three surfaces — a profile card showing 'They/Them, She/Her', a generated sentence reading 'They shared their notes.', and a public view showing only 'They/Them'." width="100%">
</p>

Because every form is stored, any part of your product can render pronouns consistently: a short label beside a name, a grammatically correct generated sentence, or a public view that hides sets the person only shares with some audiences. → [Display & stringification](https://openpronoun.github.io/spec/specification/display/)

## Drop-in components

Don't want to build the UI yourself? Drop in a component and move on. Each one is built to look good out of the box, take on your design system's look, and follow the spec without you having to read it.

```tsx
import { useState } from "react";
import { PronounDisplay, PronounSelector, type PronounEntry } from "@openpronoun/react";

export function ProfilePronouns() {
  const [pronouns, setPronouns] = useState<PronounEntry[]>([]);

  return (
    <>
      <PronounSelector value={pronouns} onChange={setPronouns} />
      <PronounDisplay pronouns={pronouns} />
    </>
  );
}
```

- **Looks right by default.** Light and dark themes ship in the box, with accessible labels, focus states, and full keyboard support, including drag-to-reorder.
- **Restyles to match you.** Override any theme token (colors, radius, fonts, spacing), attach your own class names to each part of a component, or swap the icons.
- **Behaves to spec.** Components run on [`@openpronoun/core`](./packages/core), so parsing and display follow the standard: common sets and neopronouns are offered up front, anyone can add a custom set in their own words, more than one set is supported, and excluded or privacy-limited sets never show up where they shouldn't.

<!-- prettier-ignore -->
```tsx
import { defaultTheme } from "@openpronoun/react";

<PronounSelector
  value={pronouns}
  onChange={setPronouns}
  theme={{
    colors: { ...defaultTheme.colors, primary: "#0b6e4f", focusRing: "#0b6e4f" },
    borderRadius: "999px",
    fontFamily: "inherit",
  }}
  classNames={{ root: "profile-field", menu: "profile-menu" }}
/>
```

**Available now:** React, in [`@openpronoun/react`](./packages/react). `PronounSelector` for collecting pronouns, `PronounDisplay` and `PronounBadge` for showing them, `PronounForm` and `PronounDetailEditor` for full editing flows, and the `usePronounState` and `usePronounParser` hooks if you'd rather build your own.

**In development:** Preact, being built by a community contributor.

**Open for contributors:** Vue, Svelte, Solid, and a web component that works anywhere, including vanilla JS and Alpine. If you'd like to build one of these, [open an issue](https://github.com/openpronoun/spec/issues/new) to claim it and we'll help you get started. The React package, the shared theme tokens, and the [conformance fixtures](./packages/conformance) give you a clear target.

In the meantime, every framework can use `@openpronoun/core` directly, as below. More in the [components guide](https://openpronoun.github.io/spec/usage/components/).

## Quick start

Working with the data directly, or in a framework without components yet? Start with `@openpronoun/core`.

```sh
npm install @openpronoun/core
```

```ts
import { parse, format } from "@openpronoun/core";

const pref = parse("they/them, she/her");
// [{ subjective: "they", objective: "them", possessive_adjective: "their",
//    possessive_pronoun: "theirs", reflexive: "themselves" },
//  { subjective: "she", ... }]

format(pref!); // "They/Them, She/Her"
format(pref!, { form: "expanded" }); // "They/Them/Theirs, She/Her/Hers"

parse("any pronouns"); // [{ type: "any" }]
parse("no pronouns"); // [{ type: "none" }]  → use their name
parse("fae/faer"); // known neopronoun set, all five forms
```

More in the [usage guide](https://openpronoun.github.io/spec/usage/), including validation, privacy filtering, and live examples for React, Vue, Svelte, Solid, Preact, Alpine, and vanilla JS.

## What the standard covers

| Area                                                                                                                                                                                    | What it defines                                                                                                                                                                                    |
| --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **[Data model](https://openpronoun.github.io/spec/specification/data-model/)**                                                                                                          | `PronounSet` and `PronounPreference`: five English forms, multiple sets with optional ranking, `any` / `none` / `ask` / `unspecified`, custom entries, exclusions, context, privacy, and language. |
| **[Parsing](https://openpronoun.github.io/spec/specification/parsing/)**                                                                                                                | Rules for turning real-world input into the model: separators, scrambled order, concatenated sets, special phrases, and freeform capture.                                                          |
| **[Display](https://openpronoun.github.io/spec/specification/display/)**                                                                                                                | Canonical short and expanded strings, multiple sets, context, and capitalization.                                                                                                                  |
| **[Conformance](https://openpronoun.github.io/spec/specification/conformance/)**                                                                                                        | Normative requirements in RFC 2119 language, a published JSON Schema, and shared test fixtures.                                                                                                    |
| **[UX & accessibility](https://openpronoun.github.io/spec/guidance/ux-accessibility/)**                                                                                                 | How to ask for pronouns respectfully and show them clearly.                                                                                                                                        |
| **[Internationalization](https://openpronoun.github.io/spec/guidance/internationalization/)** · **[Security & privacy](https://openpronoun.github.io/spec/guidance/security-privacy/)** | Language tagging, localization, and handling pronoun data with care.                                                                                                                               |

The model aligns with emerging healthcare work such as HL7's Gender Harmony pronoun value sets, while staying general-purpose. See [Overview](https://openpronoun.github.io/spec/introduction/overview/) and [Motivation](https://openpronoun.github.io/spec/introduction/motivation/) for the background.

## Designed around the people being described

The spec bakes in a few commitments, so every implementation inherits them:

- **No "Other" bucket.** Anything that doesn't match a known set is kept exactly as the person wrote it, never rejected or mangled.
- **More than one set is normal.** `she/they`, `he/they`, and ranked or unranked combinations are part of the core model.
- **Neopronouns are real pronouns.** `xe/xem`, `ze/zir`, `fae/faer`, and others parse into full sets like any other.
- **Different answers mean different things.** _Any pronouns_, _no pronouns (use my name)_, _ask me_, and _prefer not to say_ are distinct, and none of them is treated as a blank.
- **"Not these" is respected.** A set someone has excluded is never shown or used.
- **Context and privacy travel with the data.** "he/him (at work)" keeps its note, and a set shared only with some audiences stays out of public views.
- **Asking is optional.** The UX guidance treats pronoun fields as optional, explained, and under the person's control.

## Packages

| Package                                              | What it's for                                                                                                     |
| ---------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------- |
| [`@openpronoun/core`](./packages/core)               | Reference TypeScript implementation: `parse`, `format`, `validate`, `filterByAudience`, and the pronoun lexicon.  |
| [`@openpronoun/react`](./packages/react)             | Drop-in React components and hooks for collecting and displaying pronouns per the spec, themeable and restylable. |
| [`@openpronoun/schema`](./packages/schema)           | Canonical JSON Schema for the data model.                                                                         |
| [`@openpronoun/zod`](./packages/zod)                 | Zod schemas and inferred TypeScript types mirroring the JSON Schema.                                              |
| [`@openpronoun/conformance`](./packages/conformance) | Language-agnostic parsing and formatting fixtures any implementation can test against.                            |

Writing a port in another language? Validate against [`@openpronoun/schema`](./packages/schema) and run the [`@openpronoun/conformance`](./packages/conformance) fixtures, and you're testing against the same expectations as the reference library.

## Show you conform

Implementations that meet the [conformance requirements](https://openpronoun.github.io/spec/specification/conformance/) may display the badge:

[![Pronoun Standard Compliant](https://img.shields.io/badge/pronouns-standard%20compliant-blueviolet)](https://openpronoun.github.io/spec/specification/conformance/)

```md
![Pronoun Standard Compliant](https://img.shields.io/badge/pronouns-standard%20compliant-blueviolet)
```

## Contributing

OpenPronoun is a draft, and it gets better with more voices. Contributions are welcome from engineers, designers, linguists, clinicians, and anyone with lived experience of being misnamed by software.

- **Your pronouns didn't parse the way they should?** That's a gap in the lexicon, not a problem with you. [Open an issue](https://github.com/openpronoun/spec/issues/new) with what you typed and what you expected.
- **Spec feedback** — ambiguities, missing cases, internationalization — is welcome as issues or pull requests against the [docs](./docs/src/content/docs).
- **Code changes** to published packages need a [Changeset](https://github.com/changesets/changesets) (`npm run changeset`).

The [contributing guide](https://openpronoun.github.io/spec/project/contributing/) has the details.

<details>
<summary><strong>Development setup</strong></summary>

Requires Node 24+. This is an npm workspaces monorepo built with [Turborepo](https://turbo.build) and versioned with [Changesets](https://github.com/changesets/changesets).

```bash
npm install            # install root + all workspaces
npm run build          # build packages, then docs
npm run test           # run tests
npm run lint           # lint
npm run typecheck      # type-check
npm run check:exports  # verify package exports (publint + attw)
npm run format         # format with Prettier
```

**Docs site** ([Astro](https://astro.build) + [Starlight](https://starlight.astro.build), deployed to GitHub Pages):

```bash
npm run docs:dev       # local dev server
npm run docs:build     # production build
npm run docs:preview   # preview the production build
```

**New package:**

```bash
npm run new -- <name>           # standard package
npm run new -- <name> --react   # React adapter (adds peer deps + core dep)
```

**Release:**

```bash
npm run changeset      # describe your change
npm run version        # apply changesets and bump versions
npm run release        # build and publish to npm
```

</details>

## License

The reference implementations are [MIT licensed](./LICENSE).

<div align="center">
<br>
<sub>Built so that software says it right the first time — for everyone.</sub>
</div>
