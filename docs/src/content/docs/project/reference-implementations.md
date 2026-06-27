---
title: Reference Implementations
description: The TypeScript parsing/formatting library, the React component library, the JSON Schema, and the shared test suite.
sidebar:
  order: 1
---

To jump-start adoption, the standard ships with reference implementations and
machine-readable conformance artifacts.

## `@openpronoun/core` — parsing & formatting library

A fully conformant TypeScript/JavaScript utility library for web apps and Node.js.
Install via npm:

```sh
npm install @openpronoun/core
```

### What it exports

**Parsing**

- `parse(input: string | null | undefined): PronounPreference | null` —
  converts free-text input into a structured `PronounPreference` array following
  the [parsing rules](/specification/parsing/). Returns `null` for empty,
  whitespace-only, placeholder, or null input. Handles slash-separated sets,
  concatenated sets, special keywords, filler stripping, contextual notes in
  parentheses or brackets, and exclusion phrases.

**Formatting**

- `format(preference: PronounPreference, options?: FormatOptions): string` —
  converts a `PronounPreference` back into a display string. `FormatOptions`
  accepts:
  - `form?: "short" | "expanded" | "detailed"` — `"short"` (default) produces
    `She/Her`; `"expanded"` adds the possessive pronoun (`She/Her/Hers`);
    `"detailed"` surfaces excluded sets (`He/Him, She/Her (not They/Them)`).
  - `audience?: string` — pass `"public"` to hide entries whose `privacy` level
    is `1` or higher.
  - Entries are sorted by `ranking`/`rnk` ascending; unranked entries follow in
    original order.

**Validation**

- `validate(input: unknown): input is PronounPreference` — type-guard returning
  `true` if the input is a valid `PronounPreference` per the Zod schema.
- `validateOrThrow(input: unknown): PronounPreference` — returns the validated
  value or throws a Zod error.
- `validationErrors(input: unknown): string[]` — returns a list of human-readable
  error strings, or an empty array if valid.

**Privacy**

- `filterByAudience(preference: PronounPreference, audience: string): PronounPreference` —
  returns a new array with entries whose `privacy`/`pvc` level is `1` or higher
  removed when `audience` is `"public"`.

**Constants**

- `PRONOUN_DICTIONARY: readonly CanonicalEntry[]` — the built-in list of English
  pronoun sets (she/her, he/him, they/them, it/its, and common neopronouns: xe/xem,
  ze/zir, ze/hir, fae/faer, per/pers, ey/em, e/em, ae/aer, co/cos, ne/nem,
  thon/thon, ve/ver).
- `FORM_TO_SET: ReadonlyMap<string, CanonicalEntry>` — reverse lookup: any known
  form string (e.g. `"him"`, `"their"`) → its canonical entry. Used internally for
  disambiguation and form recovery.
- `SPECIAL_KEYWORDS` — lists of recognized keyword phrases for each of the four
  special preference types (`any`, `none`, `ask`, `unspecified`). Advisory;
  consumers may extend them.
- `PLACEHOLDER_STRINGS: readonly string[]` — inputs treated as "no preference"
  (`"n/a"`, `"na"`, `"tbd"`, `"-"`, `"none given"`). Advisory.
- `FILLER_PATTERNS: readonly RegExp[]` — patterns stripped from segments before
  resolution (e.g. `"is fine"`, `"i use"`, `"i go by"`). Advisory.

**TypeScript types** (re-exported from `@openpronoun/zod`)

- `PronounPreference` — the top-level type: `PronounEntry[]`.
- `PronounEntry` — union of `FullPronounSet | CompactPronounSet | SpecialPreference | CustomEntry`.
- `PronounSet` — a full-key pronoun set object.
- `SpecialPreference` — `{ type: "any" | "none" | "ask" | "unspecified" }`.
- `CustomEntry` — `{ type: "custom"; display: string }`.
- `FormatOptions` — options passed to `format()`.
- `CanonicalEntry` — the shape of entries in `PRONOUN_DICTIONARY`.

**Zod schemas** (re-exported from `@openpronoun/zod`)

- `pronounPreferenceSchema`, `pronounEntrySchema`, `pronounSetSchema`,
  `specialPreferenceSchema`, `customEntrySchema` — Zod v4 schemas for runtime
  validation and TypeScript type inference.
- `SPECIAL_TYPES` — the tuple `["any", "none", "ask", "unspecified"]`.

See the [Usage Examples](/usage/) page for code samples.

## `@openpronoun/react` — React component library

A UI library (TypeScript, React):

- `<PronounSelector>` — a form field encapsulating the UX best practices
  (multi-select combo box, free-text via the parsing library, structured output).
- `<PronounDisplay>` — renders a `PronounPreference` per the
  [display rules](/specification/display/) with proper accessibility attributes,
  optionally toggling short/long display.

Themeable to match different design systems, with sensible defaults and
accessibility (ARIA labels, focus management). MIT licensed and open-source so the
community can contribute additional pronoun options or framework support.

## `@openpronoun/zod` — TypeScript schemas

Idiomatic Zod v4 schemas and inferred types mirroring the canonical JSON Schema,
kept in sync via a parity test against the conformance fixtures. Used as the type
source-of-truth for `@openpronoun/core`.

## `@openpronoun/schema` — JSON Schema

The canonical schema for the data model (`pronoun-set.schema.json`, JSON Schema
2020-12). A `PronounPreference` document is valid when it validates against this
schema. Conformant storage and exchange formats MUST validate against it
([requirement D1–D9](/specification/conformance/#data-model-requirements)).

## `@openpronoun/conformance` — test suite

A shared, language-agnostic set of fixtures (`parsing.json`, `formatting.json`).
Each fixture file is JSON with a list of cases:

- **Parsing fixtures** (47 cases across 22 categories) — map an input string to
  the expected `PronounPreference` output.
- **Formatting fixtures** (14 cases) — map a `PronounPreference` plus display
  options to the expected display string.

Implementations claiming **parser** or **display** conformance run their parser /
formatter against these fixtures and must produce the expected output for every
case. Because the fixtures are plain JSON, any implementation — the reference
TypeScript library or a community port in another language — validates against the
exact same expectations. See the `@openpronoun/conformance` README for the fixture
format and a minimal runner.

## Maintenance

The reference repos serve as the hub for ongoing maintenance: new pronouns, new
edge cases, schema updates, and spec text are updated together, with versioned
(semantic) releases tagged to the spec. The parsing logic is specified clearly
enough to be ported to other languages (e.g. a community Python or Java
implementation) that validates against the same schema and test suite.
