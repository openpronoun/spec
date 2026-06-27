# @openpronoun/conformance

Language-agnostic conformance fixtures for the
[OpenPronoun Specification](https://openpronoun.org): the shared parsing and
formatting test cases. The canonical schema lives in
[`@openpronoun/schema`](../schema); fixtures here validate against it. Because the
fixtures are plain JSON, the reference TypeScript library and any community port
(Python, Java, Go, …) validate against the exact same expectations.

## Contents

```
packages/conformance/
├── package.json
├── README.md
├── parsing.json              # input string  -> expected PronounPreference
└── formatting.json           # PronounPreference (+ options) -> expected display string
```

The schema these validate against is published separately as
[`@openpronoun/schema`](../schema).

## Fixture format

Each fixture file is a JSON object:

```jsonc
{
  "kind": "parsing" | "formatting",
  "description": "...",
  "cases": [ /* ... */ ]
}
```

**Parsing case** — `expected` is a `PronounPreference` that validates against the
`@openpronoun/schema` schema. An `expected` of `null` means "no preference" (the
field is absent), which is distinct from the special `none` preference.

```json
{
  "category": "single-set",
  "name": "single set, capitalized input",
  "input": "She/Her",
  "expected": [ { "subjective": "she", "objective": "her", "...": "..." } ]
}
```

**Formatting case** — `options.form` is one of `short`, `expanded`, or `detailed`.
`options.audience` (e.g. `"public"`) drives privacy behavior: sets with
`privacy >= 1` are omitted from a public audience.

```json
{
  "name": "single set, short",
  "input": [ { "subjective": "she", "...": "..." } ],
  "options": { "form": "short" },
  "expected": "She/Her"
}
```

## Conformance

- **Parser-conformant** implementations must, for every case in `parsing.json`,
  produce output deep-equal to `expected`.
- **Display-conformant** implementations must, for every case in
  `formatting.json`, produce a string equal to `expected`.

See [Conformance](https://openpronoun.org/specification/conformance/) for the full
requirement list.

## Minimal runner (Node.js)

A reference parser/formatter exposing `parse(input)` and
`format(preference, options)` can be checked against the fixtures with roughly:

```js
import assert from "node:assert";
import { readFileSync } from "node:fs";
import { parse, format } from "@openpronoun/core"; // your implementation

const parsing = JSON.parse(readFileSync(
  new URL("./parsing.json", import.meta.url), "utf8"));
for (const c of parsing.cases) {
  assert.deepStrictEqual(parse(c.input), c.expected, c.name);
}

const formatting = JSON.parse(readFileSync(
  new URL("./formatting.json", import.meta.url), "utf8"));
for (const c of formatting.cases) {
  assert.strictEqual(format(c.input, c.options), c.expected, c.name);
}

console.log("All conformance fixtures passed.");
```

> Note: the `expected` values encode the spec's *recommended* canonical forms
> (e.g. capitalized `She/Her` short display, `No pronouns (use name)` for the
> `none` preference). Where the spec leaves a choice to the implementation, the
> fixtures pick one canonical convention so results are comparable across ports.
