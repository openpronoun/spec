import clsx from "clsx";
import React from "react";
import type { MenuProps, OptionProps } from "react-select";

import type { PronounSelectorClassNames } from "./classNames";
import PronounDetailEditor from "./PronounDetailEditor";
import type { PronounSet } from "./pronounUtils";
import type { PronounTheme } from "./theme";
import type { PronounOption } from "./types";

/**
 * Extended select props passed via react-select's custom props mechanism.
 */
interface BadgeSelectProps {
  badgeClassNames?: PronounSelectorClassNames;
  badgeTheme?: PronounTheme;
}

/**
 * BadgeMenu — custom Menu that renders options as badge pills.
 */
export const BadgeMenu: React.FC<
  { editorOverlay?: React.ReactNode } & MenuProps<PronounOption, true>
> = (props) => {
  const { children, editorOverlay, innerProps, innerRef, selectProps } = props;

  const customProps = selectProps as unknown as BadgeSelectProps &
    typeof selectProps;
  const theme = customProps.badgeTheme;
  const classNames = customProps.badgeClassNames;

  const isEditorActive = !!editorOverlay;

  const menuStyle: React.CSSProperties = {
    backgroundColor: theme?.colors?.background ?? "#ffffff",
    border: `1px solid ${theme?.colors?.border ?? "#e2e8f0"}`,
    borderRadius: theme?.borderRadius ?? "4px",
    boxShadow: "0 4px 11px rgba(0,0,0,0.1)",
    display: "flex",
    flexWrap: "wrap" as const,
    gap: "8px",
    left: 0,
    marginTop: "4px",
    minHeight: isEditorActive ? "350px" : undefined,
    padding: "8px 10px",
    position: "absolute" as const,
    right: 0,
    top: "100%",
    zIndex: 2,
  };

  return (
    <div
      ref={innerRef}
      {...innerProps}
      className={clsx("pronoun-badge-menu", classNames?.badgeMenu)}
      style={menuStyle}
    >
      {!isEditorActive && children}
      {editorOverlay}
    </div>
  );
};

/**
 * BadgeOption — custom Option rendered as a pill/badge button.
 */
export const BadgeOption: React.FC<OptionProps<PronounOption, true>> = (
  props,
) => {
  const { data, innerProps, innerRef, isSelected, selectProps } = props;

  const customProps = selectProps as unknown as BadgeSelectProps &
    typeof selectProps;
  const theme = customProps.badgeTheme;
  const classNames = customProps.badgeClassNames;

  const isCustomCreate = data.isCreate ?? false;

  const badgeBorderRadius = theme?.badgeStyle?.borderRadius ?? "9999px";
  const baseStyle: React.CSSProperties = {
    alignItems: "center",
    backgroundColor: theme?.colors?.secondary ?? "#e2e8f0",
    border: "1px solid",
    borderColor: theme?.colors?.border ?? "#e2e8f0",
    borderRadius: badgeBorderRadius,
    color: theme?.colors?.text ?? "#2d3748",
    cursor: "pointer",
    display: "inline-flex",
    fontSize: theme?.fontSizes?.small ?? "0.75rem",
    fontWeight: 500,
    gap: "6px",
    margin: "2px",
    padding: "4px 10px",
    transition: "background-color 0.15s ease, border-color 0.15s ease, color 0.15s ease",
  };

  const selectedStyle: React.CSSProperties = isSelected
    ? {
        backgroundColor: theme?.colors?.primary ?? "#4299e1",
        borderColor: theme?.colors?.primary ?? "#4299e1",
        color: theme?.colors?.background ?? "#ffffff",
      }
    : {};

  const customStyle: React.CSSProperties = isCustomCreate
    ? {
        backgroundColor: "transparent",
        borderColor: theme?.colors?.primary ?? "#4299e1",
        borderStyle: "dashed",
        color: theme?.colors?.primary ?? "#4299e1",
      }
    : {};

  const pillClassName = clsx(
    "pronoun-badge-pill",
    classNames?.badgePill,
    isSelected &&
      clsx("pronoun-badge-pill--selected", classNames?.badgePillSelected),
    isCustomCreate &&
      clsx("pronoun-badge-pill--custom", classNames?.badgePillCustom),
  );

  const buttonRef = innerRef as unknown as React.Ref<HTMLButtonElement>;
  const { onClick, onMouseMove, onMouseOver, ...restInnerProps } = innerProps;

  return (
    <button
      aria-label={isCustomCreate ? "Create custom pronoun set" : `${isSelected ? "Remove" : "Add"} ${data.label}`}
      aria-pressed={isSelected}
      className={pillClassName}
      onClick={onClick as unknown as React.MouseEventHandler<HTMLButtonElement>}
      onMouseMove={
        onMouseMove as unknown as React.MouseEventHandler<HTMLButtonElement>
      }
      onMouseOver={
        onMouseOver as unknown as React.MouseEventHandler<HTMLButtonElement>
      }
      ref={buttonRef}
      {...(restInnerProps as React.HTMLAttributes<HTMLButtonElement>)}
      style={{ ...baseStyle, ...selectedStyle, ...customStyle }}
      type="button"
    >
      {isSelected && (
        <span
          className={clsx("pronoun-badge-check", classNames?.badgeCheckIcon)}
        >
          ✓
        </span>
      )}
      {isCustomCreate && <span>+</span>}
      {isCustomCreate ? "Custom" : data.label}
    </button>
  );
};

/**
 * BadgeGroupHeading — suppresses group headings in badges mode.
 */
export const BadgeGroupHeading: React.FC = () => null;

/**
 * Creates a wrapper Menu component for badges mode with an optional
 * PronounDetailEditor overlay when editing.
 */
export const createBadgeMenuWithEditor = (
  editingPronounSet: PronounSet | null,
  handleCancelEdit: () => void,
  handleSavePronounSet: (set: PronounSet) => void,
  classNames?: PronounSelectorClassNames,
  icons?: import("./theme").PronounIconConfig,
  theme?: Partial<PronounTheme>,
): React.FC<MenuProps<PronounOption, true>> => {
  const BadgeMenuWithEditor: React.FC<MenuProps<PronounOption, true>> = (
    props,
  ) => {
    const editorOverlay = editingPronounSet ? (
      <div
        className={clsx(
          "pronoun-detail-editor-container",
          classNames?.editorContainer,
        )}
        onClick={(e) => e.stopPropagation()}
        onMouseDown={(e) => e.stopPropagation()}
      >
        <PronounDetailEditor
          classNames={classNames?.editor}
          icons={icons}
          onCancel={handleCancelEdit}
          onSave={handleSavePronounSet}
          pronounSet={editingPronounSet}
          theme={theme}
        />
      </div>
    ) : undefined;

    return (
      <div
        onClick={(e) => editingPronounSet && e.stopPropagation()}
        onMouseDown={(e) => editingPronounSet && e.stopPropagation()}
      >
        <BadgeMenu {...props} editorOverlay={editorOverlay} />
      </div>
    );
  };

  BadgeMenuWithEditor.displayName = "BadgeMenuWithEditor";
  return BadgeMenuWithEditor;
};
