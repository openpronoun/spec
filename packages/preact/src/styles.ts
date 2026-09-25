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
    width: 100%;
    position: relative;
    font-family: var(--ps-font-family);
    color: var(--ps-text);
  }

  /* ── Control (tags + input wrapper) ───────────────────────────── */

  .pronoun-select__control {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 2px;
    min-height: var(--ps-control-height);
    padding: 2px 6px;
    background-color: var(--ps-bg);
    border: 1px solid var(--ps-border);
    border-radius: var(--ps-radius);
    cursor: text;
    transition: border-color 0.15s ease, box-shadow 0.15s ease;
    font-family: var(--ps-font-family);
  }

  .pronoun-select__control:hover {
    border-color: var(--ps-primary-hover);
  }

  .pronoun-select__control:focus-within {
    border-color: var(--ps-focus);
    box-shadow: var(--ps-focus-ring);
  }

  /* ── Input ────────────────────────────────────────────────────── */

  .pronoun-select__input {
    flex: 1;
    min-width: 80px;
    border: none;
    outline: none;
    background: transparent;
    color: var(--ps-text);
    font-size: var(--ps-font-size-md);
    padding: 4px 2px;
    font-family: var(--ps-font-family);
  }

  .pronoun-select__input::placeholder {
    color: var(--ps-placeholder);
  }

  /* ── Trigger (chevron button) ─────────────────────────────────── */

  .pronoun-select__trigger {
    display: flex;
    align-items: center;
    justify-content: center;
    background: none;
    border: none;
    color: var(--ps-disabled);
    cursor: pointer;
    padding: 4px;
    border-radius: var(--ps-radius);
    transition: color 0.15s ease;
    flex-shrink: 0;
  }

  .pronoun-select__trigger:hover {
    color: var(--ps-text);
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
    background-color: var(--ps-bg);
    border: 1px solid var(--ps-border);
    border-radius: var(--ps-radius);
    box-shadow: 0 8px 16px -2px rgba(0, 0, 0, 0.1), 0 2px 6px -1px rgba(0, 0, 0, 0.06);
    overflow-y: auto;
    max-height: 320px;
    padding: 4px 0;
    position: relative;
    font-family: var(--ps-font-family);
  }

  /* ── Group labels ─────────────────────────────────────────────── */

  .pronoun-group-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px 6px;
    color: var(--ps-label);
    font-weight: 700;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1px solid var(--ps-border);
    margin-bottom: 2px;
  }

  .pronoun-group-count {
    background-color: var(--ps-secondary);
    border-radius: 9999px;
    color: var(--ps-label);
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0;
    padding: 1px 6px;
  }

  /* ── Options ──────────────────────────────────────────────────── */

  .pronoun-select__option {
    padding: 6px 12px;
    cursor: default;
    color: var(--ps-text);
    font-size: var(--ps-font-size-md);
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 8px;
    font-family: var(--ps-font-family);
  }

  .pronoun-select__option[data-highlighted] {
    background-color: var(--ps-secondary);
  }

  .pronoun-select__option[data-selected] {
    background-color: var(--ps-primary-dim-1);
    color: var(--ps-primary);
  }

  .pronoun-select__option[data-highlighted][data-selected] {
    background-color: var(--ps-primary-dim-2);
  }

  .pronoun-select__option--create {
    color: var(--ps-primary);
    font-weight: 500;
  }

  .pronoun-select__item-indicator {
    font-size: 0.75rem;
    color: var(--ps-primary);
    flex-shrink: 0;
  }

  .pronoun-examples {
    margin-top: 2px;
    font-size: 0.75rem;
    line-height: 1.4;
    color: var(--ps-helper-text);
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

  /* ── Tags (selected values in the control) ────────────────────── */

  .pronoun-tag-label {
    display: flex;
    align-items: center;
    cursor: grab;
    gap: 4px;
    line-height: 1;
  }

  .pronoun-tag-container {
    display: flex;
    align-items: center;
    flex-direction: row;
    background-color: var(--ps-secondary);
    border: 1px solid var(--ps-border);
    border-radius: 9999px;
    padding: 3px 4px 3px 8px;
    margin: 2px 4px 2px 0;
    gap: 2px;
  }

  .pronoun-drag-handle {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: var(--ps-disabled);
    cursor: grab;
  }

  .pronoun-multi-value {
    transition: transform 0.2s, box-shadow 0.2s;
    margin-top: 0;
  }

  .pronoun-multi-value.is-dragging {
    z-index: 1;
    transform: scale(1.05);
    box-shadow: 0 0 5px rgba(0, 0, 0, 0.2);
  }

  .pronoun-tag-actions {
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .pronoun-tag-edit {
    background: none;
    border: none;
    border-radius: var(--ps-radius);
    color: var(--ps-disabled);
    cursor: pointer;
    font-size: 0.75rem;
    height: 22px;
    width: 22px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease, background-color 0.15s ease;
  }

  .pronoun-tag-edit:hover {
    color: var(--ps-primary);
    background-color: var(--ps-secondary-hover);
  }

  .pronoun-tag-edit:focus-visible {
    outline: none;
    box-shadow: var(--ps-focus-ring);
  }

  .pronoun-tag-remove {
    background: none;
    border: none;
    border-radius: var(--ps-radius);
    color: var(--ps-disabled);
    cursor: pointer;
    font-size: 0.75rem;
    height: 22px;
    width: 22px;
    padding: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: color 0.15s ease, background-color 0.15s ease;
    margin-top: 0;
  }

  .pronoun-tag-remove:hover {
    color: var(--ps-error);
    background-color: var(--ps-secondary-hover);
  }

  .pronoun-tag-remove:focus-visible {
    outline: none;
    box-shadow: var(--ps-focus-ring);
  }

  /* ── Badge mode ───────────────────────────────────────────────── */

  .pronoun-badge-menu {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
    padding: 8px 10px;
    max-height: none;
  }

  .pronoun-badge-pill {
    display: inline-flex;
    align-items: center;
    gap: 6px;
    background-color: var(--ps-secondary);
    border: 1px solid var(--ps-border);
    border-radius: var(--ps-badge-radius);
    color: var(--ps-text);
    cursor: pointer;
    font-size: var(--ps-font-size-sm);
    font-weight: 500;
    padding: 4px 10px;
    transition: background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease;
  }

  .pronoun-badge-pill[data-selected],
  .pronoun-badge-pill[data-highlighted][data-selected] {
    background-color: var(--ps-primary);
    border-color: var(--ps-primary);
    color: var(--ps-bg);
  }

  .pronoun-badge-pill[data-highlighted]:not([data-selected]) {
    background-color: var(--ps-secondary-hover);
  }

  .pronoun-badge-pill--custom {
    background-color: transparent;
    border-color: var(--ps-primary);
    border-style: dashed;
    color: var(--ps-primary);
  }

  .pronoun-badge-check {
    font-size: 0.7rem;
  }

  /* ── Editor overlay ───────────────────────────────────────────── */

  .pronoun-create-custom {
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
