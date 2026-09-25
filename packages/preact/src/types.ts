import type { PronounEntry, PronounSet } from "./pronounUtils";

import type { PronounSelectorClassNames } from "./classNames";
import type { PronounIconConfig, PronounTheme } from "./theme";

/**
 * Interface for pronoun option used in react-select
 */
export interface PronounOption {
  /**
   * Example sentences for this pronoun set
   */
  examples?: string[];

  /**
   * Unique identifier for drag-and-drop
   */
  id?: string;

  /**
   * True only for the "Create custom pronoun set" sentinel option.
   * Use this instead of inspecting value.subjective.
   */
  isCreate?: boolean;

  /**
   * Whether this is a user-entered custom pronoun set
   */
  isCustom?: boolean;

  /**
   * Display label for the option
   */
  label: string;

  /**
   * The pronoun entry data (standard set, special preference, or custom entry)
   */
  value: PronounEntry;
}

/**
 * Interface for pronoun option groups
 */
export interface PronounOptionGroup {
  /**
   * Group label
   */
  label: string;

  /**
   * Options in this group
   */
  options: PronounOption[];
}

/**
 * Props for the PronounSelector component
 */
export interface PronounSelectorProps {
  /**
   * Optional aria-label for accessibility
   */
  "aria-label"?: string;

  /**
   * Optional CSS class name
   */
  className?: string;

  /**
   * Optional class name overrides for internal elements
   */
  classNames?: PronounSelectorClassNames;

  /**
   * When true (default), dropdown options show only the pronoun label.
   * When false, dropdown options include example sentences.
   */
  compactOptions?: boolean;

  /**
   * Whether the component is disabled
   */
  disabled?: boolean;

  /**
   * Dropdown display mode.
   * "expanded" shows examples, "compact" hides examples, "badges" shows badge pills.
   * Default: "compact"
   */
  dropdownMode?: "badges" | "compact" | "expanded";

  /**
   * Whether to group options by category. Default: true
   */
  grouped?: boolean;

  /**
   * Optional icon overrides
   */
  icons?: Partial<PronounIconConfig>;

  /**
   * Optional ID attribute
   */
  id?: string;

  /**
   * Optional name attribute for the form field
   */
  name?: string;

  /**
   * Callback when the selected pronoun entries change
   */
  onChange: (value: PronounEntry[]) => void;

  /**
   * The original freetext input, preserved for display
   */
  originalText?: string;

  /**
   * Optional placeholder text
   */
  placeholder?: string;

  /**
   * Optional theme
   */
  theme?: Partial<PronounTheme>;

  /**
   * The currently selected pronoun entries
   */
  value: PronounEntry[];
}

// Re-export for convenience
export type { PronounEntry, PronounSet };
