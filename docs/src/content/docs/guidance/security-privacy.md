---
title: Security & Privacy
description: Treating pronoun data with appropriate confidentiality, and handling pronoun input safely.
sidebar:
  order: 3
---

Pronouns aren't secret, but they relate to gender identity and can be sensitive.
This section is **recommended** guidance; the normative privacy-level behavior is
specified under [Conformance](/specification/conformance/) (requirements D7 and
F4).

## Confidentiality

Implementers should treat pronoun data with appropriate confidentiality —
especially in sensitive contexts, where even pronouns could inadvertently out
someone if shared inappropriately. The standard itself doesn't enforce access
controls, but recommends: if a system has profile privacy settings, include
pronouns in those controls. A private profile should keep pronouns private unless
the user consents to share, and the `privacy` field on a set carries the user's
intent (level `1` or higher means "do not display publicly").

## Input handling

From a security standpoint, pronoun fields — especially freeform ones — are user
input and should be handled accordingly:

- Escape output for HTML and other sinks.
- Avoid using pronoun strings directly in code logic without sanitization.

Since the standard stores a normalized representation, injection risk via the
pronoun field is low when output is properly escaped.

## Rationale

Failing to respect pronoun preferences can cause harm and liability (deliberate
misgendering may constitute harassment in workplaces or care settings).
Implementing this standard helps organizations do right by users and creates a
record that they took steps to respect identities. Logging pronoun changes (with
consent) may be useful in audit trails. These operational concerns are outside the
technical spec but inform the rationale for doing this thoroughly.
