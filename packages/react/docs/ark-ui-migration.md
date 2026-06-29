# Migration: react-select → Ark UI

## Decision

`react-select` was replaced with [`@ark-ui/react`](https://ark-ui.com) (Combobox) as the dropdown engine for `PronounSelector`.

## Rationale

The original implementation overrode nearly every react-select component slot (`MultiValue`, `MultiValueContainer`, `MultiValueLabel`, `MultiValueRemove`, `Menu`, `Option`, `GroupHeading`) and maintained 558 lines of `StylesConfig` to fight the defaults. At that override depth, react-select's abstraction was costing more than it provided.

What react-select was actually earning after all overrides:

1. Multi-select state management (`value[]` ↔ `options` sync)
2. Dropdown open/close + positioning
3. Search input wiring
4. ARIA `combobox`/`listbox` role scaffolding

Ark UI (built on [Zag.js](https://zagjs.com) state machines) provides all four as headless primitives with no default styles, eliminating the override fight entirely. Additional wins:

- **No more `StylesConfig`** — all styling lives in a single CSS string (`getPronounSelectorStyles`) using data attributes (`[data-highlighted]`, `[data-selected]`, `[data-state]`)
- **Clean state machine for forced-open** — the inline editor pattern (`menuIsOpen={editingPronounSet ? true : undefined}`) becomes `open={isMenuOpen}` with a proper `onOpenChange` guard
- **No `selectProps` tunnel** — the old code passed `badgeTheme`, `icons`, `tagClassNames` via an untyped `selectProps` cast because react-select custom components only receive what the parent `Select` passes. In Ark UI, components are plain React and can close over parent state directly
- **Smaller bundle** — ~20 KB vs ~30 KB gzipped

## Files Changed

### Deleted
- `src/BadgeMenuComponents.tsx` — badge pill rendering inlined into `PronounSelector.tsx`

### Rewritten
- `src/PronounSelector.tsx` — uses `Combobox.Root`, `Combobox.Control`, `Combobox.Input`, `Combobox.Positioner`, `Combobox.Content`, `Combobox.ItemGroup`, `Combobox.Item`, `createListCollection`
- `src/PronounTag.tsx` — removed `MultiValueGenericProps`/`MultiValueRemoveProps` from react-select; now a plain component with `{ option, icons, id, onEdit?, onRemove?, classNames? }` props
- `src/SortableMultiValue.tsx` — wraps `PronounTag` with dnd-kit `useSortable`; no react-select types

### Updated
- `src/PronounOptionFormatter.tsx` — removed `GroupBase` import; `formatOptionLabel` drops the `{ context }` parameter (tags are now rendered by `PronounTag`, not the option formatter); `formatGroupLabel` accepts `PronounOptionGroup` directly
- `src/styles.ts` — removed `StylesConfig`/`getCustomStyles`; `getPronounSelectorStyles` now includes CSS for Ark UI element classes and data-attribute states
- `src/classNames.ts` — added `control`, `input`, `menu`, `trigger` to `PronounSelectorClassNames`
- `package.json` — removed `react-select`, added `@ark-ui/react`

## API Surface Changes for Library Consumers

### `PronounSelector` props — no changes

All props (`value`, `onChange`, `theme`, `dropdownMode`, `classNames`, etc.) are identical. Consumers do not need to update.

### `classNames.selector` — additive only

Four new optional keys on `PronounSelectorClassNames`:

| Key | Element |
|-----|---------|
| `control` | `Combobox.Control` — the tags + input wrapper |
| `input` | `Combobox.Input` — the search field |
| `menu` | `Combobox.Content` — the dropdown panel |
| `trigger` | `Combobox.Trigger` — the chevron button |

Existing keys (`root`, `tag`, `sortableValue`, `option`, `editor`, etc.) are unchanged.

### `PronounOptionFormatterClassNames` — no changes

The `formatOptionLabel` function signature changed internally (dropped `context` param) but this function is not exported from the package.

## Ark UI Combobox Patterns Used

```tsx
import { Combobox, createListCollection } from "@ark-ui/react/combobox";

// Collection — all items flat; filtering handled by re-creating collection from filtered array
const collection = createListCollection({
  items: filteredOptions,
  itemToValue: (item) => item.id ?? item.label,
  itemToString: (item) => item.label,
});

// Data attribute styling — replaces StylesConfig
// [data-highlighted]  → focused option
// [data-selected]     → selected option
// [data-state="open"] → open dropdown
// [data-disabled]     → disabled state
```

## dnd-kit Integration (Unchanged)

The drag-to-reorder feature still uses `@dnd-kit/core` + `@dnd-kit/sortable`. The integration point moved from inside react-select's `MultiValue` slot to the `Combobox.Control` children — a `SortableContext` wraps the rendered `SortableMultiValue` tags before the `Combobox.Input`.
