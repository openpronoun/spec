---
title: Internationalization
description: Handling pronouns across languages and locales, plus the extensibility model for new pronoun sets.
sidebar:
  order: 2
---

This standard primarily addresses English pronouns, but applications may need to
handle others. The data model's optional `language`/`lang` field (see
[Data Model](/specification/data-model/#language)) is the extension point.

## Language-specific pronoun sets

Structured pronoun fields are emerging in other languages (e.g. newly coined
German pronouns like *xier* or *sier*). The model can list these directly.
Contributors from different locales are encouraged to define their language's
common sets and how they map to the data fields.

For example, a Spanish implementation might map "he/him" to
*él/lo/su/suyo/sí mismo* (though Spanish normally uses just *él* or the name to
avoid ambiguity). Some languages lack gendered third-person pronouns entirely
(e.g. standard spoken Turkish or Chinese), where the field may be less relevant or
may indicate formal/informal address instead.

## Locale-aware display

A multilingual user might want pronouns per language. One approach (used by
PronounDB) keys pronoun sets by locale. Deep multi-locale support is not specified
here, but nothing in the model precludes it — most systems will ask for pronouns
in the context of one primary language.

## Extensibility

The standard is versioned and open to extension. A registry (a section of the spec
repo) tracks known pronoun sets and special values across languages. New or
emerging pronouns (e.g. Swedish *hen*) can be proposed for the reference lists and
parsers, keeping the standard current with language evolution.

## Examples in other languages

The spec may include non-English examples — e.g. a French interface offering
*il/lui* vs *elle* vs *iel* (a French neopronoun), or a mixed-language environment
displaying a language tag alongside a set.
