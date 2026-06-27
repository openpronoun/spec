import clsx from "clsx";
import React from "react";

import type { EditorFooterClassNames } from "./classNames";
import { getSubjective, getObjective } from "./pronounUtils";
import type { PronounSet } from "./pronounUtils";

/**
 * Props for the EditorFooter component
 */
export interface EditorFooterProps {
  /** Custom CSS class names for sub-elements */
  classNames?: EditorFooterClassNames;
  /** Callback when the cancel button is clicked */
  onCancel: () => void;
  /** Callback when the save button is clicked */
  onSave: () => void;
  /** The current pronoun set being edited */
  pronounSet: PronounSet;
}

/**
 * Footer component for the PronounDetailEditor with Save and Cancel buttons
 */
export const EditorFooter: React.FC<EditorFooterProps> = ({
  classNames,
  onCancel,
  onSave,
  pronounSet,
}) => {
  const handleSaveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onSave();
  };

  const handleCancelClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onCancel();
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
  };

  // Disable save until at minimum the subjective and objective are filled
  const isSaveDisabled =
    !getSubjective(pronounSet) || !getObjective(pronounSet);

  return (
    <div className={clsx("pronoun-detail-editor-footer", classNames?.root)}>
      <button
        aria-label="Cancel editing"
        className={clsx(
          "pronoun-detail-editor-cancel",
          classNames?.cancelButton,
        )}
        onClick={handleCancelClick}
        onKeyDown={handleKeyDown}
        type="button"
      >
        Cancel
      </button>
      <button
        aria-label="Save pronoun set"
        className={clsx("pronoun-detail-editor-save", classNames?.saveButton)}
        disabled={isSaveDisabled}
        onClick={handleSaveClick}
        onKeyDown={handleKeyDown}
        type="button"
      >
        Save
      </button>
    </div>
  );
};

export default EditorFooter;
