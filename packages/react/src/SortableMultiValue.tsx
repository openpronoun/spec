import { useSortable } from "@dnd-kit/sortable";
import clsx from "clsx";
import React from "react";

import type { PronounTagClassNames, SortableMultiValueClassNames } from "./classNames";
import type { PronounSet } from "./pronounUtils";
import type { PronounIconConfig } from "./theme";
import type { PronounOption } from "./types";
import { PronounTag } from "./PronounTag";

export interface SortableMultiValueProps {
  classNames?: SortableMultiValueClassNames;
  icons: PronounIconConfig;
  id: string;
  onEdit?: (pronounSet: PronounSet) => void;
  onRemove?: (id: string) => void;
  option: PronounOption;
  tagClassNames?: PronounTagClassNames;
}

export const SortableMultiValue: React.FC<SortableMultiValueProps> = ({
  classNames,
  icons,
  id,
  onEdit,
  onRemove,
  option,
  tagClassNames,
}) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    data: option,
    id,
  });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : undefined,
    transition,
    zIndex: isDragging ? 1 : 0,
  };

  return (
    <div
      className={clsx(
        "pronoun-multi-value",
        { "is-dragging": isDragging },
        classNames?.root,
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <PronounTag
        classNames={tagClassNames}
        icons={icons}
        id={id}
        onEdit={onEdit}
        onRemove={onRemove}
        option={option}
      />
    </div>
  );
};

export default SortableMultiValue;
