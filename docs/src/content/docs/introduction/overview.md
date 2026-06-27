---
title: Overview
description: Why a shared pronoun standard exists, what gap it fills, and what it covers.
sidebar:
  order: 1
---

Correctly capturing and respecting personal pronouns is essential for inclusive
and affirming user interactions. Today there is no widely adopted technical
standard for pronoun handling, and the gap shows: implementations across software
systems are inconsistent, incomplete, or disrespectful — ad-hoc free-text fields,
short hardcoded dropdowns, or an "Other" catch-all that otherizes the people it's
meant to include.

This specification defines a public, implementation-agnostic standard for pronoun
handling. It covers:

- A structured **data model** for pronoun sets and pronoun preferences.
- **Parsing and normalization rules** for turning varied user input into that
  model.
- **Display and canonical stringification** conventions.
- **UX and accessibility guidelines** for collecting and showing pronouns.
- Considerations for **internationalization** and **extensibility**.

Adopting a shared standard improves inclusivity, consistency, and
interoperability across applications, and lowers the implementation burden through
shared reference code.

## Background

Respecting and correctly using individuals' pronouns is a matter of inclusivity
and of user trust and well-being. In the U.S., one in five Americans now knows
someone who uses pronouns other than "she" or "he" (rising to roughly 35% for
Gen Z). In sensitive contexts such as healthcare, using the wrong pronouns
(misgendering) can cause real distress and harm, and avoiding it is crucial for
providing affirming care to transgender and gender-diverse people.

Standards bodies have begun to address pronoun data — for example, HL7's Gender
Harmony project includes a Pronouns element to capture a person's pronouns for use
in interactions and clinical notes. But there is still no widely adopted,
general-purpose technical standard for handling pronouns in software. Developers
often fall back on free-text fields or limited lists, leading to inconsistency and
potential disrespect (forcing "Other" as a pronoun option, or failing to support
multiple pronoun sets).

The HL7 Gender Harmony Project is the closest prior art, but its Personal Pronouns
section is fairly restrictive/normative, doesn't adapt easily to the changing
landscape of inclusive language, and is narrowly scoped to healthcare. A more
general standard remains a gap worth filling.

## Scope

This standard defines a formal data model for personal pronoun sets, covering all
English third-person pronoun forms (subjective, objective, possessive adjective,
possessive pronoun, reflexive). It specifies parsing and normalization rules to
transform user-input pronoun strings (e.g. `she/her`, `they/them`, `xe/xem/xyr`,
`any pronouns`) into structured data objects. It includes guidance for advanced
cases: multiple pronoun sets (e.g. "she and they"), mixed or rotating sets,
special or freeform entries such as "any pronouns" or "no pronouns", and
contextual notes such as "he, but only in professional settings".

The standard also recommends canonical string formats for display, shares UX and
accessibility best practices for collecting and showing pronouns, and outlines
considerations for internationalization and extensibility.

## Reference implementations

To encourage adoption, the standard ships with two open-source reference
implementations (MIT licensed):

1. A **TypeScript library** for parsing, validating, and formatting pronoun data
   according to the spec.
2. A **React component library** for pronoun selection input and display,
   following the standard's guidelines.

By providing both the specification and reference code, the goal is a robust
foundation for pronoun handling that any team can adopt. See
[Reference Implementations](/project/reference-implementations/) for details.
