---
title: Parsing & Normalization
description: How to turn varied user input into the structured data model — input expectations, rules, and worked examples.
sidebar:
  order: 3
---

A key part of the standard is getting from user input (free-text or UI selection)
to the structured data model. **Parsing** interprets the user-provided text;
**normalization** converts it to a canonical form.

The normative parsing requirements are listed under
[Conformance](/specification/conformance/#parsing-requirements).

## Input expectations

Pronoun inputs are usually shorthand. The parser should handle:

- Slash-separated sets, the most common format (`a/b[/c...]`).
- Comma- or conjunction-separated lists of sets (`she/her and they/them`).
- Full phrases for special cases ("any pronouns", "no pronouns", "ask me my
  pronouns").
- Capitalization differences.
- Contextual information in parentheses or brackets.
- Stray emoji or decoration, which should be stripped or ignored.

## Normalization goals

Regardless of input format, the output should be consistent. `She/Her` normalizes
to a single set (`she/her/her/hers/herself`); a slightly non-standard input like
`she (her)` or `she/her/hers` should still resolve to the she/her set.

## Rules

1. **Split on separators.** Treat `/`, `,`, `;`, `&`, and the word "and" as
   delimiters between forms or sets. A single slash (`xe/xem`) implies at least the
   subjective/objective of one set; multiple slashes without spaces
   (`xe/xem/xyrs`) imply one set with several forms; a comma or "and" separates
   distinct sets. Be careful with phrases: "any and all pronouns" should resolve to
   "any pronouns", not two sets. Apply contextual matching of known phrases.

2. **Match known pronoun sets.** Maintain a dictionary of common English sets:
   she/her, he/him, they/them (singular they), it/its, and common neopronouns
   (ze/zir, xe/xem, fae/faer, per/pers, etc.). On a match — even a partial one like
   just "she" or "she/her/hers" — populate the full set, filling missing forms from
   the canonical entry. The dictionary also handles case-insensitivity and minor
   spelling variants (e.g. *xemself* vs *xyrself*; choose one canonical form but
   accept the other).

3. **Recognize special keywords.** Match phrases that express a non-set
   preference and emit the corresponding special `PronounPreference`. The four
   special types and their common triggers:

   - **`any`** — "any", "any pronouns", "any/all", "all", "i go by all",
     "whatever you feel comfortable", "idc" / "i don't care", "no preference",
     "most are acceptable". The user accepts any set.
   - **`none`** — "no pronouns", "none", "use my name", "avoid pronouns", "refer
     to me by name", "just [name]". The user does not want pronouns used.
   - **`ask`** — "ask me", "ask my pronouns". The user invites others to inquire.
   - **`unspecified`** — "unsure", "not sure", "not sure yet", "don't know",
     "don't know yet", "prefer not to disclose", "choose not to disclose", "prefer
     not to say". The user has not provided a usable set — whether from uncertainty
     or a decision not to state. This is distinct from `none` (a positive
     instruction to use the name) and from `null` (no answer was collected at all).

   Match the whole input (ignoring case and punctuation) against these concepts.
   Where a phrase mixes a keyword with a set (e.g. "any (she/he/they)",
   "unsure yet just use he/him"), prefer the most specific recoverable
   interpretation — see rule 10 on filler and rule 11 on mixed input.

4. **Freeform capture.** Prefer not to reject unrecognized input. An unknown set
   is an opportunity to learn: store it as a `custom` entry (preserving what the
   user typed for display) and log it for future lexicon improvements. When
   something is truly unrecognized, preserve it literally rather than mangling it.

5. **Contextual capture.** Capture additional context provided in parentheses or
   brackets (e.g. "she/her (only in professional settings)") into the optional
   `context` field.

6. **Normalize formatting.** Store internal fields in lowercase (pronouns aren't
   capitalized mid-sentence); apply a display convention separately. Trim
   extraneous whitespace and punctuation. Preserve user-specified ordering for
   multiple sets; fall back to input order when ambiguous.

7. **Normalize separators before splitting.** Real-world input uses many
   separators interchangeably. Before parsing, treat the following as equivalent:

   - `,`, `;`, `&`, the word "and", and the word "or" separate **distinct sets**.
   - `/` and `\` (backslash) separate **forms within a set** (or concatenated
     sets — see rule 8).
   - Whitespace adjacent to any separator is insignificant: `she / they`,
     `they/ them/ theirs`, and `he\him\his` normalize the same as their
     unspaced forms.
   - A run of whitespace between two complete tokens or sets also acts as a set
     separator (`he she`, `she/her they/them`, `hy/hym zey/zem he/him vey/vem`).
   - Empty elements produced by splitting MUST be dropped. A leading or trailing
     separator (e.g. `, He/him`) therefore yields just the non-empty set(s).

   Note: `or` is treated as a plain set separator. Conjunctions like "or" can
   carry an exclusive or conditional meaning ("X **or** Y, never Z") that this
   model does not represent; such nuance is lost on parse. See
   [Limitations](#limitations).

8. **Disambiguate concatenated sets and recover forms.** A slash- or
   whitespace-separated run may be one set with several forms (`they/them/theirs`)
   or several sets jammed together (`they/them/he/him`), and tokens are not always
   given subjective-first. Resolve via a **reverse-lookup table** mapping every
   known form to its set:

   - Walk the run left to right. Each token is looked up to find the set it
     belongs to.
   - A token belonging to the **same** set as the one currently being assembled
     extends it (filling forms from the dictionary as needed).
   - A token belonging to a **different** known set flushes the current set and
     starts a new one, seeded from the dictionary.
   - Identical resulting sets are de-duplicated, keeping first-occurrence order.

   Because each common English form maps to exactly one set (e.g. `him`→he,
   `her`→she, `them`→they, `theirs`→they), non-subjective and scrambled order is
   recoverable:

   - `they/them/theirs` → one set (they/them).
   - `they/them/he/him` → two sets (they/them, he/him).
   - `he/she/they` → three sets (each a bare subjective).
   - `him/her` → two sets (he/him, she/her) — recovered from objective forms.
   - `her/she` → one set (she/her) — duplicate collapsed.
   - `she,her,he,him` → two sets (she/her, he/him).

   A token that maps to **no** known set is handled by rule 9 (custom capture).

9. **Handle partial, unrecognized, and empty input.**

   - When a recognized set is followed by an unrecognized token
     (`they/them/theirs, Reading`), emit the recognized set(s) and capture the
     unrecognized remainder as a `custom` entry, preserving it verbatim. Do not
     discard it and do not let it block the valid sets.
   - When the entire input is unrecognized (`david`, `1205`, `fox/foxs`), capture
     it as a single `custom` entry preserving the literal text. Downstream
     moderation and data-quality review are out of scope for the parser (see
     [Security & Privacy](/guidance/security-privacy/) and the UX
     [misuse note](/guidance/ux-accessibility/#display-and-usage-guidelines)).
   - When the input is empty, whitespace-only, or null, the result is **no
     preference** — represented as `null` or an absent field, not an empty array.
     (A `PronounPreference` has one or more entries; "not provided" is the absence
     of a preference, which is distinct from the special `none` preference, which
     means "do not use pronouns for me.")

10. **Strip filler and placeholders.** Submissions frequently wrap sets in
    conversational filler or leave placeholder tokens. Before custom-capturing a
    leftover token, drop it if it matches a filler/placeholder stoplist, so that
    `he/him is fine` yields the he/him set rather than the set plus a spurious
    `custom` entry.

    - **Filler** (removed, surrounding sets kept): "is fine", "are fine", "please",
      "now", "also", "as well", "preferred", "only", "just use", "i use",
      "i go by", "relevant pronouns are fine".
    - **Placeholders** (removed entirely; if nothing else remains, the result is
      `null`): "n/a", "na", "tbd", "-", "none given".

    The stoplist is advisory; implementations MAY extend it. Filler stripping MUST
    NOT remove anything that resolves to a known set or special keyword.

11. **Capture exclusions.** When input names a set only to reject it
    ("he/him or she/her, just not they/them"), record the rejected set as a normal
    entry with `exclude: true`. The positive sets are captured as usual; the
    excluded set is retained so consumers know not to use it. Trigger phrases
    include "just not", "not", "never", "except". An exclusion with no accompanying
    positive set (e.g. "not they/them") is still recorded as a single excluded
    entry.

## Limitations

The model captures most real-world input, but some nuance is still lossy on parse:

- **Conditional / temporal notes** — "soon to be she/her/hers", "born he",
  "she/her when presenting feminine he/him when presenting masculine". Recognized
  sets are extracted; delimited notes are captured into `context` (rule 5), but
  free-text temporal or conditional phrasing that isn't delimited is not modeled
  structurally and is preserved as `context` text at best, or dropped.
- **Compound conditions across sets** — phrasing that ties usage of one set to a
  situation relative to another ("X in professional contexts, otherwise Y") is
  captured only as per-set `context` strings, not as machine-evaluable rules.

## Examples

| Input | Result |
|-------|--------|
| `She/Her` | one set `{she, her, her, hers, herself}`; display as "She/Her" |
| `they/them/theirs, he/him/his, she/her/hers` | three sets, in order |
| `they/them/he/him` | two sets (they/them, he/him) — concatenation split |
| `she/her they/them` | two sets — whitespace-separated |
| `she/her or he/him` | two sets — "or" treated as separator |
| `he/him/his & she/her/hers` | two sets — "&" separator |
| `they\them` | one set (they/them) — backslash normalized |
| `, He/him` | one set (he/him) — leading empty element dropped |
| `him/her` | two sets (he/him, she/her) — recovered from objective forms |
| `he/him is fine` | one set (he/him) — "is fine" stripped as filler |
| `unsure` / `prefer not to disclose` | `{ "type": "unspecified" }` |
| `he/him or she/her, just not they/them` | he/him, she/her, and they/them with `"exclude": true` |
| `she/they` | two sets: she/her… and they/them… |
| `Any pronoun` / `any/all` / `i go by all` | `{ "type": "any" }` |
| `avoid pronouns` / `no pronouns` | `{ "type": "none" }` |
| `they/them/theirs, Reading` | recognized set + `{ "type": "custom", "display": "Reading" }` |
| `david` / `fox/foxs` | `{ "type": "custom", "display": "…" }` — unrecognized, preserved |
| `N/A` / *(blank)* | `null` — no preference (not the `none` preference) |

The standard includes a formal grammar (EBNF- or regex-based) for acceptable
pronoun string formats, plus a shared test suite, so implementations in different
languages can produce equivalent results. See the
[test suite](/project/reference-implementations/#test-suite) for the canonical
input→output fixtures.
