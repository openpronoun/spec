"use client";

import clsx from "clsx";
import React from "react";

import type { PronounBadgeClassNames } from "./classNames";
import {
  formatPronounSet,
  getObjective,
  getPossessivePronoun,
  getSubjective,
  PronounType,
} from "./pronounUtils";
import type { PronounEntry, PronounSet } from "./pronounUtils";
import { defaultTheme, mergeIcons, mergeTheme } from "./theme";
import type { PronounIconConfig, PronounTheme } from "./theme";

/**
 * Props for the PronounBadge component
 */
export interface PronounBadgeProps {
  /** Optional CSS class name */
  className?: string;
  /** Optional class names for internal elements */
  classNames?: PronounBadgeClassNames;
  /** Display format: 'short' or 'medium' */
  format?: "medium" | "short";
  /** Optional icon overrides */
  icons?: Partial<PronounIconConfig>;
  /** Click handler */
  onClick?: () => void;
  /** Remove handler */
  onRemove?: () => void;
  /** The pronoun entry to display */
  pronoun: PronounEntry;
  /** Whether the badge can be removed */
  removable?: boolean;
  /** Optional theme override */
  theme?: Partial<PronounTheme>;
}

/**
 * Comma-separated accessible label for screen readers (UX guidance).
 * Avoids slash notation that readers announce as "slash".
 */
function formatBadgeAccessible(entry: PronounEntry): string {
  if ("type" in entry) return formatBadgeText(entry, "short");
  const set = entry as PronounSet;
  const sub = getSubjective(set);
  const obj = getObjective(set);
  const poss = getPossessivePronoun(set);
  return [sub, obj, poss].filter(Boolean).join(", ");
}

/** Returns the spec-compliant display label for an entry (F1/F2). */
function formatBadgeText(entry: PronounEntry, fmt: "medium" | "short"): string {
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
 * PronounBadge — a compact badge/pill for displaying a single pronoun entry.
 */
export const PronounBadge: React.FC<PronounBadgeProps> = ({
  className,
  classNames,
  format = "short",
  icons,
  onClick,
  onRemove,
  pronoun,
  removable = false,
  theme,
}) => {
  const mergedTheme = theme ? mergeTheme(theme) : defaultTheme;
  const resolvedIcons = mergeIcons(icons);
  const displayText = formatBadgeText(pronoun, format);
  const accessibleLabel = formatBadgeAccessible(pronoun);

  const badgeStyle: React.CSSProperties = {
    alignItems: "center",
    backgroundColor:
      mergedTheme.colors.badgeBackground ?? mergedTheme.colors.secondary,
    border: "none",
    borderRadius: mergedTheme.badgeStyle?.borderRadius ?? "9999px",
    color: mergedTheme.colors.badgeText ?? mergedTheme.colors.text,
    cursor: onClick ? "pointer" : "default",
    display: "inline-flex",
    fontSize: mergedTheme.badgeStyle?.fontSize ?? mergedTheme.fontSizes.small,
    fontWeight: mergedTheme.badgeStyle?.fontWeight ?? 500,
    gap: mergedTheme.spacing.small,
    lineHeight: 1.4,
    padding:
      mergedTheme.badgeStyle?.padding ??
      `${mergedTheme.spacing.small} ${mergedTheme.spacing.medium}`,
    transition: "background-color 0.15s ease",
    ...(mergedTheme.fontFamily ? { fontFamily: mergedTheme.fontFamily } : {}),
  };

  const removeButtonStyle: React.CSSProperties = {
    alignItems: "center",
    background: "none",
    border: "none",
    borderRadius: "50%",
    color: mergedTheme.colors.badgeText ?? mergedTheme.colors.text,
    cursor: "pointer",
    display: "inline-flex",
    fontSize: mergedTheme.fontSizes.small,
    height: "16px",
    justifyContent: "center",
    lineHeight: 1,
    marginLeft: mergedTheme.spacing.small,
    opacity: 0.6,
    padding: 0,
    transition: "opacity 0.15s ease, background-color 0.15s ease",
    width: "16px",
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.();
  };

  if (onClick) {
    return (
      <button
        aria-label={accessibleLabel}
        className={clsx("pronoun-badge", className, classNames?.root)}
        onClick={onClick}
        style={badgeStyle}
        type="button"
      >
        <span className={clsx("pronoun-badge-text", classNames?.text)}>
          {displayText}
        </span>
        {removable && (
          <button
            aria-label={`Remove ${displayText}`}
            className={clsx("pronoun-badge-remove", classNames?.removeButton)}
            onClick={handleRemoveClick}
            style={removeButtonStyle}
            type="button"
          >
            {resolvedIcons.remove}
          </button>
        )}
      </button>
    );
  }

  return (
    <span
      aria-label={accessibleLabel}
      className={clsx("pronoun-badge", className, classNames?.root)}
      style={badgeStyle}
    >
      <span className={clsx("pronoun-badge-text", classNames?.text)}>
        {displayText}
      </span>
      {removable && (
        <button
          aria-label={`Remove ${displayText}`}
          className={clsx("pronoun-badge-remove", classNames?.removeButton)}
          onClick={handleRemoveClick}
          style={removeButtonStyle}
          type="button"
        >
          {resolvedIcons.remove}
        </button>
      )}
    </span>
  );
};

export default PronounBadge;
