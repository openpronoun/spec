/**
 * ClassNames interfaces for customizing CSS classes on pronoun components.
 *
 * Each key maps to a specific DOM element within the component.
 * Values are merged with the component's built-in classes using `clsx`.
 */

// ---------------------------------------------------------------------------
// Internal / leaf components
// ---------------------------------------------------------------------------

/**
 * Custom class names for the EditorHeader component.
 */
export interface EditorHeaderClassNames {
  /** The close button */
  closeButton?: string;
  /** The root container `<div>` */
  root?: string;
  /** The `<h3>` title element */
  title?: string;
}

/**
 * Custom class names for the EditorFooter component.
 */
export interface EditorFooterClassNames {
  /** The cancel button */
  cancelButton?: string;
  /** The root container `<div>` */
  root?: string;
  /** The save button */
  saveButton?: string;
}

/**
 * Custom class names for the FormField component.
 */
export interface FormFieldClassNames {
  /** The `<small>` description element */
  description?: string;
  /** The `<input>` or `<select>` element */
  input?: string;
  /** The `<label>` element */
  label?: string;
  /** The root container `<div>` */
  root?: string;
}

/**
 * Custom class names for the ExamplesList component.
 */
export interface ExamplesListClassNames {
  /** The `<h4>` heading element */
  heading?: string;
  /** Each `<li>` item */
  item?: string;
  /** The `<ul>` list element */
  list?: string;
  /** The root container `<div>` */
  root?: string;
}

// ---------------------------------------------------------------------------
// PronounTag (covers all 3 sub-components)
// ---------------------------------------------------------------------------

/**
 * Custom class names for the PronounTag component.
 */
export interface PronounTagClassNames {
  /** The actions wrapper */
  actions?: string;
  /** The outer container */
  container?: string;
  /** The drag handle element */
  dragHandle?: string;
  /** The edit button */
  editButton?: string;
  /** The label text */
  label?: string;
  /** The remove button */
  removeButton?: string;
}

// ---------------------------------------------------------------------------
// SortableMultiValue
// ---------------------------------------------------------------------------

/**
 * Custom class names for the SortableMultiValue component.
 */
export interface SortableMultiValueClassNames {
  /** The root wrapper */
  root?: string;
}

// ---------------------------------------------------------------------------
// PronounOptionFormatter
// ---------------------------------------------------------------------------

/**
 * Custom class names for the PronounOptionFormatter component.
 */
export interface PronounOptionFormatterClassNames {
  /** The "Create custom" option wrapper */
  createCustom?: string;
  /** The icon inside the "Create custom" option */
  createCustomIcon?: string;
  /** An individual example sentence */
  example?: string;
  /** The examples container */
  examples?: string;
  /** The group count badge */
  groupCount?: string;
  /** The group label wrapper */
  groupLabel?: string;
  /** The text inside the group label */
  groupLabelText?: string;
  /** The option label text */
  optionLabel?: string;
  /** The option wrapper when examples are shown */
  optionWithExamples?: string;
}

// ---------------------------------------------------------------------------
// Composite components
// ---------------------------------------------------------------------------

/**
 * Custom class names for the PronounDetailEditor component.
 * Composes class names for its child components.
 */
export interface PronounDetailEditorClassNames {
  /** The body/content area */
  body?: string;
  /** Class names forwarded to the ExamplesList child */
  examples?: ExamplesListClassNames;
  /** Class names forwarded to each FormField child */
  field?: FormFieldClassNames;
  /** Class names forwarded to the EditorFooter child */
  footer?: EditorFooterClassNames;
  /** The `<form>` element */
  form?: string;
  /** Class names forwarded to the EditorHeader child */
  header?: EditorHeaderClassNames;
  /** The root container */
  root?: string;
}

/**
 * Custom class names for the PronounSelector component.
 * Composes class names for its child components.
 */
export interface PronounSelectorClassNames {
  /** The badge check icon element (badges dropdown mode) */
  badgeCheckIcon?: string;
  /** The badge menu container (badges dropdown mode) */
  badgeMenu?: string;
  /** A badge pill element (badges dropdown mode) */
  badgePill?: string;
  /** The custom "+" badge pill (badges dropdown mode) */
  badgePillCustom?: string;
  /** A selected badge pill (badges dropdown mode) */
  badgePillSelected?: string;
  /** Class names forwarded to the PronounDetailEditor child */
  editor?: PronounDetailEditorClassNames;
  /** The editor container wrapper */
  editorContainer?: string;
  /** Class names forwarded to PronounOptionFormatter children */
  option?: PronounOptionFormatterClassNames;
  /** The original text banner above the dropdown */
  originalTextBanner?: string;
  /** The root container */
  root?: string;
  /** The screen reader description element */
  screenReaderDescription?: string;
  /** Class names forwarded to SortableMultiValue children */
  sortableValue?: SortableMultiValueClassNames;
  /** Class names forwarded to PronounTag children */
  tag?: PronounTagClassNames;
}

// ---------------------------------------------------------------------------
// Display components
// ---------------------------------------------------------------------------

/**
 * Custom class names for the PronounDisplay component.
 */
export interface PronounDisplayClassNames {
  /** Class names forwarded to each PronounBadge child (badges display mode) */
  badge?: PronounBadgeClassNames;
  /** Class names forwarded to the OriginalTextBadge child (badges display mode) */
  originalTextBadge?: OriginalTextBadgeClassNames;
  /** The info icon button for original text */
  originalTextIcon?: string;
  /** The original text popover container */
  originalTextPopover?: string;
  /** The pronoun text element */
  pronounText?: string;
  /** The pronoun wrapper element */
  pronounWrapper?: string;
  /** The root container */
  root?: string;
  /** The tooltip container */
  tooltip?: string;
  /** An example sentence inside the tooltip */
  tooltipExample?: string;
}

/**
 * Custom class names for the PronounBadge component.
 */
export interface PronounBadgeClassNames {
  /** The remove button */
  removeButton?: string;
  /** The root container */
  root?: string;
  /** The text element */
  text?: string;
}

/**
 * Custom class names for the OriginalTextBadge component.
 */
export interface OriginalTextBadgeClassNames {
  /** The info icon button */
  icon?: string;
  /** The popover container */
  popover?: string;
  /** The root container */
  root?: string;
}

// ---------------------------------------------------------------------------
// Top-level form component
// ---------------------------------------------------------------------------

/**
 * Custom class names for the PronounForm component.
 * Composes class names for its child components.
 */
export interface PronounFormClassNames {
  /** The clear original text toggle container */
  clearOriginalTextToggle?: string;
  /** Class names forwarded to the PronounDisplay child */
  display?: PronounDisplayClassNames;
  /** The error message element */
  errorMessage?: string;
  /** The helper text element */
  helperText?: string;
  /** The label element */
  label?: string;
  /** The preview container */
  previewContainer?: string;
  /** The preview label */
  previewLabel?: string;
  /** The required indicator (e.g. asterisk) */
  requiredIndicator?: string;
  /** The root container */
  root?: string;
  /** Class names forwarded to the PronounSelector child */
  selector?: PronounSelectorClassNames;
}
