import clsx from "clsx";
import React from "react";

import type { EditorHeaderClassNames } from "./classNames";
import type { PronounIconConfig } from "./theme";

/**
 * Props for the EditorHeader component
 */
export interface EditorHeaderProps {
  /**
   * Custom CSS class names for sub-elements
   */
  classNames?: EditorHeaderClassNames;

  /**
   * Resolved icon configuration
   */
  icons: PronounIconConfig;

  /**
   * Whether the editor is in create mode (false) or edit mode (true).
   * Kept for API compatibility; the `title` prop controls the displayed text.
   */
  isEditing?: boolean;

  /**
   * Callback when the close button is clicked
   */
  onClose: () => void;

  /**
   * The title of the editor
   */
  title: string;

  /**
   * The id to set on the title element, for aria-labelledby on the dialog.
   */
  titleId: string;
}

/**
 * Header component for the PronounDetailEditor
 */
export const EditorHeader: React.FC<EditorHeaderProps> = ({
  classNames,
  icons,
  onClose,
  title,
  titleId,
}) => {
  const handleCloseClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onClose();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  return (
    <div className={clsx("pronoun-detail-editor-header", classNames?.root)}>
      <h3
        className={clsx("pronoun-detail-editor-title", classNames?.title)}
        id={titleId}
      >
        {title}
      </h3>
      <button
        aria-label="Close editor"
        className={clsx("pronoun-detail-editor-close", classNames?.closeButton)}
        onClick={handleCloseClick}
        onKeyDown={handleKeyDown}
        type="button"
      >
        {icons.close}
      </button>
    </div>
  );
};

export default EditorHeader;
