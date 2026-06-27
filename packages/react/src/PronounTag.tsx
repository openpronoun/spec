import clsx from "clsx";
import React from "react";
import type { GroupBase, MultiValueGenericProps, MultiValueRemoveProps } from "react-select";

import type { PronounTagClassNames } from "./classNames";
import { isStandardSet } from "./pronounUtils";
import type { PronounSet } from "./pronounUtils";
import { defaultIcons } from "./theme";
import type { PronounIconConfig } from "./theme";
import type { PronounOption } from "./types";

/**
 * Props for the PronounTag components
 */
interface PronounTagProps {
  /** Callback when edit button is clicked (only for standard sets) */
  onEditPronounSet: (pronounSet: PronounSet) => void;
}

/**
 * Custom container for the multi-value component
 */
export const CustomMultiValueContainer = (
  props: MultiValueGenericProps<PronounOption, true, GroupBase<PronounOption>>,
) => {
  const data = props.data as PronounOption;
  const tagClassNames = (
    props.selectProps as { tagClassNames?: PronounTagClassNames }
  ).tagClassNames;

  return (
    <div
      {...(props.innerProps as React.HTMLAttributes<HTMLDivElement>)}
      className={clsx("pronoun-tag-container", tagClassNames?.container)}
      data-id={data.id}
    >
      {props.children}
    </div>
  );
};

/**
 * Custom label for the multi-value component
 */
export const CustomMultiValueLabel = (
  props: MultiValueGenericProps<PronounOption, true, GroupBase<PronounOption>>,
) => {
  const icons =
    (props.selectProps as { icons?: PronounIconConfig })?.icons ?? defaultIcons;
  const tagClassNames = (
    props.selectProps as { tagClassNames?: PronounTagClassNames }
  ).tagClassNames;

  return (
    <span className={clsx("pronoun-tag-label", tagClassNames?.label)}>
      <span
        aria-hidden="true"
        className={clsx("pronoun-drag-handle", tagClassNames?.dragHandle)}
      >
        {icons.dragHandle}
      </span>
      {props.children}
    </span>
  );
};

/**
 * Custom remove button for the multi-value component.
 * Adds an edit button for standard (non-special) pronoun sets.
 */
export const CustomMultiValueRemove = (
  props: MultiValueRemoveProps<PronounOption, true, GroupBase<PronounOption>> &
    PronounTagProps,
) => {
  const { data, onEditPronounSet } = props;
  const entry = data.value;
  const icons =
    (props.selectProps as { icons?: PronounIconConfig })?.icons ?? defaultIcons;
  const tagClassNames = (
    props.selectProps as { tagClassNames?: PronounTagClassNames }
  ).tagClassNames;

  // Only standard sets (no `type` field) get an edit button
  if (isStandardSet(entry)) {
    return (
      <div className={clsx("pronoun-tag-actions", tagClassNames?.actions)}>
        <button
          aria-label={`Edit ${data.label} pronoun set`}
          className={clsx("pronoun-tag-edit", tagClassNames?.editButton)}
          onClick={(e) => {
            e.stopPropagation();
            onEditPronounSet(entry);
          }}
          onKeyDown={(e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              e.stopPropagation();
              onEditPronounSet(entry);
            }
          }}
          tabIndex={0}
          type="button"
        >
          <span aria-hidden="true">{icons.edit}</span>
        </button>
        <button
          {...(props.innerProps as React.HTMLAttributes<HTMLButtonElement>)}
          aria-label={`Remove ${data.label}`}
          className={clsx("pronoun-tag-remove", tagClassNames?.removeButton)}
          type="button"
        >
          <span aria-hidden="true">{icons.remove}</span>
        </button>
      </div>
    );
  }

  return (
    <button
      {...(props.innerProps as React.HTMLAttributes<HTMLButtonElement>)}
      aria-label={`Remove ${data.label}`}
      className={clsx("pronoun-tag-remove", tagClassNames?.removeButton)}
      type="button"
    >
      <span aria-hidden="true">{icons.remove}</span>
    </button>
  );
};
