import type React from "react";
import type { PronounTheme } from "./theme";

function resolveFocusBoxShadow(theme: PronounTheme): string {
  if (theme.focusStyle?.boxShadow) {
    return theme.focusStyle.boxShadow;
  }
  const ringColor =
    theme.colors.focusRing ?? `${theme.colors.focus ?? theme.colors.primary}40`;
  return `0 0 0 3px ${ringColor}`;
}

/**
 * Computes theme values as CSS custom properties to be applied as inline `style`
 * on a component's root element. Each instance sets its own variables, ensuring
 * that multiple themed instances on the same page don't overwrite each other.
 */
export function getPronounCSSVars(theme: PronounTheme): React.CSSProperties {
  const focusRing = resolveFocusBoxShadow(theme);

  return {
    "--ps-font-family": theme.fontFamily ?? "inherit",
    "--ps-control-height": theme.inputHeight ?? "38px",
    "--ps-input-height": theme.inputHeight ?? "auto",
    "--ps-bg": theme.colors.background,
    "--ps-border": theme.colors.border,
    "--ps-radius": theme.borderRadius,
    "--ps-primary": theme.colors.primary,
    "--ps-primary-hover": theme.colors.primaryHover ?? theme.colors.primary,
    "--ps-focus": theme.colors.focus ?? theme.colors.primary,
    "--ps-focus-ring": focusRing,
    "--ps-secondary": theme.colors.secondary,
    "--ps-secondary-hover": theme.colors.secondaryHover ?? theme.colors.secondary,
    "--ps-secondary-hover-border": theme.colors.secondaryHover ?? theme.colors.border,
    "--ps-text": theme.colors.text,
    "--ps-disabled": theme.colors.disabled,
    "--ps-placeholder": theme.colors.placeholder ?? theme.colors.disabled,
    "--ps-label": theme.colors.label ?? theme.colors.disabled,
    "--ps-helper-text": theme.colors.helperText ?? theme.colors.disabled,
    "--ps-error": theme.colors.error,
    "--ps-badge-radius": theme.badgeStyle?.borderRadius ?? "9999px",
    "--ps-font-size-sm": theme.fontSizes.small,
    "--ps-font-size-md": theme.fontSizes.medium,
    "--ps-font-size-lg": theme.fontSizes.large,
    "--ps-primary-dim-1": `${theme.colors.primary}18`,
    "--ps-primary-dim-2": `${theme.colors.primary}28`,
    "--ps-bg-overlay": `${theme.colors.background}f2`,
    "--ps-secondary-dim": `${theme.colors.secondary}30`,
    "--ps-secondary-faint": `${theme.colors.secondary}10`,
    "--ps-spacing-sm": theme.spacing.small,
    "--ps-spacing-md": theme.spacing.medium,
    "--ps-spacing-lg": theme.spacing.large,
    "--ps-btn-radius": theme.buttonStyle?.borderRadius ?? theme.borderRadius,
    "--ps-btn-padding":
      theme.buttonStyle?.padding ??
      `${theme.spacing.small} ${theme.spacing.medium}`,
    "--ps-btn-font-weight": String(theme.buttonStyle?.fontWeight ?? 500),
    "--ps-btn-font-size": theme.buttonStyle?.fontSize ?? theme.fontSizes.small,
    "--ps-label-color":
      theme.labelStyle?.color ?? theme.colors.label ?? theme.colors.text,
    "--ps-label-font-size": theme.labelStyle?.fontSize ?? theme.fontSizes.medium,
    "--ps-label-font-weight": String(theme.labelStyle?.fontWeight ?? 500),
    "--ps-focus-outline": theme.focusStyle?.outline ?? "none",
    "--ps-focus-outline-offset": theme.focusStyle?.outlineOffset ?? "2px",
    "--ps-focus-box-shadow": theme.focusStyle?.outline ? "none" : focusRing,
  } as React.CSSProperties;
}

/**
 * Static CSS for the PronounSelector component.
 * Uses CSS custom properties (set per-instance via inline style) so multiple
 * themed instances on the same page don't overwrite each other's styles.
 */
export const getPronounSelectorStyles = (_theme?: PronounTheme) => `
  .pronoun-selector {
    --ps-tint-1: color-mix(in srgb, var(--ps-primary) 8%, var(--ps-bg));
    --ps-tint-2: color-mix(in srgb, var(--ps-primary) 14%, var(--ps-bg));
    --ps-tint-border: color-mix(in srgb, var(--ps-primary) 28%, var(--ps-bg));
    --ps-hover-bg: color-mix(in srgb, var(--ps-secondary) 55%, var(--ps-bg));
    --ps-shadow-sm: 0 1px 2px rgba(15, 23, 42, 0.05);
    --ps-shadow-lg: 0 12px 32px -8px rgba(15, 23, 42, 0.2), 0 2px 6px -2px rgba(15, 23, 42, 0.08);
    --ps-item-radius: max(calc(var(--ps-radius) - 2px), 4px);

    width: 100%;
    position: relative;
    font-family: var(--ps-font-family);
    font-size: var(--ps-font-size-md);
    line-height: 1.4;
    color: var(--ps-text);
  }

  /* ── Control (tags + input wrapper) ───────────────────────────── */

  .pronoun-select__control {
    display: flex;
    align-items: center;
    gap: 4px;
    min-height: var(--ps-control-height);
    padding: 3px 4px;
    background-color: var(--ps-bg);
    border: 1px solid var(--ps-border);
    border-radius: var(--ps-radius);
    box-shadow: var(--ps-shadow-sm);
    cursor: text;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    font-family: var(--ps-font-family);
    box-sizing: border-box;
  }

  .pronoun-select__control:hover {
    border-color: color-mix(in srgb, var(--ps-primary-hover) 55%, var(--ps-border));
  }

  .pronoun-select__control:focus-within {
    border-color: var(--ps-focus);
    box-shadow: var(--ps-focus-ring);
  }

  .pronoun-select__control[data-disabled] {
    cursor: not-allowed;
    opacity: 0.6;
    border-color: var(--ps-border);
    box-shadow: none;
  }

  .pronoun-select__values {
    display: flex;
    flex: 1;
    flex-wrap: wrap;
    align-items: center;
    gap: 4px;
    min-width: 0;
  }

  /* ── Input ────────────────────────────────────────────────────── */

  .pronoun-select__input {
    flex: 1;
    min-width: 6ch;
    height: 28px;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ps-text);
    font: inherit;
    font-size: var(--ps-font-size-md);
    padding: 0 6px;
  }

  .pronoun-select__input::placeholder {
    color: var(--ps-placeholder);
  }

  /* ── Trigger (chevron button) ─────────────────────────────────── */

  .pronoun-select__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    align-self: flex-start;
    width: 28px;
    height: 28px;
    margin-top: max(0px, calc((var(--ps-control-height) - 2px - 6px - 28px) / 2));
    background: none;
    border: none;
    color: var(--ps-helper-text);
    cursor: pointer;
    padding: 0;
    border-radius: var(--ps-item-radius);
    transition: color 0.15s ease, background-color 0.15s ease;
    flex-shrink: 0;
  }

  .pronoun-select__trigger svg {
    transition: transform 0.2s ease;
  }

  .pronoun-select__trigger[data-state="open"] svg {
    transform: rotate(180deg);
  }

  .pronoun-select__trigger:hover {
    color: var(--ps-text);
    background-color: var(--ps-hover-bg);
  }

  .pronoun-select__trigger:focus-visible {
    outline: none;
    box-shadow: var(--ps-focus-ring);
  }

  /* ── Positioner + Content (dropdown) ─────────────────────────── */

  .pronoun-select__positioner {
    width: 100%;
    z-index: 50;
  }

  .pronoun-select__menu {
    box-sizing: border-box;
    background-color: var(--ps-bg);
    border: 1px solid var(--ps-border);
    border-radius: calc(var(--ps-radius) + 2px);
    box-shadow: var(--ps-shadow-lg);
    overflow-y: auto;
    overscroll-behavior: contain;
    scrollbar-width: thin;
    max-height: 340px;
    padding: 6px;
    position: relative;
    font-family: var(--ps-font-family);
    outline: none;
  }

  .pronoun-select__menu[data-state="open"] {
    animation: ps-menu-in 0.14s ease-out;
  }

  /* Ark marks the closed menu [hidden]. Mode rules such as badge mode's
     display: flex would otherwise override that and keep it on screen. */
  .pronoun-select__menu[hidden] {
    display: none;
  }

  @keyframes ps-menu-in {
    from { opacity: 0; transform: translateY(-4px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .pronoun-select__menu[data-state="open"] { animation: none; }
    .pronoun-select__trigger svg { transition: none; }
  }

  /* ── Groups ───────────────────────────────────────────────────── */

  .pronoun-select__group + .pronoun-select__group {
    margin-top: 6px;
    padding-top: 6px;
    border-top: 1px solid var(--ps-border);
  }

  .pronoun-group-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 6px 8px 4px;
    color: var(--ps-label);
    font-weight: 600;
    font-size: 0.6875rem;
    letter-spacing: 0.06em;
    text-transform: uppercase;
  }

  .pronoun-group-count {
    min-width: 18px;
    padding: 0 6px;
    border-radius: 9999px;
    background-color: var(--ps-hover-bg);
    color: var(--ps-helper-text);
    font-size: 0.6875rem;
    font-weight: 500;
    font-variant-numeric: tabular-nums;
    letter-spacing: 0;
    line-height: 18px;
    text-align: center;
    box-sizing: border-box;
  }

  /* ── Options ──────────────────────────────────────────────────── */

  .pronoun-select__option {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin: 0;
    padding: 7px 8px;
    border-radius: var(--ps-item-radius);
    cursor: pointer;
    color: var(--ps-text);
    font-size: var(--ps-font-size-md);
    font-family: var(--ps-font-family);
    transition: background-color 0.08s ease;
  }

  .pronoun-select__option[data-highlighted] {
    background-color: var(--ps-hover-bg);
  }

  .pronoun-select__option[data-state="checked"] {
    background-color: var(--ps-tint-1);
    font-weight: 500;
  }

  .pronoun-select__option[data-highlighted][data-state="checked"] {
    background-color: var(--ps-tint-2);
  }

  .pronoun-select__option[data-disabled] {
    cursor: not-allowed;
    opacity: 0.5;
  }

  .pronoun-select__option--create {
    color: var(--ps-primary);
    font-weight: 500;
  }

  .pronoun-select__option--create[data-highlighted] {
    background-color: var(--ps-tint-1);
  }

  .pronoun-select__item-indicator[hidden],
  .pronoun-select__menu [data-part="item-indicator"][hidden] {
    display: none;
  }

  .pronoun-select__item-indicator {
    display: flex;
    color: var(--ps-primary);
    flex-shrink: 0;
  }

  .pronoun-option-label {
    font-weight: inherit;
  }

  .pronoun-examples {
    margin-top: 1px;
    font-size: 0.75rem;
    font-weight: 400;
    line-height: 1.4;
    color: var(--ps-helper-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  .pronoun-option-with-examples {
    min-width: 0;
  }

  /* ── Tags (selected values in the control) ────────────────────── */

  .pronoun-multi-value {
    transition: transform 0.2s, box-shadow 0.2s;
    margin: 0;
    border-radius: var(--ps-badge-radius);
  }

  .pronoun-multi-value.is-dragging {
    z-index: 1;
    box-shadow: 0 4px 12px rgba(15, 23, 42, 0.18);
  }

  .pronoun-tag-container {
    display: inline-flex;
    align-items: center;
    gap: 1px;
    height: 26px;
    box-sizing: border-box;
    padding: 0 3px 0 6px;
    margin: 0;
    background-color: var(--ps-tint-1);
    border: 1px solid var(--ps-tint-border);
    border-radius: var(--ps-badge-radius);
    color: var(--ps-text);
    font-size: var(--ps-font-size-md);
    font-weight: 500;
    white-space: nowrap;
  }

  .pronoun-tag-label {
    display: flex;
    align-items: center;
    cursor: grab;
    gap: 5px;
    padding-right: 2px;
    line-height: 1;
  }

  .pronoun-drag-handle {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: var(--ps-helper-text);
    opacity: 0.45;
    cursor: grab;
    transition: opacity 0.15s ease;
  }

  .pronoun-tag-container:hover .pronoun-drag-handle,
  .pronoun-multi-value.is-dragging .pronoun-drag-handle {
    opacity: 1;
  }

  .pronoun-tag-actions {
    display: flex;
    align-items: center;
    gap: 1px;
  }

  .pronoun-tag-edit,
  .pronoun-tag-remove {
    background: none;
    border: none;
    border-radius: 9999px;
    color: var(--ps-helper-text);
    cursor: pointer;
    height: 20px;
    width: 20px;
    padding: 0;
    margin: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease, background-color 0.15s ease;
  }

  .pronoun-tag-edit:hover {
    color: var(--ps-primary);
    background-color: var(--ps-tint-2);
  }

  .pronoun-tag-remove:hover {
    color: var(--ps-error);
    background-color: color-mix(in srgb, var(--ps-error) 12%, var(--ps-bg));
  }

  .pronoun-tag-edit:focus-visible,
  .pronoun-tag-remove:focus-visible {
    outline: none;
    box-shadow: var(--ps-focus-ring);
  }

  /* ── Badge mode ───────────────────────────────────────────────── */

  .pronoun-badge-menu {
    display: flex;
    flex-wrap: wrap;
    align-content: flex-start;
    align-items: center;
    gap: 6px;
    padding: 10px;
    max-height: none;
  }

  .pronoun-badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    height: 30px;
    box-sizing: border-box;
    margin: 0;
    padding: 0 12px;
    background-color: var(--ps-bg);
    border: 1px solid var(--ps-border);
    border-radius: var(--ps-badge-radius);
    color: var(--ps-text);
    cursor: pointer;
    font-size: var(--ps-font-size-md);
    font-weight: 500;
    white-space: nowrap;
    transition: background-color 0.12s ease, border-color 0.12s ease, color 0.12s ease;
  }

  .pronoun-badge-pill[data-highlighted]:not([data-state="checked"]) {
    background-color: var(--ps-hover-bg);
    border-color: color-mix(in srgb, var(--ps-primary) 35%, var(--ps-border));
  }

  .pronoun-badge-pill[data-state="checked"] {
    padding-left: 8px;
    background-color: var(--ps-tint-1);
    border-color: var(--ps-tint-border);
    color: var(--ps-text);
  }

  .pronoun-badge-pill[data-highlighted][data-state="checked"] {
    background-color: var(--ps-tint-2);
  }

  .pronoun-badge-pill--custom,
  .pronoun-badge-pill--custom[data-highlighted]:not([data-state="checked"]) {
    background-color: transparent;
    border-color: color-mix(in srgb, var(--ps-primary) 55%, var(--ps-bg));
    border-style: dashed;
    color: var(--ps-primary);
  }

  .pronoun-badge-pill--custom[data-highlighted] {
    background-color: var(--ps-tint-1);
  }

  .pronoun-badge-pill [data-part="item-text"] {
    display: inline-flex;
    align-items: center;
    gap: 4px;
  }

  .pronoun-badge-pill svg {
    display: block;
    flex-shrink: 0;
  }

  .pronoun-badge-check {
    display: flex;
    color: var(--ps-primary);
  }

  /* ── Editor overlay ───────────────────────────────────────────── */

  .pronoun-create-custom,
  .pronoun-create-custom-icon {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    color: var(--ps-primary);
    font-weight: 500;
  }

  .pronoun-detail-editor-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: var(--ps-bg-overlay);
    display: flex;
    justify-content: flex-end;
  }

  .pronoun-badge-menu > .pronoun-detail-editor-container {
    position: relative;
    top: auto;
    right: auto;
    width: 100%;
    height: auto;
    min-height: 100%;
  }

  /* ── Accessibility ────────────────────────────────────────────── */

  .sr-only {
    position: absolute;
    width: 1px;
    height: 1px;
    padding: 0;
    margin: -1px;
    overflow: hidden;
    clip: rect(0, 0, 0, 0);
    white-space: nowrap;
    border-width: 0;
  }
`;

/**
 * Static CSS for the PronounDetailEditor component.
 * References the same CSS custom properties as getPronounSelectorStyles.
 * When used inside PronounSelector the vars are inherited; when used standalone
 * PronounDetailEditor sets them via its own inline style.
 */
export const getPronounDetailEditorStyles = (_theme?: PronounTheme) => `
  .pronoun-detail-editor {
    position: relative;
    background-color: var(--ps-bg);
    border-radius: var(--ps-radius);
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 3;
    border-left: 1px solid var(--ps-border);
    overflow: hidden;
    animation: slideIn 0.3s ease-out;
    font-family: var(--ps-font-family);
  }

  @keyframes slideIn {
    from { transform: translateX(100%); }
    to   { transform: translateX(0); }
  }

  @media (prefers-reduced-motion: reduce) {
    .pronoun-detail-editor { animation: none; }
  }

  .pronoun-detail-editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: var(--ps-spacing-lg);
    border-bottom: 1px solid var(--ps-border);
    background-color: var(--ps-secondary-dim);
  }

  .pronoun-detail-editor-header h3 {
    margin: 0;
    font-size: var(--ps-font-size-lg);
    font-weight: 600;
    color: var(--ps-text);
    font-family: var(--ps-font-family);
  }

  .pronoun-detail-editor-close {
    background: none;
    border: none;
    border-radius: var(--ps-radius);
    font-size: 1.25rem;
    line-height: 1;
    padding: 4px 8px;
    cursor: pointer;
    color: var(--ps-text);
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .pronoun-detail-editor-close:hover {
    background-color: var(--ps-secondary);
    color: var(--ps-primary);
  }

  .pronoun-detail-editor-close:focus-visible {
    outline: var(--ps-focus-outline);
    outline-offset: var(--ps-focus-outline-offset);
    box-shadow: var(--ps-focus-box-shadow);
  }

  .pronoun-detail-editor-body {
    padding: var(--ps-spacing-md);
    overflow-y: auto;
    flex: 1;
    max-height: calc(100% - 110px);
  }

  .pronoun-detail-editor-form {
    display: flex;
    flex-direction: column;
    gap: var(--ps-spacing-lg);
  }

  .pronoun-detail-editor-field {
    display: flex;
    flex-direction: column;
    gap: var(--ps-spacing-sm);
    margin-bottom: var(--ps-spacing-sm);
  }

  .pronoun-detail-editor-field-desc {
    font-size: var(--ps-font-size-sm);
    color: var(--ps-helper-text);
    margin-top: var(--ps-spacing-sm);
  }

  .pronoun-detail-editor-field label {
    font-size: var(--ps-label-font-size);
    font-weight: var(--ps-label-font-weight);
    color: var(--ps-label-color);
    font-family: var(--ps-font-family);
  }

  .pronoun-detail-editor-field input,
  .pronoun-detail-editor-field select {
    padding: var(--ps-spacing-sm) var(--ps-spacing-md);
    border: 1px solid var(--ps-border);
    border-radius: var(--ps-radius);
    font-size: var(--ps-font-size-sm);
    background-color: var(--ps-bg);
    color: var(--ps-text);
    width: 100%;
    min-height: var(--ps-input-height);
    font-family: var(--ps-font-family);
  }

  .pronoun-detail-editor-field input::placeholder {
    color: var(--ps-placeholder);
  }

  .pronoun-detail-editor-field input:focus,
  .pronoun-detail-editor-field select:focus {
    border-color: var(--ps-focus);
    outline: var(--ps-focus-outline);
    outline-offset: var(--ps-focus-outline-offset);
    box-shadow: var(--ps-focus-box-shadow);
  }

  .pronoun-detail-editor-examples {
    margin-top: var(--ps-spacing-lg);
  }

  .pronoun-detail-editor-examples h4 {
    font-size: var(--ps-font-size-md);
    font-weight: 600;
    color: var(--ps-text);
    margin-bottom: var(--ps-spacing-md);
    font-family: var(--ps-font-family);
  }

  .pronoun-detail-editor-examples ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }

  .pronoun-detail-editor-examples li {
    padding: var(--ps-spacing-sm) 0;
    color: var(--ps-helper-text);
  }

  .pronoun-detail-editor-footer {
    display: flex;
    justify-content: flex-end;
    gap: var(--ps-spacing-md);
    padding: var(--ps-spacing-md);
    border-top: 1px solid var(--ps-border);
    background-color: var(--ps-secondary-faint);
  }

  .pronoun-detail-editor-cancel {
    padding: var(--ps-btn-padding);
    background-color: var(--ps-secondary);
    color: var(--ps-text);
    border: none;
    border-radius: var(--ps-btn-radius);
    font-weight: var(--ps-btn-font-weight);
    cursor: pointer;
    font-size: var(--ps-btn-font-size);
    transition: background-color 0.15s ease;
    font-family: var(--ps-font-family);
  }

  .pronoun-detail-editor-cancel:hover {
    background-color: var(--ps-secondary-hover-border);
  }

  .pronoun-detail-editor-save {
    padding: var(--ps-btn-padding);
    background-color: var(--ps-primary);
    color: var(--ps-bg);
    border: none;
    border-radius: var(--ps-btn-radius);
    font-weight: var(--ps-btn-font-weight);
    cursor: pointer;
    font-size: var(--ps-btn-font-size);
    transition: background-color 0.15s ease;
    margin-top: 0;
    font-family: var(--ps-font-family);
  }

  .pronoun-detail-editor-save:hover:not(:disabled) {
    background-color: var(--ps-primary-hover);
    filter: brightness(1.1);
  }

  .pronoun-detail-editor-save:disabled {
    background-color: var(--ps-disabled);
    cursor: not-allowed;
  }

  .pronoun-detail-editor-save:focus-visible,
  .pronoun-detail-editor-cancel:focus-visible {
    outline: var(--ps-focus-outline);
    outline-offset: var(--ps-focus-outline-offset);
    box-shadow: var(--ps-focus-box-shadow);
  }

  .pronoun-detail-editor-overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    z-index: 999;
  }
`;
