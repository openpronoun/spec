---
title: Display & Stringification
description: Canonical string forms for showing pronouns — short and expanded forms, multiple sets, special cases, context, and capitalization.
sidebar:
  order: 4
---

Once pronoun data is structured, it needs to be displayed back or used in text.
**Canonical stringification** converts structured pronoun data back into a
consistent, human-readable string.

The normative display requirements are listed under
[Conformance](/specification/conformance/#display-requirements).

## Display contexts

- **Short display (profile / UI).** Beside a name, show a short indicator —
  subjective and objective separated by a slash (e.g. "she/her", "they/them"). For
  multiple sets, separate with a comma or ampersand ("she/her, they/them"), using
  the subjective form as the representative. Special preferences display as their
  phrases ("Any pronouns", "Ask me", "No pronouns"). Capitalize consistently;
  capitalizing each pronoun (e.g. "She/Her", as LinkedIn does) reads clearly.

- **Full display (detailed view / accessibility).** A detailed profile or
  first-use context may show more forms to educate readers. The recommended
  canonical string for a single set is the triple *subjective/objective/possessive
  pronoun* (e.g. "she/her/hers", "they/them/theirs" — including "theirs"
  distinguishes it from the possessive adjective "their"). Including the reflexive
  is usually unnecessary in everyday UI, but the data is available (e.g. in a
  tooltip or accessible description) when needed.

- **Multiple sets.** For someone with two sets, a canonical display might be
  "She/Her, They/Them". Shorthand like "She/They" can confuse readers unfamiliar
  with the convention, so spell sets out in explanatory contexts ("She/Her and
  They/Them"). Use a comma or slash for compact labels and "and" for prose.

- **No pronouns.** Display "No pronouns (use name)" or a phrasing the user
  provided or chose, signaling that the person should be referred to by name.

- **Unspecified.** When the preference is `unspecified` (asked but no usable set
  given), display a neutral label such as "Unspecified" or "Prefer not to say".
  Do not infer a set, and for usage fall back to the person's name — the same as a
  blank field, but with an explicit label available since the user did respond.

### Excluded sets

A set marked `exclude: true` records a pronoun the user does **not** want used. It
MUST NOT be presented as a usable pronoun. In short displays, omit excluded sets
entirely (show only the positive sets). In a detailed view, an excluded set MAY be
surfaced for clarity, marked as excluded — e.g. "He/Him, She/Her (not They/Them)".
Never use an excluded set when constructing sentences.

- **Usage guidance.** In environments where neopronouns or pronoun-sharing may be
  unfamiliar, offer a help link or tooltip — e.g. an info icon reading "These are
  the pronouns $Name goes by. Please use them when referring to $Name."

- **Contextual information.** When a `context` field is present, show it in
  parentheses after the set ("he/him (in professional contexts)") or in distinct
  styling near the pronoun set.

- **Capitalization in sentences.** When building sentences from pronoun data,
  ensure proper capitalization at sentence starts. The reference library can
  provide a helper (e.g. `formatPronounInContext(pronoun, case)`); otherwise
  developers should uppercase the first character where needed, to avoid sentences
  that begin with a lowercase pronoun.

## Canonical string summary

- Single set (short): `she/her` (or `She/Her` in display).
- Single set (expanded): `she/her/hers`.
- Multiple sets: `she/her, they/them` (ordered by rank first, then array order).
- With contextual/privacy/language info:
  `he/him (in professional contexts), they/them`.
- Special cases: `Any pronouns`, `Ask me my pronouns`, `No pronouns (use name)`,
  `Unspecified`.

UI strings (such as "No pronouns (use name)") should be localized if the
application supports multiple languages; the pronoun words themselves generally
stay in the language of usage. Apps that operate primarily in another language may
allow entering that language's pronouns, which is where the `lang` field helps,
though deep multi-locale support is initially out of scope. See
[Internationalization and Localization](/guidance/internationalization/).
