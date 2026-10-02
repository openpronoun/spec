---
title: Drop-in Components
description: Ready-made pronoun fields and displays that look good by default, restyle to match your product, and follow the spec, so you can set them and forget them.
sidebar:
  order: 2
---

If you'd rather not build pronoun UI yourself, use a ready-made component.
Each one is designed to be set and forgotten: it looks good out of the box,
takes on your product's look when you want it to, and follows this
specification without you having to read it.

## Available now: React

```sh
npm install @openpronoun/react
```

```tsx wrap
import { useState } from "react";
import { PronounDisplay, PronounSelector, type PronounEntry } from "@openpronoun/react";

export function ProfilePronouns() {
  const [pronouns, setPronouns] = useState<PronounEntry[]>([]);

  return (
    <>
      <PronounSelector value={pronouns} onChange={setPronouns} />
      <PronounDisplay pronouns={pronouns} />
    </>
  );
}
```

| Component                             | What it's for                                                                                                                                                    |
| ------------------------------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `PronounSelector`                     | The pronoun field. A multi-select combo box with common sets and neopronouns up front, a way to add a custom set in the person's own words, and drag-to-reorder. |
| `PronounDisplay`                      | Shows someone's pronouns as text or badges, in short, medium, or long form, with optional example sentences.                                                     |
| `PronounBadge`                        | One pronoun entry as a compact badge, for names in lists, chats, and headers. Optionally clickable or removable.                                                 |
| `PronounForm`                         | The selector wrapped as a complete form field: label, helper text, error message, and an optional live preview. Ready for a settings page.                       |
| `PronounDetailEditor`                 | Lets someone adjust every form of a set (subjective through reflexive), plus its context note, privacy level, and whether it's excluded.                         |
| `usePronounState`, `usePronounParser` | The same state and parsing logic as hooks, for when you want to build your own UI.                                                                               |

## Looks right by default

The components ship with a light theme (`defaultTheme`) and a dark theme
(`darkTheme`). Out of the box they have:

- accessible names written for screen readers, which read sets as words
  ("she, her") rather than "she slash her";
- visible focus states;
- full keyboard support, including reordering sets without a mouse.

## Restyles to match you

There are three layers, and you can use any mix of them.

**Theme tokens.** Pass a partial theme and it's merged over the defaults:
colors, border radius, fonts, font sizes, spacing, input height, focus ring,
and badge, button, and label styles.

<!-- prettier-ignore -->
```tsx
import { defaultTheme } from "@openpronoun/react";

<PronounSelector
  value={pronouns}
  onChange={setPronouns}
  theme={{
    colors: { ...defaultTheme.colors, primary: "#0b6e4f", focusRing: "#0b6e4f" },
    borderRadius: "999px",
    fontFamily: "inherit",
  }}
/>
```

**Class names.** Every component takes a `classNames` object with a slot for
each part (for `PronounSelector`: `root`, `control`, `input`, `menu`, `option`,
`tag`, the badge pills, the inline editor, and more), so Tailwind, CSS modules,
or your design system's classes work without overrides.

<!-- prettier-ignore -->
```tsx
<PronounSelector
  value={pronouns}
  onChange={setPronouns}
  classNames={{ root: "profile-field", control: "input", menu: "popover" }}
/>
```

**Icons.** Pass `icons` to swap any icon for your own set.

## Behaves to spec

The components are built on [`@openpronoun/core`](/project/reference-implementations/),
the reference implementation, so you get the specified behavior without
re-implementing it:

- **Free text is parsed by the standard rules.** Whatever someone types is
  normalized as described in [Parsing](/specification/parsing/), and what they
  originally typed is kept.
- **Nothing gets forced into "Other".** Custom sets are kept in the person's own
  words ([F1](/specification/conformance/#display-requirements)).
- **More than one set works,** in the order the person chooses.
- **Excluded sets are never shown as usable**
  ([F2a](/specification/conformance/#display-requirements)).
- **Privacy is respected.** `PronounDisplay` hides sets with a privacy level of
  1 or higher by default; set `publicOnly={false}` only where the viewer is
  allowed to see them ([F4](/specification/conformance/#display-requirements)).
- **Special answers stay distinct.** _Any pronouns_, _no pronouns_, _ask me_,
  and _unspecified_ each display as their own phrase
  ([F2](/specification/conformance/#display-requirements)).

The [UX & accessibility guidance](/guidance/ux-accessibility/) explains the
reasoning behind these defaults.

## In development: Preact

A Preact package is being built by a community contributor, with the same
goals as the React one: good defaults, full restyling, and spec behavior built
in.

## Open for contributors

These packages are waiting for someone to build them. If one of them is your
framework, this is a great place to contribute:

- Vue
- Svelte
- Solid
- A web component that works anywhere, including vanilla JS and Alpine

To claim one, [open an issue](https://github.com/openpronoun/spec/issues/new)
saying which, and we'll help you get started. You won't be starting from a
blank page:

- `@openpronoun/core` already does the parsing, formatting, and privacy
  filtering, so a package is mostly UI.
- `@openpronoun/react` is a working reference for behavior, slots, and theme
  tokens to mirror.
- The [conformance fixtures](/project/reference-implementations/#openpronounconformance--test-suite)
  tell you when parsing and display are right.

See [Contributing](/project/contributing/) for repository setup. In the
meantime, every framework can use `@openpronoun/core` directly; the
[usage examples](/usage/) show it in each of them.
