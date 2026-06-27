import clsx from "clsx";
import React from "react";
import type { ReactNode, RefObject } from "react";

import type { FormFieldClassNames } from "./classNames";

/**
 * Props for the FormField component
 */
export interface FormFieldProps {
  /** Optional children for select options */
  children?: ReactNode;

  /** Custom CSS class names for sub-elements */
  classNames?: FormFieldClassNames;

  /** The description text for the form field */
  description?: string;

  /**
   * The field name — used as the key passed to onChange.
   * Uses a plain string so the editor can handle both full-key and compact-key
   * PronounSet variants without TypeScript fighting the union.
   */
  fieldName: string;

  /** The ID of the form field */
  id: string;

  /** Optional ref for the input element */
  inputRef?: RefObject<HTMLInputElement | null>;

  /** The label text for the form field */
  label: string;

  /** Callback when the value changes */
  onChange: (field: string, value: number | string) => void;

  /** Optional placeholder text */
  placeholder?: string;

  /** Whether the field is required */
  required?: boolean;

  /** The type of the input field */
  type?: "select" | "text";

  /** The current value of the field */
  value: number | string;
}

/**
 * A reusable form field component for the PronounDetailEditor
 */
export const FormField: React.FC<FormFieldProps> = ({
  children,
  classNames,
  description,
  fieldName,
  id,
  inputRef,
  label,
  onChange,
  placeholder,
  required = false,
  type = "text",
  value,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => onChange(fieldName, e.target.value);

  const handleKeyDown = (e: React.KeyboardEvent) => e.stopPropagation();

  const handleClick = (
    e: React.MouseEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    e.stopPropagation();
    (e.currentTarget as HTMLElement).focus();
  };

  const inputClassName = clsx(
    "pronoun-detail-editor-field-input",
    classNames?.input,
  );

  const inputProps = {
    "aria-describedby": description ? `${id}-desc` : undefined,
    "aria-required": required || undefined,
    className: inputClassName,
    id,
    onChange: handleChange,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    placeholder,
    ref: inputRef,
    type: "text",
    value,
  };

  const selectProps = {
    "aria-describedby": description ? `${id}-desc` : undefined,
    "aria-required": required || undefined,
    className: inputClassName,
    id,
    onChange: handleChange,
    onClick: handleClick,
    onKeyDown: handleKeyDown,
    value,
  };

  return (
    <div className={clsx("pronoun-detail-editor-field", classNames?.root)}>
      <label
        className={clsx("pronoun-detail-editor-field-label", classNames?.label)}
        htmlFor={id}
      >
        {label}
      </label>

      {type === "text" ? (
        <input {...inputProps} />
      ) : (
        <select {...selectProps}>{children}</select>
      )}

      {description && (
        <small
          className={clsx(
            "pronoun-detail-editor-field-desc",
            classNames?.description,
          )}
          id={`${id}-desc`}
        >
          {description}
        </small>
      )}
    </div>
  );
};

export default FormField;
