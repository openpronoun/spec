# @openpronoun/zod

[Zod](https://zod.dev) schemas and inferred TypeScript types for the
[OpenPronoun](https://openpronoun.org) data model. A hand-written, idiomatic
mirror of the canonical [`@openpronoun/schema`](../schema) JSON Schema, kept
honest by a parity test that checks both validators agree across the
[`@openpronoun/conformance`](../conformance) fixtures.

Use this in TypeScript code that wants runtime validation plus types from one
import; use `@openpronoun/schema` directly when you need the portable,
cross-language JSON Schema.

## Install

```sh
npm install @openpronoun/zod zod
```

`zod` is a peer dependency (v4).

## Usage

```ts
import {
  pronounPreferenceSchema,
  type PronounPreference,
} from "@openpronoun/zod";

const result = pronounPreferenceSchema.safeParse([
  { subjective: "she", objective: "her", possessive_adjective: "her",
    possessive_pronoun: "hers", reflexive: "herself" },
]);

if (result.success) {
  const prefs: PronounPreference = result.data;
}
```

## Exports

Schemas: `pronounPreferenceSchema`, `pronounEntrySchema`, `pronounSetSchema`
(`fullPronounSetSchema`, `compactPronounSetSchema`), `specialPreferenceSchema`,
`customEntrySchema`, and the `SPECIAL_TYPES` tuple.

Types: `PronounPreference`, `PronounEntry`, `PronounSet`, `SpecialPreference`,
`CustomEntry`.

## Relationship to the JSON Schema

`@openpronoun/schema` (JSON Schema) is canonical and language-agnostic. This Zod
port is an authoring convenience for TypeScript and is **not** the source of
truth. `test/parity.test.ts` asserts the two stay in agreement over the
conformance fixtures plus a shared reject set.

One intentional difference: special preferences here are strict (a special entry
may not carry pronoun-form fields), whereas the JSON Schema is looser on that
pathological case. Both validators agree on every conformance fixture; if you
need byte-for-byte JSON Schema semantics, validate with `@openpronoun/schema`.
