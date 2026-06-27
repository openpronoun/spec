"use client";

import clsx from "clsx";
import React, { useId } from "react";

import type { PronounFormClassNames } from "./classNames";
import { PronounDisplay } from "./PronounDisplay";
import { PronounSelector } from "./PronounSelector";
import { defaultTheme, mergeTheme } from "./theme";
import type { PronounIconConfig, PronounTheme } from "./theme";
import type { PronounEntry } from "./pronounUtils";
import { usePronounState } from "./usePronounState";

/**
 * Props for the PronounForm component
 */
export interface PronounFormProps {
  /** Optional CSS class name */
  className?: string;
  /** Optional class names for internal elements */
  classNames?: PronounFormClassNames;
  /**
   * When true (default), dropdown options show only the pronoun label.
   * When false, dropdown options include example sentences.
   */
  compactOptions?: boolean;
  /** Whether the field is disabled */
  disabled?: boolean;
  /**
   * Dropdown display mode.
   * "expanded" shows examples, "compact" hides examples, "badges" shows badge pills.
   * Default: "compact"
   */
  dropdownMode?: "badges" | "compact" | "expanded";
  /** Error message displayed below the selector */
  error?: string;
  /** Whether to group options by category. Default: true */
  grouped?: boolean;
  /** Helper text displayed below the selector */
  helperText?: string;
  /** Optional icon overrides */
  icons?: Partial<PronounIconConfig>;
  /** Label text */
  label?: string;
  /** Change handler for controlled mode */
  onChange?: (pronouns: PronounEntry[]) => void;
  /** Callback to clear the original text */
  onClearOriginalText?: () => void;
  /** The original freetext input, preserved for display */
  originalText?: string;
  /** Format for the preview display */
  previewFormat?: "long" | "medium" | "short";
  /** Whether the field is required */
  required?: boolean;
  /** Whether to show the clear original text toggle */
  showClearOriginalTextToggle?: boolean;
  /** Show a PronounDisplay preview below the selector */
  showPreview?: boolean;
  /** Optional theme override */
  theme?: Partial<PronounTheme>;
  /** Controlled value — array of pronoun entries */
  value?: PronounEntry[];
}

/**
 * PronounForm — a complete form component combining PronounSelector with
 * label, helper text, error display, and optional preview.
 *
 * Supports both controlled (value/onChange) and uncontrolled modes.
 */
export const PronounForm: React.FC<PronounFormProps> = ({
  className,
  classNames,
  compactOptions = true,
  disabled = false,
  dropdownMode,
  error,
  grouped,
  helperText,
  icons,
  label = "Pronouns",
  onChange,
  onClearOriginalText,
  originalText,
  previewFormat = "short",
  required = false,
  showClearOriginalTextToggle = false,
  showPreview = false,
  theme,
  value,
}) => {
  const formId = useId();
  const resolvedTheme = theme ? mergeTheme(theme) : defaultTheme;

  // Uncontrolled mode: use internal state
  const internalState = usePronounState(value);

  const isControlled = value !== undefined && onChange !== undefined;
  const currentValue = isControlled ? value : internalState.pronouns;
  const handleChange = isControlled ? onChange : internalState.setPronouns;

  const labelStyle: React.CSSProperties = {
    color:
      resolvedTheme.labelStyle?.color ??
      resolvedTheme.colors.label ??
      resolvedTheme.colors.text,
    display: "block",
    fontSize:
      resolvedTheme.labelStyle?.fontSize ?? resolvedTheme.fontSizes.medium,
    fontWeight: resolvedTheme.labelStyle?.fontWeight ?? 500,
    marginBottom:
      resolvedTheme.labelStyle?.marginBottom ?? resolvedTheme.spacing.small,
    ...(resolvedTheme.fontFamily
      ? { fontFamily: resolvedTheme.fontFamily }
      : {}),
  };

  const requiredStyle: React.CSSProperties = {
    color: resolvedTheme.colors.error,
    marginLeft: "2px",
  };

  const helperStyle: React.CSSProperties = {
    color: resolvedTheme.colors.helperText ?? resolvedTheme.colors.disabled,
    fontSize: resolvedTheme.fontSizes.small,
    marginTop: resolvedTheme.spacing.small,
    ...(resolvedTheme.fontFamily
      ? { fontFamily: resolvedTheme.fontFamily }
      : {}),
  };

  const errorStyle: React.CSSProperties = {
    color: resolvedTheme.colors.error,
    fontSize: resolvedTheme.fontSizes.small,
    marginTop: resolvedTheme.spacing.small,
    ...(resolvedTheme.fontFamily
      ? { fontFamily: resolvedTheme.fontFamily }
      : {}),
  };

  const previewStyle: React.CSSProperties = {
    backgroundColor: `${resolvedTheme.colors.secondary}40`,
    borderRadius: resolvedTheme.borderRadius,
    color: resolvedTheme.colors.text,
    fontSize: resolvedTheme.fontSizes.small,
    marginTop: resolvedTheme.spacing.medium,
    padding: resolvedTheme.spacing.medium,
    ...(resolvedTheme.fontFamily
      ? { fontFamily: resolvedTheme.fontFamily }
      : {}),
  };

  const previewLabelStyle: React.CSSProperties = {
    color: resolvedTheme.colors.label ?? resolvedTheme.colors.text,
    display: "block",
    fontSize: resolvedTheme.fontSizes.small,
    fontWeight: 500,
    marginBottom: resolvedTheme.spacing.small,
    opacity: 0.7,
  };

  return (
    <div
      aria-labelledby={`${formId}-label`}
      className={clsx("pronoun-form", className, classNames?.root)}
      role="group"
    >
      <label
        className={clsx("pronoun-form-label", classNames?.label)}
        id={`${formId}-label`}
        style={labelStyle}
      >
        {label}
        {required && (
          <span
            aria-hidden="true"
            className={clsx(
              "pronoun-form-required",
              classNames?.requiredIndicator,
            )}
            style={requiredStyle}
          >
            *
          </span>
        )}
      </label>

      <PronounSelector
        aria-label={label}
        classNames={classNames?.selector}
        compactOptions={compactOptions}
        disabled={disabled}
        dropdownMode={dropdownMode}
        grouped={grouped}
        icons={icons}
        onChange={handleChange}
        originalText={originalText}
        theme={theme}
        value={currentValue}
      />

      {showClearOriginalTextToggle && originalText && (
        <div
          className={clsx(
            "pronouns-form__clear-toggle",
            classNames?.clearOriginalTextToggle,
          )}
          style={{
            alignItems: "center",
            color: resolvedTheme.colors.text,
            display: "flex",
            fontSize: resolvedTheme.fontSizes.small,
            gap: "8px",
            marginTop: "8px",
          }}
        >
          <input
            id={`${formId}-clear-original-text`}
            onChange={() => onClearOriginalText?.()}
            type="checkbox"
          />
          <label htmlFor={`${formId}-clear-original-text`}>
            Clear original text on save
          </label>
        </div>
      )}

      {helperText && !error && (
        <div
          className={clsx("pronoun-form-helper", classNames?.helperText)}
          role="note"
          style={helperStyle}
        >
          {helperText}
        </div>
      )}

      {error && (
        <div
          className={clsx("pronoun-form-error", classNames?.errorMessage)}
          role="alert"
          style={errorStyle}
        >
          {error}
        </div>
      )}

      {showPreview && currentValue.length > 0 && (
        <div
          className={clsx("pronoun-form-preview", classNames?.previewContainer)}
          style={previewStyle}
        >
          <span
            className={clsx(
              "pronoun-form-preview-label",
              classNames?.previewLabel,
            )}
            style={previewLabelStyle}
          >
            Preview:
          </span>
          <PronounDisplay
            classNames={classNames?.display}
            format={previewFormat}
            pronouns={currentValue}
            theme={theme}
          />
        </div>
      )}
    </div>
  );
};

export default PronounForm;
