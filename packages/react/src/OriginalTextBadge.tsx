"use client";

import clsx from "clsx";
import React, { useId, useState } from "react";

import type { OriginalTextBadgeClassNames } from "./classNames";
import { defaultTheme, mergeIcons, mergeTheme } from "./theme";
import type { PronounIconConfig, PronounTheme } from "./theme";

/**
 * Props for the OriginalTextBadge component
 */
export interface OriginalTextBadgeProps {
  /** Optional CSS class name */
  className?: string;
  /** Optional class names for internal elements */
  classNames?: OriginalTextBadgeClassNames;
  /** Optional icon overrides */
  icons?: Partial<PronounIconConfig>;
  /** The original freetext input to display */
  originalText: string;
  /** Optional theme override */
  theme?: Partial<PronounTheme>;
}

/**
 * OriginalTextBadge component — a standalone info icon that shows the original
 * freetext pronoun input in a popover. Designed to be rendered alongside a list
 * of PronounBadge components.
 */
export const OriginalTextBadge: React.FC<OriginalTextBadgeProps> = ({
  className,
  classNames,
  icons,
  originalText,
  theme,
}) => {
  const [showOriginalText, setShowOriginalText] = useState(false);
  const mergedTheme = theme ? mergeTheme(theme) : defaultTheme;
  const resolvedIcons = mergeIcons(icons);
  const popoverId = useId();

  return (
    <span
      className={clsx("original-text-badge", className, classNames?.root)}
      style={{ display: "inline-block", position: "relative" as const }}
    >
      <button
        aria-controls={popoverId}
        aria-expanded={showOriginalText}
        aria-label={showOriginalText ? "Hide original text" : "Show original text"}
        className={clsx("original-text-badge-icon", classNames?.icon)}
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
          className={clsx("original-text-badge-popover", classNames?.popover)}
          id={popoverId}
          style={{
            backgroundColor: mergedTheme.colors.background,
            border: `1px solid ${mergedTheme.colors.border}`,
            borderRadius: mergedTheme.borderRadius,
            boxShadow:
              "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
            color: mergedTheme.colors.text,
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
  );
};

export default OriginalTextBadge;
