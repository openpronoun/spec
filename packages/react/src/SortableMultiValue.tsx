import { useSortable } from "@dnd-kit/sortable";
import clsx from "clsx";
import React from "react";
import { components } from "react-select";
import type { GroupBase, MultiValueProps } from "react-select";

import type { SortableMultiValueClassNames } from "./classNames";
import type { PronounOption } from "./types";

/**
 * A sortable wrapper for the MultiValue component from react-select
 * Enables drag-and-drop functionality for pronoun tags
 */
export const SortableMultiValue = (
  props: MultiValueProps<PronounOption, true, GroupBase<PronounOption>>,
) => {
  const {
    attributes,
    isDragging,
    listeners,
    setNodeRef,
    transform,
    transition,
  } = useSortable({
    data: props.data,
    id: props.data.id || "",
  });

  const sortableClassNames = (
    props.selectProps as {
      sortableValueClassNames?: SortableMultiValueClassNames;
    }
  ).sortableValueClassNames;

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
        sortableClassNames?.root,
      )}
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
    >
      <components.MultiValue {...props} />
    </div>
  );
};

export default SortableMultiValue;
