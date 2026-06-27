import type { ReactNode } from "react";

/**
 * Icon configuration for pronoun components.
 * All values are ReactNode — strings, emojis, SVG components, icon library components, etc.
 */
export interface PronounIconConfig {
  /** Close button in detail editor header. */
  close: ReactNode;
  /** "Create custom pronoun set" option prefix. */
  create: ReactNode;
  /** Drag handle shown on selected pronoun tags. */
  dragHandle: ReactNode;
  /** Edit button on pronoun tags. */
  edit: ReactNode;
  /** Info icon for original text popover. */
  info?: ReactNode;
  /** Remove/delete button on tags and badges. */
  remove: ReactNode;
}

const GripIcon = (
  <svg aria-hidden="true" fill="currentColor" height="12" viewBox="0 0 8 12" width="8" xmlns="http://www.w3.org/2000/svg">
    <circle cx="2.5" cy="2" r="1.25" />
    <circle cx="5.5" cy="2" r="1.25" />
    <circle cx="2.5" cy="6" r="1.25" />
    <circle cx="5.5" cy="6" r="1.25" />
    <circle cx="2.5" cy="10" r="1.25" />
    <circle cx="5.5" cy="10" r="1.25" />
  </svg>
);

const PencilIcon = (
  <svg aria-hidden="true" fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="1.75" viewBox="0 0 12 12" width="12" xmlns="http://www.w3.org/2000/svg">
    <path d="M8.5 1.5 10.5 3.5 4 10H2v-2z" />
  </svg>
);

const CloseIcon = (
  <svg aria-hidden="true" fill="none" height="10" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 10 10" width="10" xmlns="http://www.w3.org/2000/svg">
    <path d="M1.5 1.5 8.5 8.5M8.5 1.5 1.5 8.5" />
  </svg>
);

const PlusIcon = (
  <svg aria-hidden="true" fill="none" height="12" stroke="currentColor" strokeLinecap="round" strokeWidth="2" viewBox="0 0 12 12" width="12" xmlns="http://www.w3.org/2000/svg">
    <path d="M6 1v10M1 6h10" />
  </svg>
);

export const defaultIcons: PronounIconConfig = {
  close: CloseIcon,
  create: PlusIcon,
  dragHandle: GripIcon,
  edit: PencilIcon,
  remove: CloseIcon,
};

export function mergeIcons(
  customIcons?: Partial<PronounIconConfig>,
): PronounIconConfig {
  if (!customIcons) return defaultIcons;
  return { ...defaultIcons, ...customIcons };
}

/**
 * Theme interface for the react-pronouns components
 */

/**
 * Color palette for the pronoun theme.
 * Required colors are always present; optional colors provide
 * additional customization for focus states, labels, badges, etc.
 */
export interface PronounThemeColors {
  /** Background color */
  background: string;
  /** Badge background (defaults to secondary) */
  badgeBackground?: string;
  /** Badge text color (defaults to text) */
  badgeText?: string;
  /** Border color */
  border: string;
  /** Disabled color */
  disabled: string;
  /** Error color */
  error: string;
  /** Focus ring/outline color (defaults to primary) */
  focus?: string;

  // --- New optional colors ---

  /** Focus ring shadow color (defaults to primary at 40% opacity) */
  focusRing?: string;
  /** Helper/description text color */
  helperText?: string;
  /** Label text color (defaults to text) */
  label?: string;
  /** Placeholder text color */
  placeholder?: string;
  /** Primary color for buttons, focus states, etc. */
  primary: string;
  /** Primary hover state */
  primaryHover?: string;
  /** Secondary color for backgrounds, borders, etc. */
  secondary: string;
  /** Secondary hover state */
  secondaryHover?: string;
  /** Success state color */
  success?: string;
  /** Text color */
  text: string;
}

/**
 * Focus style configuration
 */
export interface PronounFocusStyle {
  /** Alternative to outline, e.g., '0 0 0 3px rgba(104, 22, 175, 0.4)' */
  boxShadow?: string;
  /** CSS outline value, e.g., '2px solid #A57CE4' */
  outline?: string;
  /** Outline offset, e.g., '2px', '4px' */
  outlineOffset?: string;
}

/**
 * Label style configuration
 */
export interface PronounLabelStyle {
  color?: string;
  fontSize?: string;
  fontWeight?: number | string;
  marginBottom?: string;
}

/**
 * Button style configuration
 */
export interface PronounButtonStyle {
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: number | string;
  padding?: string;
}

/**
 * Badge style configuration
 */
export interface PronounBadgeStyle {
  /** e.g., '9999px' for pill, '6px' for rounded */
  borderRadius?: string;
  fontSize?: string;
  fontWeight?: number | string;
  padding?: string;
}

export interface PronounTheme {
  /** Badge styling */
  badgeStyle?: PronounBadgeStyle;

  /** Border radius */
  borderRadius: string;

  /** Button styling */
  buttonStyle?: PronounButtonStyle;

  /** Colors */
  colors: PronounThemeColors;

  // --- New optional properties ---

  /** Focus style configuration */
  focusStyle?: PronounFocusStyle;

  /** Font family, e.g., "'Fibra One', sans-serif" */
  fontFamily?: string;

  /** Font sizes */
  fontSizes: {
    /** Large font size */
    large: string;
    /** Medium font size */
    medium: string;
    /** Small font size */
    small: string;
  };

  /** Input/control height, e.g., '48px', '40px', 'auto' */
  inputHeight?: string;

  /** Label styling */
  labelStyle?: PronounLabelStyle;

  /** Spacing */
  spacing: {
    /** Large spacing */
    large: string;
    /** Medium spacing */
    medium: string;
    /** Small spacing */
    small: string;
  };
}

/**
 * Default theme
 */
export const defaultTheme: PronounTheme = {
  borderRadius: "4px",
  colors: {
    background: "#ffffff",
    border: "#e2e8f0",
    disabled: "#a0aec0",
    error: "#e53e3e",
    helperText: "#718096",
    label: "#4a5568",
    primary: "#4299e1",
    secondary: "#e2e8f0",
    text: "#2d3748",
  },
  fontSizes: {
    large: "1rem",
    medium: "0.875rem",
    small: "0.75rem",
  },
  spacing: {
    large: "16px",
    medium: "8px",
    small: "4px",
  },
};

/**
 * Dark theme
 */
export const darkTheme: PronounTheme = {
  badgeStyle: {
    borderRadius: "9999px",
  },
  borderRadius: "4px",
  colors: {
    background: "#1a202c",
    badgeBackground: "#2d3748",
    badgeText: "#e2e8f0",
    border: "#4a5568",
    disabled: "#718096",
    error: "#fc8181",
    focus: "#63b3ed",
    focusRing: "rgba(99, 179, 237, 0.4)",
    helperText: "#a0aec0",
    label: "#cbd5e0",
    placeholder: "#718096",
    primary: "#63b3ed",
    primaryHover: "#90cdf4",
    secondary: "#2d3748",
    secondaryHover: "#4a5568",
    success: "#68d391",
    text: "#e2e8f0",
  },
  focusStyle: {
    boxShadow: "0 0 0 3px rgba(99, 179, 237, 0.4)",
  },
  fontSizes: {
    large: "1rem",
    medium: "0.875rem",
    small: "0.75rem",
  },
  labelStyle: {
    color: "#cbd5e0",
  },
  spacing: {
    large: "16px",
    medium: "8px",
    small: "4px",
  },
};

/**
 * Plumecare Dashboard theme — matches the Plumecare Dashboard styling
 */
export const plumecareTheme: PronounTheme = {
  badgeStyle: {
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: 500,
    padding: "4px 12px",
  },
  borderRadius: "6px",
  buttonStyle: {
    borderRadius: "6px",
    fontSize: "0.875rem",
    fontWeight: 500,
    padding: "8px 16px",
  },
  colors: {
    background: "#ffffff",
    badgeBackground: "#F0E8F7", // plume-plum-50
    badgeText: "#6816AF", // plume-plum
    border: "#495155", // plume-gray-800 (used as border in dashboard)
    disabled: "#8A9399", // plume-gray-500
    error: "#A20D19", // error
    focus: "#A57CE4", // plume-lilac
    focusRing: "rgba(165, 124, 228, 0.4)", // lilac at 40%
    helperText: "#8A9399", // plume-gray-500
    label: "#5C6670", // neutral-70
    placeholder: "#8A9399",
    primary: "#6816AF", // plume-plum
    primaryHover: "#772DB7", // plume-plum-800
    secondary: "#F0E8F7", // plume-plum-50
    secondaryHover: "#E2D1EF", // plume-plum-100
    text: "#343D42", // plume-gray
  },
  focusStyle: {
    outline: "2px solid #A57CE4",
    outlineOffset: "2px",
  },
  fontFamily: "'Fibra One', system-ui, -apple-system, sans-serif",
  fontSizes: {
    large: "1rem",
    medium: "0.875rem",
    small: "0.75rem",
  },
  inputHeight: "48px",
  labelStyle: {
    color: "#5C6670",
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: "6px",
  },
  spacing: {
    large: "18px",
    medium: "12px",
    small: "6px",
  },
};

/**
 * Member Dashboard theme — matches the Member Dashboard styling
 */
export const memberDashboardTheme: PronounTheme = {
  badgeStyle: {
    borderRadius: "9999px",
    fontSize: "0.875rem",
    fontWeight: 500,
    padding: "2px 10px",
  },
  borderRadius: "4px",
  buttonStyle: {
    borderRadius: "4px",
    fontWeight: 500,
    padding: "8px 16px",
  },
  colors: {
    background: "#ffffff",
    badgeBackground: "#F0E8F7",
    badgeText: "#6816AF",
    border: "#D1D5DB", // gray-300
    disabled: "#9CA3AF", // gray-400
    error: "#A20D19",
    focus: "#6816AF", // plume-plum (ring color)
    focusRing: "rgba(104, 22, 175, 0.3)",
    helperText: "#6B7280", // gray-500
    label: "#374151", // gray-700
    placeholder: "#9CA3AF",
    primary: "#6816AF", // plume-plum
    primaryHover: "#3A0469", // plume-violet
    secondary: "#F2F2F3", // plume-gray-50
    secondaryHover: "#E5E5E7", // plume-gray-100
    text: "#343D42", // plume-gray
  },
  focusStyle: {
    boxShadow: "0 0 0 2px rgba(104, 22, 175, 0.5)",
  },
  fontFamily: "'Fibra One', system-ui, -apple-system, sans-serif",
  fontSizes: {
    large: "1rem",
    medium: "0.875rem",
    small: "0.75rem",
  },
  labelStyle: {
    color: "#374151",
    fontSize: "0.875rem",
    fontWeight: 500,
    marginBottom: "4px",
  },
  spacing: {
    large: "16px",
    medium: "8px",
    small: "4px",
  },
};

/**
 * Function to merge a custom theme with the default theme.
 * Performs deep merging of nested objects (colors, fontSizes, spacing,
 * focusStyle, labelStyle, buttonStyle, badgeStyle).
 */
export function mergeTheme(customTheme: Partial<PronounTheme>): PronounTheme {
  return {
    badgeStyle:
      customTheme.badgeStyle || defaultTheme.badgeStyle
        ? {
            ...defaultTheme.badgeStyle,
            ...customTheme.badgeStyle,
          }
        : undefined,
    borderRadius: customTheme.borderRadius ?? defaultTheme.borderRadius,
    buttonStyle:
      customTheme.buttonStyle || defaultTheme.buttonStyle
        ? {
            ...defaultTheme.buttonStyle,
            ...customTheme.buttonStyle,
          }
        : undefined,
    colors: {
      ...defaultTheme.colors,
      ...customTheme.colors,
    },
    focusStyle:
      customTheme.focusStyle || defaultTheme.focusStyle
        ? {
            ...defaultTheme.focusStyle,
            ...customTheme.focusStyle,
          }
        : undefined,
    fontFamily: customTheme.fontFamily ?? defaultTheme.fontFamily,
    fontSizes: {
      ...defaultTheme.fontSizes,
      ...customTheme.fontSizes,
    },
    // New optional properties — deep merge nested objects, pass through scalars
    inputHeight: customTheme.inputHeight ?? defaultTheme.inputHeight,
    labelStyle:
      customTheme.labelStyle || defaultTheme.labelStyle
        ? {
            ...defaultTheme.labelStyle,
            ...customTheme.labelStyle,
          }
        : undefined,
    spacing: {
      ...defaultTheme.spacing,
      ...customTheme.spacing,
    },
  };
}
