---
title: UX & Accessibility
description: Recommended practices for collecting and displaying pronouns in interfaces, with accessibility considerations.
sidebar:
  order: 1
---

A pronoun standard isn't complete without guidance on how users provide and see
pronouns. This section is **recommended** (non-normative) except where a specific
[conformance](/specification/conformance/) requirement references it.

## Collection (input) guidelines

- **Make it optional.** Never require pronoun disclosure. Mark the field clearly
  optional, and allow it to be left blank or set to "Prefer not to say".

- **Use clear, inclusive language.** Label the field "Pronouns" — not "Gender"
  (a different concept) and not "Preferred Pronouns" (discouraged, since a person's
  pronouns are not a preference). A short hint like "(e.g. she/her, they/them)" can
  guide users.

- **Provide common options plus custom.** Offer a list of common sets (She/Her,
  He/Him, They/Them, and increasingly recognized neopronouns like Ze/Zir, Xe/Xem)
  and always allow a custom entry. Avoid an "Other" catch-all in a dropdown — it
  otherizes people. A combo box or checkboxes with a "Custom…" option that reveals
  a text field works well and future-proofs the design.

- **Allow multiple selection.** Many people use more than one set. Use checkboxes
  or multi-select chips rather than a single-choice radio. If a user both selects
  from the list and types a custom entry, ideally retain both, handling edge cases
  gracefully.

- **Order and priority.** If multiple pronouns are chosen, you may let users order
  them (e.g. drag-and-drop), but don't imply a hierarchy unless the user expresses
  one. Default to the order selected or entered.

- **Context and education.** Explain why pronouns are collected — e.g. "Sharing
  your pronouns is optional. We ask to ensure we address you correctly." Linking to
  a resource for users who want to learn more builds trust.

- **Privacy controls.** Where pronouns may be sensitive, let users control
  visibility. The `privacy` field supports this. Specifics vary by context, but
  giving users control is important.

## Display and usage guidelines

- **Display custom entries as entered.** Show custom pronoun sets exactly as the
  user provided them (apart from capitalization adjustments). Don't auto-translate
  or abbreviate someone's pronouns.

- **Prominent placement.** Place pronouns near the name (e.g. "Dr. Alex Chen
  (they/them)") to normalize their use. Avoid styling that treats pronouns as a
  warning — make them as ordinary as a title or nickname.

- **Accessibility.** Ensure pronoun information is screen-reader friendly — e.g.
  announce "Pronouns: she, her" rather than reading the slash awkwardly. Provide
  `aria-label`s, keyboard navigability, proper labels, and alt text for any icons.

- **Avoid assumptions when blank.** Don't infer pronouns from name or appearance.
  Leave the display blank or use the person's name until they specify. Don't fill
  blanks with negative-sounding placeholders like "None given"; treat it as
  missing data.

- **Updates and versioning.** Respect changes seamlessly and reflect new pronouns
  everywhere. Pronouns aren't a one-time static field; let users update them at any
  time.

- **Avoiding misuse.** Any open text field can be misused. Content moderation is
  out of scope for the technical standard, but a list-plus-custom approach helps
  (most users pick from the list; outliers can be reviewed). The standard's ethos
  is to treat all user-entered pronouns as valid and to educate stakeholders that
  these entries are to be honored, not questioned.
