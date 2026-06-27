---
title: Changelog
description: Version history for the specification.
sidebar:
  order: 3
---

This standard uses semantic versioning. Specification changes are tagged
alongside reference-implementation releases.

## Unreleased (working draft toward v1)

Additions made while hardening the parser against real-world submission data:

- Added the `unspecified` special preference (asked but no usable set given —
  distinct from `none` and from a `null`/absent preference).
- Added the optional `exclude`/`exc` flag to represent negative preferences
  ("just not they/them").
- Generalized concatenation handling to recover sets from non-subjective and
  scrambled form order via a form→set reverse lookup (`him/her` → he/him, she/her).
- Defined separator normalization (`,` `;` `&` `and` `or` whitespace as set
  separators; `\` like `/`; empty elements dropped).
- Defined filler/placeholder stripping (`he/him is fine` → he/him; `N/A` → null).
- Defined partial/unrecognized/empty handling (recognized set + `custom` remainder;
  garbage preserved as `custom`; empty/placeholder → `null`).
- Expanded the parsing test suite to 47 cases across 22 categories drawn from real
  submission data.
- Split the canonical JSON Schema into its own `@openpronoun/schema` package; the
  `@openpronoun/conformance` fixtures depend on it.
- Added `@openpronoun/zod`: a Zod mirror of the schema (TypeScript schemas +
  inferred types), kept in sync with `@openpronoun/schema` via a parity test.

## 0.1 — 2025-05-30

- Initial draft.
- Core English five-form data model (`PronounSet`, `PronounPreference`).
- Special preferences: `any`, `none`, `ask`, `custom`.
- Optional fields: `context`, `privacy`, `language`, and `ranking`.
- Parsing and normalization rules.
- Display and canonical stringification conventions.
- UX/accessibility, internationalization, and security/privacy guidance.
- Conformance requirements (RFC 2119), JSON Schema, and shared test suite.
