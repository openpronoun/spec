"use client";

import clsx from "clsx";
import React, { useId, useMemo, useState } from "react";

import type { PronounDisplayClassNames } from "./classNames";
import { OriginalTextBadge } from "./OriginalTextBadge";
import { PronounBadge } from "./PronounBadge";
import {
  createExampleSentences,
  formatPronounSet,
  getObjective,
  getPossessivePronoun,
  getSubjective,
  isStandardSet,
  PronounType,
} from "./pronounUtils";
import type { PronounEntry, PronounSet } from "./pronounUtils";
import { defaultTheme, mergeIcons, mergeTheme } from "./theme";
import type { PronounIconConfig, PronounTheme } from "./theme";

/**
 * Props for the PronounDisplay component
 */
export interface PronounDisplayProps {
  /** Accessible label */
  "aria-label"?: string;
  /** HTML element to render as */
  as?: React.ElementType;
  /** Optional CSS class name */
  className?: string;
  /** Optional class names for internal elements */
  classNames?: PronounDisplayClassNames;
  /** Display mode: 'text' renders inline text, 'badges' renders PronounBadge pills */
  displayMode?: "badges" | "text";
  /** Display format: 'short', 'medium', or 'long' */
  format?: "long" | "medium" | "short";
  /** Optional icon overrides */
  icons?: Partial<PronounIconConfig>;
  /** The original freetext input, preserved for display */
  originalText?: string;
  /** Array of pronoun entries to display */
  pronouns: PronounEntry[];
  /** Separator between pronoun sets */
  separator?: string;
  /** Show example sentences on hover/expand */
  showExamples?: boolean;
  /** Optional theme override */
  theme?: Partial<PronounTheme>;
  /**
   * When true (default), hides entries with privacy ≥ 1 (spec F4).
   * Set to false only in authenticated/private contexts where you know the
   * viewer has permission to see restricted pronoun sets.
   */
  publicOnly?: boolean;
}

/**
 * Returns a comma-separated accessible label for a single entry.
 * Standard sets use "she, her, hers" (no slashes) per UX guidance for screen readers.
 */
function formatEntryAccessible(entry: PronounEntry): string {
  if ("type" in entry) return formatEntryText(entry, "short");
  const set = entry as PronounSet;
  const sub = getSubjective(set);
  const obj = getObjective(set);
  const poss = getPossessivePronoun(set);
  return [sub, obj, poss].filter(Boolean).join(", ");
}

/** Returns the display string for a single entry, per spec F1/F2. */
function formatEntryText(
  entry: PronounEntry,
  fmt: "long" | "medium" | "short",
): string {
  if ("type" in entry) {
    const t = entry.type;
    if (t === PronounType.ANY) return "Any pronouns";
    if (t === PronounType.NONE) return "No pronouns (use name)"; // spec F2
    if (t === PronounType.ASK) return "Ask me";
    if (t === PronounType.UNSPECIFIED) return "Unspecified"; // spec F2
    if (t === PronounType.CUSTOM)
      return (entry as { type: "custom"; display: string }).display;
  }
  return formatPronounSet(entry, { format: fmt, includeContext: true });
}

/**
 * PronounDisplay — renders a list of pronoun entries in text or badge mode.
 *
 * Spec compliance:
 * - F2a: excluded entries (exclude: true) are omitted from the short display.
 * - F4: entries with privacy ≥ 1 are omitted (treated as non-public context
 *   by default; pass a filtered list for finer control).
 * - F1/F2: special preferences render as their canonical phrases.
 */
export const PronounDisplay: React.FC<PronounDisplayProps> = ({
  "aria-label": ariaLabel,
  as: Component = "span",
  className,
  classNames,
  displayMode = "text",
  format = "short",
  icons,
  originalText,
  pronouns,
  publicOnly = true,
  separator = ", ",
  showExamples = false,
  theme,
}) => {
  const [expandedIndex, setExpandedIndex] = useState<null | number>(null);
  const [showOriginalText, setShowOriginalText] = useState(false);
  const mergedTheme = theme ? mergeTheme(theme) : defaultTheme;
  const uid = useId();
  const resolvedIcons = mergeIcons(icons);

  // F2a: omit excluded entries; F4: omit privacy≥1 entries in public context
  const displayable = useMemo(
    () =>
      pronouns.filter((e) => {
        if ("exclude" in e && e.exclude) return false;
        if ("exc" in e && (e as { exc?: boolean }).exc) return false;
        if (publicOnly) {
          const priv =
            ("privacy" in e ? (e as { privacy?: number }).privacy : undefined) ??
            ("pvc" in e ? (e as { pvc?: number }).pvc : undefined) ??
            0;
          if (priv > 0) return false;
        }
        return true;
      }),
    [pronouns, publicOnly],
  );

  const formattedTexts = useMemo(
    () => displayable.map((e) => formatEntryText(e, format)),
    [displayable, format],
  );

  // Comma-separated for screen readers — avoids "slash" being read aloud (UX guidance)
  const fullDescription = useMemo(
    () => displayable.map(formatEntryAccessible).join(", "),
    [displayable],
  );

  const displayText = formattedTexts.join(separator);

  if (displayable.length === 0) {
    return null;
  }

  // Badge display mode
  if (displayMode === "badges") {
    const badgeFormat =
      format === "long" ? "medium" : (format as "medium" | "short");
    return (
      <Component
        aria-label={ariaLabel || fullDescription}
        className={clsx(
          "pronoun-display",
          "pronoun-display--badges",
          className,
          classNames?.root,
        )}
        style={{
          alignItems: "center",
          display: "inline-flex",
          flexWrap: "wrap" as const,
          gap: mergedTheme.spacing.small,
          ...(mergedTheme.fontFamily
            ? { fontFamily: mergedTheme.fontFamily }
            : {}),
        }}
      >
        {displayable.map((entry, index) => (
          <PronounBadge
            classNames={classNames?.badge}
            format={badgeFormat}
            icons={icons}
            key={index}
            pronoun={entry}
            theme={theme}
          />
        ))}
        {originalText && (
          <OriginalTextBadge
            classNames={classNames?.originalTextBadge}
            icons={icons}
            originalText={originalText}
            theme={theme}
          />
        )}
      </Component>
    );
  }

  const baseTextStyle: React.CSSProperties = {
    color: mergedTheme.colors.text,
    fontSize: mergedTheme.fontSizes.medium,
    ...(mergedTheme.fontFamily ? { fontFamily: mergedTheme.fontFamily } : {}),
  };

  const originalTextInfoIcon = originalText ? (
    <span
      style={{
        display: "inline-block",
        marginLeft: "4px",
        position: "relative" as const,
      }}
    >
      <button
        aria-controls={`${uid}-orig-text`}
        aria-expanded={showOriginalText}
        aria-label={showOriginalText ? "Hide original text" : "Show original text"}
        className={clsx(
          "pronoun-display-original-text-icon",
          classNames?.originalTextIcon,
        )}
        onClick={() => setShowOriginalText((prev) => !prev)}
        style={{
          alignItems: "center",
          background: "none",
          border: "none",
          color: mergedTheme.colors.primary,
          cursor: "pointer",
          display: "inline-flex",
          fontSize: mergedTheme.fontSizes.small,
          justifyContent: "center",
          padding: "0 2px",
        }}
        type="button"
      >
        {resolvedIcons.info ?? (
          <svg
            fill="none"
            height="14"
            style={{ display: "inline-block", verticalAlign: "middle" }}
            viewBox="0 0 16 16"
            width="14"
            xmlns="http://www.w3.org/2000/svg"
          >
            <circle
              cx="8"
              cy="8"
              fill="none"
              r="7"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <text
              fill="currentColor"
              fontFamily="sans-serif"
              fontSize="10"
              fontWeight="bold"
              textAnchor="middle"
              x="8"
              y="11.5"
            >
              i
            </text>
          </svg>
        )}
      </button>
      {showOriginalText && (
        <span
          className={clsx(
            "pronoun-display-original-text-popover",
            classNames?.originalTextPopover,
          )}
          id={`${uid}-orig-text`}
          style={{
            backgroundColor: mergedTheme.colors.background,
            border: `1px solid ${mergedTheme.colors.border}`,
            borderRadius: mergedTheme.borderRadius,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            display: "block",
            fontSize: mergedTheme.fontSizes.small,
            left: 0,
            marginTop: mergedTheme.spacing.small,
            padding: mergedTheme.spacing.medium,
            position: "absolute" as const,
            top: "100%",
            whiteSpace: "nowrap" as const,
            zIndex: 10,
            ...(mergedTheme.fontFamily
              ? { fontFamily: mergedTheme.fontFamily }
              : {}),
          }}
        >
          <span style={{ fontWeight: 600 }}>Original text: </span>
          <span style={{ fontStyle: "italic" }}>{originalText}</span>
        </span>
      )}
    </span>
  ) : null;

  if (!showExamples) {
    return (
      <Component
        aria-label={ariaLabel || fullDescription}
        className={clsx("pronoun-display", className, classNames?.root)}
        style={baseTextStyle}
      >
        {displayText}
        {originalTextInfoIcon}
      </Component>
    );
  }

  return (
    <Component
      aria-label={ariaLabel || fullDescription}
      className={clsx("pronoun-display", className, classNames?.root)}
      style={{
        ...baseTextStyle,
        position: "relative" as const,
      }}
    >
      {displayable.map((entry, index) => {
        // Only standard sets with all forms can generate examples
        const examples = isStandardSet(entry)
          ? createExampleSentences(entry)
          : [];
        const isExpanded = expandedIndex === index;

        return (
          <span
            className={clsx(
              "pronoun-display-pronoun",
              classNames?.pronounWrapper,
            )}
            key={index}
            style={{ position: "relative" as const }}
          >
            {index > 0 && separator}
            <span
              aria-controls={examples.length > 0 ? `${uid}-ex-${index}` : undefined}
              aria-expanded={examples.length > 0 ? isExpanded : undefined}
              aria-label={examples.length > 0 ? `${formattedTexts[index]}, show examples` : undefined}
              className={clsx("pronoun-display-text", classNames?.pronounText)}
              onClick={() => examples.length > 0 && setExpandedIndex(isExpanded ? null : index)}
              onKeyDown={(e) => {
                if (e.key === "Enter" || e.key === " ") {
                  e.preventDefault();
                  if (examples.length > 0) setExpandedIndex(isExpanded ? null : index);
                }
              }}
              role={examples.length > 0 ? "button" : undefined}
              style={{
                cursor: examples.length > 0 ? "pointer" : "default",
                textDecoration:
                  examples.length > 0 ? "underline dotted" : "none",
                textUnderlineOffset: "3px",
              }}
              tabIndex={examples.length > 0 ? 0 : undefined}
            >
              {formattedTexts[index]}
            </span>
            {isExpanded && examples.length > 0 && (
              <span
                className={clsx("pronoun-display-tooltip", classNames?.tooltip)}
                id={`${uid}-ex-${index}`}
                style={{
                  backgroundColor: mergedTheme.colors.background,
                  border: `1px solid ${mergedTheme.colors.border}`,
                  borderRadius: mergedTheme.borderRadius,
                  boxShadow:
                    "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
                  display: "block",
                  fontSize: mergedTheme.fontSizes.small,
                  left: 0,
                  marginTop: mergedTheme.spacing.small,
                  padding: mergedTheme.spacing.medium,
                  position: "absolute" as const,
                  top: "100%",
                  whiteSpace: "nowrap" as const,
                  zIndex: 10,
                  ...(mergedTheme.fontFamily
                    ? { fontFamily: mergedTheme.fontFamily }
                    : {}),
                }}
              >
                {examples.map((example, i) => (
                  <span
                    className={clsx(
                      "pronoun-display-tooltip-example",
                      classNames?.tooltipExample,
                    )}
                    key={i}
                    style={{
                      color: mergedTheme.colors.text,
                      display: "block",
                      opacity: 0.8,
                      padding: `${mergedTheme.spacing.small} 0`,
                    }}
                  >
                    {example}
                  </span>
                ))}
              </span>
            )}
          </span>
        );
      })}
      {originalTextInfoIcon}
    </Component>
  );
};

export default PronounDisplay;
