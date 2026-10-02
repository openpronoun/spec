---
"@openpronoun/react": patch
---

Refresh the default PronounSelector look.

- Chevron stays pinned on the right instead of wrapping under the tags; it rotates when the menu opens.
- Menu sits 6px below the control, with inset rounded rows, a softer shadow, and a short fade-in (skipped under `prefers-reduced-motion`).
- Selected options get a primary tint and checkmark. The old `[data-selected]` selectors never matched Ark UI's `data-state="checked"`, so selection had no visual state before.
- Group headers are lighter, with dividers between groups; the "Custom" group header is dropped so "Create custom pronoun set" stands alone at the bottom.
- Tags are tinted chips sized to match the menu text; the drag handle fades in on hover.
- Badge mode uses outlined pills that tint when selected, matching the tags.
- Check glyphs are SVGs instead of the `✓` character.
- `defaultTheme` and `darkTheme` `borderRadius` goes from `4px` to `8px`. Pass `borderRadius` in a custom theme to keep the old value.
