import type { StylesConfig } from "react-select";

import type { PronounTheme } from "./theme";
import type { PronounOption } from "./types";

/**
 * Resolves the focus box-shadow for a given theme.
 * Uses focusStyle.boxShadow if set, otherwise builds one from focusRing or primary color.
 */
function resolveFocusBoxShadow(theme: PronounTheme): string {
  if (theme.focusStyle?.boxShadow) {
    return theme.focusStyle.boxShadow;
  }
  const ringColor =
    theme.colors.focusRing ?? `${theme.colors.focus ?? theme.colors.primary}40`;
  return `0 0 0 3px ${ringColor}`;
}

/**
 * Custom styles for react-select component
 */
export const getCustomStyles = (
  mergedTheme: PronounTheme,
): StylesConfig<PronounOption, true> => ({
  control: (base, state) => ({
    ...base,
    "&:hover": {
      borderColor:
        mergedTheme.colors.primaryHover ?? mergedTheme.colors.primary,
    },
    backgroundColor: mergedTheme.colors.background,
    borderColor: state.isFocused
      ? (mergedTheme.colors.focus ?? mergedTheme.colors.primary)
      : mergedTheme.colors.border,
    borderRadius: mergedTheme.borderRadius,
    boxShadow: state.isFocused
      ? resolveFocusBoxShadow(mergedTheme)
      : base.boxShadow,
    fontFamily: mergedTheme.fontFamily ?? base.fontFamily,
    minHeight: mergedTheme.inputHeight ?? base.minHeight,
  }),
  group: (base) => ({
    ...base,
    paddingBottom: 0,
    paddingTop: 0,
  }),
  groupHeading: (base) => ({
    ...base,
    marginBottom: 0,
    paddingBottom: 0,
    paddingLeft: 0,
    paddingRight: 0,
    paddingTop: 0,
  }),
  input: (base) => ({
    ...base,
    color: mergedTheme.colors.text,
    fontFamily: mergedTheme.fontFamily ?? base.fontFamily,
  }),
  menu: (base) => ({
    ...base,
    backgroundColor: mergedTheme.colors.background,
    border: `1px solid ${mergedTheme.colors.border}`,
    borderRadius: mergedTheme.borderRadius,
    boxShadow: `0 8px 16px -2px rgba(0, 0, 0, 0.1), 0 2px 6px -1px rgba(0, 0, 0, 0.06)`,
    zIndex: 50,
  }),
  menuList: (base) => ({
    ...base,
    paddingBottom: 4,
    paddingTop: 4,
  }),
  multiValue: (base) => ({
    ...base,
    backgroundColor: "transparent",
    borderRadius: 0,
    margin: "2px 4px 2px 0",
    padding: 0,
  }),
  multiValueLabel: (base) => ({
    ...base,
    color: mergedTheme.colors.text,
    fontFamily: mergedTheme.fontFamily ?? base.fontFamily,
    fontWeight: 500,
    padding: 0,
  }),
  multiValueRemove: (base) => ({
    ...base,
    padding: 0,
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected
      ? `${mergedTheme.colors.primary}18`
      : state.isFocused
        ? mergedTheme.colors.secondary
        : "transparent",
    color: state.isSelected
      ? mergedTheme.colors.primary
      : mergedTheme.colors.text,
    cursor: "default",
    fontFamily: mergedTheme.fontFamily ?? base.fontFamily,
    padding: "6px 12px",
  }),
  placeholder: (base) => ({
    ...base,
    color: mergedTheme.colors.placeholder ?? mergedTheme.colors.disabled,
    fontFamily: mergedTheme.fontFamily ?? base.fontFamily,
  }),
  singleValue: (base) => ({
    ...base,
    color: mergedTheme.colors.text,
    fontFamily: mergedTheme.fontFamily ?? base.fontFamily,
  }),
});

/**
 * CSS styles for the PronounSelector component
 */
export const getPronounSelectorStyles = (mergedTheme: PronounTheme) => {
  const focusRing = resolveFocusBoxShadow(mergedTheme);
  return `
  .pronoun-selector {
    width: 100%;
    position: relative;
  }

  .pronoun-group-label {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 8px 12px 6px;
    color: ${mergedTheme.colors.label ?? mergedTheme.colors.disabled};
    font-weight: 700;
    font-size: 0.7rem;
    letter-spacing: 0.08em;
    text-transform: uppercase;
    border-bottom: 1px solid ${mergedTheme.colors.border};
    margin-bottom: 2px;
  }

  .pronoun-group-count {
    background-color: ${mergedTheme.colors.secondary};
    border-radius: 9999px;
    color: ${mergedTheme.colors.label ?? mergedTheme.colors.text};
    font-size: 0.7rem;
    font-weight: 700;
    letter-spacing: 0;
    padding: 1px 6px;
  }

  .pronoun-examples {
    margin-top: 2px;
    font-size: 0.75rem;
    line-height: 1.4;
    color: ${mergedTheme.colors.helperText ?? mergedTheme.colors.disabled};
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }

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
    background-color: ${mergedTheme.colors.secondary};
    border: 1px solid ${mergedTheme.colors.border};
    border-radius: 9999px;
    padding: 3px 4px 3px 8px;
    margin: 2px 4px 2px 0;
    gap: 2px;
  }

  .pronoun-drag-handle {
    display: flex;
    align-items: center;
    flex-shrink: 0;
    color: ${mergedTheme.colors.disabled};
    cursor: grab;
  }

  .pronoun-multi-value {
    transition: transform 0.2s, box-shadow 0.2s;
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
    border-radius: ${mergedTheme.borderRadius};
    color: ${mergedTheme.colors.disabled};
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
    color: ${mergedTheme.colors.primary};
    background-color: ${mergedTheme.colors.secondaryHover ?? mergedTheme.colors.secondary};
  }

  .pronoun-tag-edit:focus-visible {
    outline: none;
    box-shadow: ${focusRing};
  }

  .pronoun-tag-remove {
    background: none;
    border: none;
    border-radius: ${mergedTheme.borderRadius};
    color: ${mergedTheme.colors.disabled};
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

  .pronoun-tag-remove:hover {
    color: ${mergedTheme.colors.error};
    background-color: ${mergedTheme.colors.secondaryHover ?? mergedTheme.colors.secondary};
  }

  .pronoun-tag-remove:focus-visible {
    outline: none;
    box-shadow: ${focusRing};
  }

  .pronoun-create-custom {
    color: ${mergedTheme.colors.primary};
    font-weight: 500;
  }

  .pronoun-detail-editor-container {
    position: absolute;
    top: 0;
    right: 0;
    width: 100%;
    height: 100%;
    z-index: 2;
    background-color: ${mergedTheme.colors.background}f2;
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
};

/**
 * CSS styles for the PronounDetailEditor component
 */
export const getPronounDetailEditorStyles = (mergedTheme: PronounTheme) => {
  const focusColor = mergedTheme.colors.focus ?? mergedTheme.colors.primary;
  const focusBoxShadow = resolveFocusBoxShadow(mergedTheme);
  const fontFamilyRule = mergedTheme.fontFamily
    ? `font-family: ${mergedTheme.fontFamily};`
    : "";
  const inputHeight = mergedTheme.inputHeight
    ? `min-height: ${mergedTheme.inputHeight};`
    : "";
  const helperTextColor =
    mergedTheme.colors.helperText ?? mergedTheme.colors.text;
  const labelColor =
    mergedTheme.labelStyle?.color ??
    mergedTheme.colors.label ??
    mergedTheme.colors.text;
  const labelFontSize =
    mergedTheme.labelStyle?.fontSize ?? mergedTheme.fontSizes.medium;
  const labelFontWeight = mergedTheme.labelStyle?.fontWeight ?? 500;

  // Button styling
  const btnBorderRadius =
    mergedTheme.buttonStyle?.borderRadius ?? mergedTheme.borderRadius;
  const btnPadding =
    mergedTheme.buttonStyle?.padding ??
    `${mergedTheme.spacing.small} ${mergedTheme.spacing.medium}`;
  const btnFontWeight = mergedTheme.buttonStyle?.fontWeight ?? 500;
  const btnFontSize =
    mergedTheme.buttonStyle?.fontSize ?? mergedTheme.fontSizes.small;

  // Focus outline vs box-shadow
  let focusOutlineCSS: string;
  if (mergedTheme.focusStyle?.outline) {
    focusOutlineCSS = `
      outline: ${mergedTheme.focusStyle.outline};
      outline-offset: ${mergedTheme.focusStyle.outlineOffset ?? "2px"};
      box-shadow: none;
    `;
  } else {
    focusOutlineCSS = `
      outline: none;
      box-shadow: ${focusBoxShadow};
    `;
  }

  return `
  .pronoun-detail-editor {
    position: relative;
    background-color: ${mergedTheme.colors.background};
    border-radius: ${mergedTheme.borderRadius};
    box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    z-index: 3;
    border-left: 1px solid ${mergedTheme.colors.border};
    overflow: hidden; /* Ensure content doesn't overflow */
    animation: slideIn 0.3s ease-out;
    ${fontFamilyRule}
  }
  
  @keyframes slideIn {
    from {
      transform: translateX(100%);
    }
    to {
      transform: translateX(0);
    }
  }

  @media (prefers-reduced-motion: reduce) {
    .pronoun-detail-editor {
      animation: none;
    }
  }

  .pronoun-detail-editor-header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: ${mergedTheme.spacing.large};
    border-bottom: 1px solid ${mergedTheme.colors.border};
    background-color: ${mergedTheme.colors.secondary}30; /* 30% opacity */
  }
  
  .pronoun-detail-editor-header h3 {
    margin: 0;
    font-size: ${mergedTheme.fontSizes.large};
    font-weight: 600;
    color: ${mergedTheme.colors.text};
    ${fontFamilyRule}
  }
  
  .pronoun-detail-editor-close {
    background: none;
    border: none;
    border-radius: ${mergedTheme.borderRadius};
    font-size: 1.25rem;
    line-height: 1;
    padding: 4px 8px;
    cursor: pointer;
    color: ${mergedTheme.colors.text};
    transition: background-color 0.15s ease, color 0.15s ease;
  }

  .pronoun-detail-editor-close:hover {
    background-color: ${mergedTheme.colors.secondary};
    color: ${mergedTheme.colors.primary};
  }

  .pronoun-detail-editor-close:focus-visible {
    ${focusOutlineCSS}
  }
  
  .pronoun-detail-editor-body {
    padding: ${mergedTheme.spacing.medium};
    overflow-y: auto;
    flex: 1;
    max-height: calc(100% - 110px); /* Account for header and footer */
  }
  
  .pronoun-detail-editor-form {
    display: flex;
    flex-direction: column;
    gap: ${mergedTheme.spacing.large};
  }
  
  .pronoun-detail-editor-field {
    display: flex;
    flex-direction: column;
    gap: ${mergedTheme.spacing.small};
    margin-bottom: ${mergedTheme.spacing.small};
  }
  
  .pronoun-detail-editor-field-desc {
    font-size: ${mergedTheme.fontSizes.small};
    color: ${helperTextColor};
    margin-top: ${mergedTheme.spacing.small};
  }
  
  .pronoun-detail-editor-field label {
    font-size: ${labelFontSize};
    font-weight: ${labelFontWeight};
    color: ${labelColor};
    ${fontFamilyRule}
  }
  
  .pronoun-detail-editor-field input,
  .pronoun-detail-editor-field select {
    padding: ${mergedTheme.spacing.small} ${mergedTheme.spacing.medium};
    border: 1px solid ${mergedTheme.colors.border};
    border-radius: ${mergedTheme.borderRadius};
    font-size: ${mergedTheme.fontSizes.small};
    background-color: ${mergedTheme.colors.background};
    color: ${mergedTheme.colors.text};
    width: 100%;
    ${inputHeight}
    ${fontFamilyRule}
  }
  
  .pronoun-detail-editor-field input::placeholder {
    color: ${mergedTheme.colors.placeholder ?? mergedTheme.colors.disabled};
  }
  
  .pronoun-detail-editor-field input:focus,
  .pronoun-detail-editor-field select:focus {
    border-color: ${focusColor};
    ${focusOutlineCSS}
  }
  
  .pronoun-detail-editor-examples {
    margin-top: ${mergedTheme.spacing.large};
  }
  
  .pronoun-detail-editor-examples h4 {
    font-size: ${mergedTheme.fontSizes.medium};
    font-weight: 600;
    color: ${mergedTheme.colors.text};
    margin-bottom: ${mergedTheme.spacing.medium};
    ${fontFamilyRule}
  }
  
  .pronoun-detail-editor-examples ul {
    list-style-type: none;
    padding: 0;
    margin: 0;
  }
  
  .pronoun-detail-editor-examples li {
    padding: ${mergedTheme.spacing.small} 0;
    color: ${helperTextColor};
  }
  
  .pronoun-detail-editor-footer {
    display: flex;
    justify-content: flex-end;
    gap: ${mergedTheme.spacing.medium};
    padding: ${mergedTheme.spacing.medium};
    border-top: 1px solid ${mergedTheme.colors.border};
    background-color: ${mergedTheme.colors.secondary}10; /* 10% opacity */
  }
  
  .pronoun-detail-editor-cancel {
    padding: ${btnPadding};
    background-color: ${mergedTheme.colors.secondary};
    color: ${mergedTheme.colors.text};
    border: none;
    border-radius: ${btnBorderRadius};
    font-weight: ${btnFontWeight};
    cursor: pointer;
    font-size: ${btnFontSize};
    transition: background-color 0.15s ease;
    ${fontFamilyRule}
  }

  .pronoun-detail-editor-cancel:hover {
    background-color: ${mergedTheme.colors.secondaryHover ?? mergedTheme.colors.border};
  }

  .pronoun-detail-editor-save {
    padding: ${btnPadding};
    background-color: ${mergedTheme.colors.primary};
    color: ${mergedTheme.colors.background};
    border: none;
    border-radius: ${btnBorderRadius};
    font-weight: ${btnFontWeight};
    cursor: pointer;
    font-size: ${btnFontSize};
    transition: background-color 0.15s ease;
    ${fontFamilyRule}
  }

  .pronoun-detail-editor-save:hover:not(:disabled) {
    background-color: ${mergedTheme.colors.primaryHover ?? mergedTheme.colors.primary};
    filter: brightness(1.1);
  }

  .pronoun-detail-editor-save:disabled {
    background-color: ${mergedTheme.colors.disabled};
    cursor: not-allowed;
  }

  .pronoun-detail-editor-save:focus-visible,
  .pronoun-detail-editor-cancel:focus-visible {
    ${focusOutlineCSS}
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
};
