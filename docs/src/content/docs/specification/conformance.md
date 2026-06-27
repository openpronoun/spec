---
title: Conformance
description: Normative requirements (RFC 2119), conformance levels, and what the compliance badge attests to.
sidebar:
  order: 1
---

This page states the normative requirements of the standard. The pages that
follow ([Data Model](/specification/data-model/),
[Parsing](/specification/parsing/), [Display](/specification/display/)) describe
the model in full; this page collects the requirements an implementation must meet
to claim conformance.

## Requirement keywords

The key words **MUST**, **MUST NOT**, **REQUIRED**, **SHALL**, **SHALL NOT**,
**SHOULD**, **SHOULD NOT**, **RECOMMENDED**, **MAY**, and **OPTIONAL** in this
specification are to be interpreted as described in
[RFC 2119](https://www.rfc-editor.org/rfc/rfc2119) and
[RFC 8174](https://www.rfc-editor.org/rfc/rfc8174) when, and only when, they
appear in all capitals.

The material in the **Guidance** section (UX/accessibility,
internationalization, security/privacy) is **RECOMMENDED** but non-normative
unless a specific requirement below references it.

## Data model requirements

- **D1.** A pronoun preference MUST be represented as an ordered collection (a
  JSON array) of one or more entries.
- **D2.** A standard pronoun set MUST provide all five English forms —
  subjective, objective, possessive adjective, possessive pronoun, reflexive —
  using either the full keys (`subjective`, `objective`, `possessive_adjective`,
  `possessive_pronoun`, `reflexive`) or the compact keys (`sub`, `obj`, `p_a`,
  `p_pn`, `ref`).
- **D3.** An implementation MUST support representing more than one pronoun set
  for a single person.
- **D4.** An implementation MUST support the special preferences `any`, `none`,
  `ask`, and `unspecified`, each expressed as an entry with a `type` field and no
  required form fields.
- **D4a.** The `unspecified` preference (the user was asked but gave no usable set)
  MUST be treated as distinct from both `none` (use the person's name) and from a
  `null`/absent preference (no answer collected).
- **D5.** An implementation MAY support `custom` entries. A `custom` entry MUST
  carry a `display` string; it MAY additionally carry form fields (a merged or
  partially specified set).
- **D5a.** An implementation MAY support the `exclude`/`exc` flag. When present and
  true, the entry records a set the user does not want used; consumers MUST NOT
  present an excluded set as a usable pronoun.
- **D6.** The `ranking`/`rnk`, `context`/`ctx`, `privacy`/`pvc`, and
  `language`/`lang` fields are OPTIONAL.
- **D7.** When `privacy` is omitted, an implementation MUST treat the set as
  level `0` (public).
- **D8.** When `language` is present, it MUST be an ISO 639-1 code. When omitted,
  the system's primary language is assumed.
- **D9.** Internal pronoun form values SHOULD be stored in lowercase.

Conforming documents MUST validate against the published JSON Schema
(`pronoun-set.schema.json`, published as the `@openpronoun/schema` package).

## Parsing requirements

A conforming parser:

- **P1.** MUST accept slash-separated sets (`a/b[/c...]`).
- **P2.** MUST treat `,`, `;`, `&`, and the word "and" as separators between
  distinct sets.
- **P3.** MUST recognize the special keywords for `any`, `none`, and `ask`,
  including common variants (e.g. "any pronouns", "no pronouns", "use my name",
  "ask me"), and emit the corresponding special preference.
- **P4.** When a partial set is matched against a known set, MUST fill the missing
  forms from the canonical entry.
- **P5.** SHOULD be case-insensitive.
- **P6.** MUST trim extraneous whitespace and punctuation.
- **P7.** SHOULD capture parenthetical or bracketed context into the `context`
  field.
- **P8.** SHOULD preserve unrecognized input as a `custom` entry rather than
  reject it.
- **P9.** MUST treat `,`, `;`, `&`, "and", "or", and runs of whitespace as
  separators between distinct sets, and MUST treat `\` (backslash) like `/` within
  a set. Whitespace adjacent to a separator MUST be ignored, and empty elements
  produced by splitting MUST be dropped.
- **P10.** MUST disambiguate a slash-separated run that contains more than one
  known set (e.g. `they/them/he/him` → two sets) by matching known sets greedily,
  as described in [Parsing rule 8](/specification/parsing/).
- **P11.** When a recognized set is followed by unrecognized text, MUST emit the
  recognized set(s) and MUST NOT discard the input; the unrecognized remainder
  SHOULD be captured as a `custom` entry.
- **P12.** Empty, whitespace-only, or null input MUST yield no preference (`null`
  or an absent value), which is distinct from the `none` preference.
- **P13.** MUST recognize the keyword families for all four special preferences
  (`any`, `none`, `ask`, `unspecified`), including the common variants listed in
  [Parsing rule 3](/specification/parsing/).
- **P14.** SHOULD recover sets from non-subjective or scrambled form order using
  the form→set reverse lookup (e.g. `him/her` → he/him, she/her), de-duplicating
  identical sets.
- **P15.** SHOULD strip filler and placeholder tokens (rule 10) so that a
  recognized set wrapped in conversational filler (e.g. `he/him is fine`) yields
  the set alone. Filler stripping MUST NOT remove anything that resolves to a known
  set or special keyword.
- **P16.** MAY capture exclusions (rule 11): a named set rejected by the user is
  recorded as an entry with `exclude: true`.

A conforming parser MUST produce the expected output for every case in the
parsing fixtures of the [test suite](/project/reference-implementations/#test-suite).

## Display requirements

A conforming formatter:

- **F1.** MUST display `custom` entries as the user entered them, apart from
  capitalization adjustments.
- **F2.** MUST display the special preferences as human-readable phrases
  (e.g. "Any pronouns", "Ask me", "No pronouns (use name)", "Unspecified").
- **F2a.** MUST NOT present an excluded set (`exclude: true`) as a usable pronoun.
  A short display SHOULD omit excluded sets; a detailed display MAY show them
  marked as excluded (e.g. "not they/them").
- **F3.** MUST NOT infer or guess pronouns from a person's name or appearance when
  no preference has been provided.
- **F4.** MUST NOT display a set whose `privacy` level is `1` or higher in a public
  context.
- **F5.** When constructing sentences from pronoun data, MUST ensure correct
  capitalization (e.g. capitalize a sentence-initial pronoun).
- **F6.** The short display form SHOULD use the subjective and objective forms
  separated by a slash.
- **F7.** The expanded canonical form SHOULD be
  subjective/objective/possessive-pronoun (e.g. `she/her/hers`).

A conforming formatter MUST produce the expected output for every case in the
formatting fixtures of the [test suite](/project/reference-implementations/#test-suite).

## Conformance levels

- **Model-conformant** — Stores and exchanges pronoun data that validates against
  the JSON Schema and satisfies the data model requirements (D1–D9).
- **Parser-conformant** — Model-conformant, and additionally satisfies the parsing
  requirements (P1–P8) and passes the parsing fixtures.
- **Display-conformant** — Model-conformant, and additionally satisfies the
  display requirements (F1–F7) and passes the formatting fixtures.
- **Fully conformant** — Model-, parser-, and display-conformant.

An implementation MAY claim partial conformance (e.g. a storage layer that is
model-conformant without doing parsing or display) and SHOULD state which level(s)
it meets.

## Compliance badge

The compliance badge attests **full conformance**: the implementation is model-,
parser-, and display-conformant and passes the published test suite. Projects
claiming the badge SHOULD link it to evidence (e.g. a passing test run against the
fixtures).

```md
![Pronoun Standard Compliant](https://img.shields.io/badge/pronouns-standard%20compliant-blueviolet)
```
