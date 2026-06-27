---
title: Data Model
description: The PronounSet and PronounPreference structures — forms, schema, multiple sets, special preferences, and optional metadata.
sidebar:
  order: 2
---

At the core of the standard is a formal data model for pronoun sets. In English,
third-person personal pronouns have up to five key forms:

- **Subjective** (nominative) — the pronoun as the subject of a sentence
  (e.g. "*she* is a doctor").
- **Objective** (accusative) — the object of a verb or preposition
  (e.g. "I saw *her* in the clinic").
- **Possessive adjective** (determiner) — before a noun to indicate possession
  (e.g. "*her* appointment").
- **Possessive pronoun** — standalone possession (e.g. "that appointment was
  *hers*").
- **Reflexive** — the object refers back to the pronoun's owner (e.g. "she
  advocated for *herself*").

Many common English sets expand cleanly across these five forms:

| Set | Subjective | Objective | Poss. adj. | Poss. pron. | Reflexive |
|-----|-----------|-----------|------------|-------------|-----------|
| she/her | she | her | her | hers | herself |
| he/him | he | him | his | his | himself |
| they/them | they | them | their | theirs | themselves |
| xe/xem | xe | xem | xyr | xyrs | xemself |

These exact forms are confirmed in existing terminology — for instance, HL7's
pronoun value set enumerates `she/her/her/hers/herself`, `he/him/his/his/himself`,
and `they/them/their/theirs/themselves` as coded options. Many neopronouns follow
similar patterns, though some noun-self or nonstandard sets deviate, so the model
remains flexible to accommodate them.

## PronounSet schema

A `PronounSet` object has named fields for each form:

```json
{
  "subjective": "she",
  "objective": "her",
  "possessive_adjective": "her",
  "possessive_pronoun": "hers",
  "reflexive": "herself"
}
```

A compact form is available for low-bandwidth contexts (e.g. JWTs or other
compact payloads):

```json
{
  "sub": "she",
  "obj": "her",
  "p_a": "her",
  "p_pn": "hers",
  "ref": "herself"
}
```

Storing all five forms lets programs correctly inflect sentences — an email
template might insert `subjective` or choose between `possessive_adjective` and
`possessive_pronoun` as grammar requires. Keeping the fields separate also
disambiguates sets like he/him, where "his" serves as both possessive adjective
and possessive pronoun.

The full set of fields and validation rules is published as a JSON Schema in the
`@openpronoun/schema` package (`pronoun-set.schema.json`).

## Multiple pronoun sets

The model must support people who use multiple pronoun sets. Nearly two-thirds of
LGBTQ youth who use non-binary pronouns choose combinations of sets (e.g.
he+they, she+they) rather than a single set, and many adults use combinations like
"she/they" or "he/they" across contexts or interchangeably.

A person's pronouns are therefore modeled as a **collection** of `PronounSet`s,
not just one. Sets are stored in the order the user prefers them listed, and an
optional ranking field may indicate which set is primary (often users have no
preference, so ranking is optional). Full and compact key styles may be mixed; the
`ranking`/`rnk` field expresses ordering.

```json
[
  {
    "subjective": "she",
    "objective": "her",
    "possessive_adjective": "her",
    "possessive_pronoun": "hers",
    "reflexive": "herself",
    "ranking": 2
  },
  {
    "sub": "they",
    "obj": "them",
    "p_a": "their",
    "p_pn": "theirs",
    "ref": "themselves",
    "rnk": 1
  }
]
```

## Special pronoun preferences

Some people don't specify a conventional set at all, instead using entries like
"any pronouns", "no pronouns", or "ask me". These are represented as special cases
of a broader `PronounPreference` type:

- **Any pronouns** — the user is comfortable with any set. Represented with a tag
  rather than an exhaustive list; displayed as "Any pronouns".

  ```json
  [{ "type": "any" }]
  ```

- **No pronouns (use name only)** — the user does not want pronouns used for them.
  Systems should avoid inserting pronouns and use the person's name or a neutral
  form. A typical label is "No pronouns (use my name)".

  ```json
  [{ "type": "none" }]
  ```

- **Ask me** — the user prefers not to store a set and asks others to inquire.
  Displayed as e.g. "Ask me about my pronouns".

  ```json
  [{ "type": "ask" }]
  ```

- **Unspecified** — the user was asked but did not provide a usable set, whether
  from uncertainty ("unsure", "don't know yet") or a decision not to state
  ("prefer not to disclose"). This is distinct from `none` (which is a positive
  instruction to use the person's name) and from `null`/absent (which means no
  answer was collected at all). Displayed neutrally, e.g. "Unspecified".

  ```json
  [{ "type": "unspecified" }]
  ```

- **Custom freeform** — when a user provides pronouns that don't match a known
  pattern (or the parser chooses not to parse them), the literal string is stored.
  The goal is to minimize this by continuously improving the standard's lexicon.

  ```json
  [{ "type": "custom", "display": "fae/faer" }]
  ```

## Combining special preferences with standard sets

Special cases can be combined with — or embedded in — standard `PronounSet`s. The
example below contains a custom merged set (`fae/him`, mixing forms from two
sets), a standard `they/them` set, and the special `any` token:

```json
[
  {
    "type": "custom",
    "display": "fae/him",
    "subjective": "fae",
    "objective": "him",
    "possessive_adjective": "faer",
    "possessive_pronoun": "his",
    "reflexive": "faerself"
  },
  {
    "subjective": "they",
    "objective": "them",
    "possessive_adjective": "their",
    "possessive_pronoun": "theirs",
    "reflexive": "themselves"
  },
  {
    "type": "any"
  }
]
```

## Optional fields

A `PronounSet` may carry optional metadata.

### Context

A freeform note about when or how a set is used. The implied context of a second
set is the inverse of the first, or simply unspecified.

```json
[
  {
    "subjective": "he",
    "objective": "him",
    "possessive_adjective": "his",
    "possessive_pronoun": "his",
    "reflexive": "himself",
    "context": "Only used in professional settings"
  },
  {
    "subjective": "they",
    "objective": "them",
    "possessive_adjective": "their",
    "possessive_pronoun": "theirs",
    "reflexive": "themselves"
  }
]
```

### Privacy

An integer privacy level (`privacy`/`pvc`) keyed to the host system's privacy
model. `0` is public (the default if omitted); `1` indicates the set should only
be used in private/internal contexts and not displayed publicly. Higher integers
may be added for more granular levels (e.g. `2` semi-private, `3` confidential).

```json
[
  {
    "subjective": "she",
    "objective": "her",
    "possessive_adjective": "her",
    "possessive_pronoun": "hers",
    "reflexive": "herself",
    "privacy": 0
  },
  {
    "subjective": "they",
    "objective": "them",
    "possessive_adjective": "their",
    "possessive_pronoun": "theirs",
    "reflexive": "themselves",
    "privacy": 1
  }
]
```

### Language

An ISO 639-1 language code (`language`/`lang`, e.g. `en`, `fr`, `es`) for a
particular set. If omitted, the system's primary language is assumed.

```json
[
  {
    "subjective": "she",
    "objective": "her",
    "possessive_adjective": "her",
    "possessive_pronoun": "hers",
    "reflexive": "herself",
    "language": "en"
  },
  {
    "subjective": "ella",
    "objective": "la",
    "possessive_adjective": "su",
    "possessive_pronoun": "la suya",
    "reflexive": "ella misma",
    "language": "es"
  }
]
```

All of the above fall under a `PronounPreference` abstraction. In code or schema,
this can be modeled as a union type or an object that contains either a structured
`PronounSet` or the optional type fields.

### Exclude

A boolean (`exclude`/`exc`, default `false`) marking a set the user explicitly
does **not** want used, while still naming it so consumers know to avoid it. This
captures negative preferences like "he/him or she/her, just not they/them".

```json
[
  {
    "subjective": "he",
    "objective": "him",
    "possessive_adjective": "his",
    "possessive_pronoun": "his",
    "reflexive": "himself"
  },
  {
    "subjective": "she",
    "objective": "her",
    "possessive_adjective": "her",
    "possessive_pronoun": "hers",
    "reflexive": "herself"
  },
  {
    "subjective": "they",
    "objective": "them",
    "possessive_adjective": "their",
    "possessive_pronoun": "theirs",
    "reflexive": "themselves",
    "exclude": true
  }
]
```

An excluded set MUST NOT be presented as a usable pronoun in display or sentence
construction (see [Display](/specification/display/#excluded-sets)).

## Internationalization consideration

The core model is tailored to English pronouns, but is designed to be extensible
via the optional `lang` field. Other languages have different pronoun grammar —
French has *il/elle* (and plural *ils/elles*) plus adjective agreement; Chinese
spoken pronouns don't distinguish gender in the third person, though written
characters differ. For languages with a similar set of forms, a localized
`PronounSet` can be defined (some languages may need only subjective/objective).

The reference implementations initially target English with the five-form model,
while encouraging contributors to propose extensions for other languages. Emerging
gender-neutral pronouns (e.g. Swedish *hen*, German *xier*/*dey*/*sier*) can be
accommodated simply as additional pronoun sets with whatever forms the language
uses and the appropriate language code. See
[Internationalization and Localization](/guidance/internationalization/) for more.
