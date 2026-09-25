// Components
export { PronounDisplay } from "./PronounDisplay";
export { PronounBadge } from "./PronounBadge";
export { OriginalTextBadge } from "./OriginalTextBadge";
export { default as OpenPronounsLogo } from "./OpenPronounsLogo";

// Hooks
export { usePronounState } from "./usePronounState";
export { usePronounParser } from "./usePronounParser";

// Theme
export {
  defaultTheme,
  darkTheme,
  plumecareTheme,
  memberDashboardTheme,
  mergeTheme,
  mergeIcons,
  defaultIcons,
} from "./theme";

// Types from theme
export type {
  PronounTheme,
  PronounThemeColors,
  PronounIconConfig,
  PronounFocusStyle,
  PronounLabelStyle,
  PronounButtonStyle,
  PronounBadgeStyle,
} from "./theme";

// ClassNames interfaces
export type {
  EditorHeaderClassNames,
  EditorFooterClassNames,
  FormFieldClassNames,
  ExamplesListClassNames,
  PronounTagClassNames,
  SortableMultiValueClassNames,
  PronounOptionFormatterClassNames,
  PronounDetailEditorClassNames,
  PronounSelectorClassNames,
  PronounDisplayClassNames,
  PronounBadgeClassNames,
  OriginalTextBadgeClassNames,
  PronounFormClassNames,
} from "./classNames";

// Component prop types
export type { PronounOption, PronounOptionGroup, PronounSelectorProps } from "./types";
export type { PronounDisplayProps } from "./PronounDisplay";
export type { PronounBadgeProps } from "./PronounBadge";

// Core data types
export type {
  PronounEntry,
  PronounSet,
  PronounPreference,
  SpecialPreference,
} from "./pronounUtils";

// Utilities
export {
  PronounType,
  PrivacyLevel,
  COMMON_PRONOUN_SETS,
  KNOWN_NEOPRONOUN_SETS,
  SPECIAL_PRONOUN_SETS,
  isStandardSet,
  getSubjective,
  getObjective,
  getPossessiveAdjective,
  getPossessivePronoun,
  getReflexive,
  createExampleSentences,
  formatPronounSet,
  formatPronouns,
  parsePronounPreference,
  validatePronounSet,
  getPronounSetValidationErrors,
} from "./pronounUtils";

// Hook types
export type {
  UsePronounStateOptions,
  UsePronounStateReturn,
} from "./usePronounState";
export type { UsePronounParserOptions, UsePronounParserReturn } from "./usePronounParser";
