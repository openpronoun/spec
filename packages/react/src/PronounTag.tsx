import clsx from "clsx";
import React from "react";

import type { PronounTagClassNames } from "./classNames";
import { isStandardSet } from "./pronounUtils";
import type { PronounSet } from "./pronounUtils";
import { defaultIcons } from "./theme";
import type { PronounIconConfig } from "./theme";
import type { PronounOption } from "./types";

export interface PronounTagProps {
  classNames?: PronounTagClassNames;
  icons?: PronounIconConfig;
  id: string;
  onEdit?: (pronounSet: PronounSet) => void;
  onRemove?: (id: string) => void;
  option: PronounOption;
}

export const PronounTag: React.FC<PronounTagProps> = ({
  classNames,
  icons = defaultIcons,
  id,
  onEdit,
  onRemove,
  option,
}) => {
  const entry = option.value;
  const label = option.label;

  const handleEditClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (isStandardSet(entry)) onEdit?.(entry as PronounSet);
  };

  const handleEditKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      e.stopPropagation();
      if (isStandardSet(entry)) onEdit?.(entry as PronounSet);
    }
  };

  const handleRemoveClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    onRemove?.(id);
  };

  return (
    <div
      className={clsx("pronoun-tag-container", classNames?.container)}
      data-id={id}
    >
      <span className={clsx("pronoun-tag-label", classNames?.label)}>
        <span
          aria-hidden="true"
          className={clsx("pronoun-drag-handle", classNames?.dragHandle)}
        >
          {icons.dragHandle}
        </span>
        {label}
      </span>

      {isStandardSet(entry) && onEdit ? (
        <div className={clsx("pronoun-tag-actions", classNames?.actions)}>
          <button
            aria-label={`Edit ${label} pronoun set`}
            className={clsx("pronoun-tag-edit", classNames?.editButton)}
            onClick={handleEditClick}
            onKeyDown={handleEditKeyDown}
            tabIndex={0}
            type="button"
          >
            <span aria-hidden="true">{icons.edit}</span>
          </button>
          <button
            aria-label={`Remove ${label}`}
            className={clsx("pronoun-tag-remove", classNames?.removeButton)}
            onClick={handleRemoveClick}
            type="button"
          >
            <span aria-hidden="true">{icons.remove}</span>
          </button>
        </div>
      ) : (
        <button
          aria-label={`Remove ${label}`}
          className={clsx("pronoun-tag-remove", classNames?.removeButton)}
          onClick={handleRemoveClick}
          type="button"
        >
          <span aria-hidden="true">{icons.remove}</span>
        </button>
      )}
    </div>
  );
};

export default PronounTag;
