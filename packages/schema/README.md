# @openpronoun/schema

The canonical [JSON Schema](https://json-schema.org/) (draft 2020-12) for the
[OpenPronoun](https://openpronoun.org) data model — `PronounPreference` and
`PronounSet`. This is the normative model the rest of the ecosystem builds on:
the runtime library, the conformance fixtures, and any community port all
validate against this one schema.

## Contents

```
packages/schema/
├── package.json
├── README.md
└── pronoun-set.schema.json   # PronounPreference / PronounSet (JSON Schema 2020-12)
```

## Usage

Import the schema as JSON and feed it to any validator (e.g. Ajv):

```js
import Ajv from "ajv/dist/2020.js";
import schema from "@openpronoun/schema" with { type: "json" };

const validate = new Ajv({ strict: false }).compile(schema);

validate([{ subjective: "she", objective: "her", possessive_adjective: "her",
            possessive_pronoun: "hers", reflexive: "herself" }]); // true
```

CommonJS and bundler-resolved paths also work via the package exports:

```js
const schema = require("@openpronoun/schema");
// or resolve the file directly:
import schemaUrl from "@openpronoun/schema/pronoun-set.schema.json";
```

## What it validates

A `PronounPreference` is an array of one or more entries. Each entry is one of:

- a **standard set** — five English forms in full keys (`subjective`, `objective`,
  `possessive_adjective`, `possessive_pronoun`, `reflexive`) or compact keys
  (`sub`, `obj`, `p_a`, `p_pn`, `ref`);
- a **special preference** — `{ "type": "any" | "none" | "ask" | "unspecified" }`;
- a **custom** entry — `{ "type": "custom", "display": "…" }`, optionally with
  form fields.

Optional per-entry fields: `ranking`/`rnk`, `context`/`ctx`, `privacy`/`pvc`,
`language`/`lang` (ISO 639-1), and `exclude`/`exc`.

See the [data model](https://openpronoun.org/specification/data-model/) and
[conformance](https://openpronoun.org/specification/conformance/) docs for the
full normative definition.

## Note

This package ships only the schema. TypeScript types can be generated from it at
build time (e.g. with `json-schema-to-typescript`) in a downstream package if
desired.
