---
title: Motivation
description: The needs a structured pronoun standard addresses — inclusivity, consistency, interoperability, developer convenience, and education.
sidebar:
  order: 2
---

The primary motivation is to better serve transgender, non-binary, and
gender-diverse users — and everyone else — by normalizing the respectful use of
pronouns in software. Many applications today either treat pronouns as a simple
free-text field or neglect them entirely.

- **Free-text approaches**, while flexible, make it hard for software to use
  pronouns in context (e.g. auto-generating messages or forms that refer to the
  user) and produce inconsistent formatting.
- **Rigid dropdowns** with limited options alienate users whose pronouns aren't
  listed (offering only "he/him, she/her, they/them, other" is inadequate).

Misgendering is not just a social faux pas — it has real consequences. In
healthcare it can discourage people from seeking care or contribute to poorer
outcomes; in workplaces and communities it undermines inclusion and trust and can
expose organizations to legal liability.

## What a structured standard provides

- **Inclusivity** — Represent any pronoun set a user might have, including
  neopronouns (e.g. `xe/xem`, `ze/zir`), combinations (e.g. "she and they"), and
  special cases like "no pronouns" or "any pronouns". This avoids othering users;
  an "Other" catch-all is considered outdated and dismissive.
- **Consistency** — Once captured, any component can interpret and display
  pronouns in a consistent, user-affirming way. A formal data model lets
  algorithms reliably generate grammatically correct text or show pronoun tooltips
  next to names.
- **Interoperability** — If multiple systems adopt the same format, user
  preferences carry over. A person's pronouns recorded in one portal could be
  exported or referenced elsewhere, and the model aligns with emerging healthcare
  standards (e.g. HL7's pronoun fields in FHIR R5 using coded pronoun sets).
- **Developer convenience** — Open-source libraries mean developers don't have to
  reinvent pronoun parsing or UI each time.
- **Education and UX** — The standard includes UX guidance on how to ask for
  pronouns respectfully: make it optional, explain why it's asked, ensure privacy
  controls, and provide linguistic context where helpful.
