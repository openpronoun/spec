import clsx from "clsx";
import React from "react";
import type { ReactNode } from "react";
import type { GroupBase } from "react-select";

import type { PronounOptionFormatterClassNames } from "./classNames";
import { isStandardSet } from "./pronounUtils";
import type { PronounIconConfig } from "./theme";
import type { PronounOption } from "./types";

/**
 * Format the option label in the dropdown
 */
export const formatOptionLabel = (
  option: PronounOption,
  { context }: { context: "menu" | "value" },
  icons: PronounIconConfig,
  classNames?: PronounOptionFormatterClassNames,
  compact?: boolean,
): ReactNode => {
  const entry = option.value;

  // "Create custom pronoun set" sentinel — identified by isCreate flag
  if (option.isCreate) {
    return (
      <div className={clsx("pronoun-create-custom", classNames?.createCustom)}>
        <span
          className={clsx(
            "pronoun-create-custom-icon",
            classNames?.createCustomIcon,
          )}
        >
          {icons.create} {option.label}
        </span>
      </div>
    );
  }

  // Standard sets in expanded mode show example sentences in the menu
  if (
    isStandardSet(entry) &&
    option.examples &&
    context === "menu" &&
    !compact
  ) {
    return (
      <div
        className={clsx(
          "pronoun-option-with-examples",
          classNames?.optionWithExamples,
        )}
      >
        <div className={clsx("pronoun-option-label", classNames?.optionLabel)}>
          {option.label}
        </div>
        <div className={clsx("pronoun-examples", classNames?.examples)}>
          {option.examples.join(" · ")}
        </div>
      </div>
    );
  }

  return option.label;
};

/**
 * Format the group label in the dropdown
 */
export const formatGroupLabel = (
  data: GroupBase<PronounOption>,
  classNames?: PronounOptionFormatterClassNames,
): ReactNode => (
  <div className={clsx("pronoun-group-label", classNames?.groupLabel)}>
    <span
      className={clsx("pronoun-group-label-text", classNames?.groupLabelText)}
    >
      {data.label}
    </span>
    <span className={clsx("pronoun-group-count", classNames?.groupCount)}>
      {data.options.length}
    </span>
  </div>
);

export default {
  formatGroupLabel,
  formatOptionLabel,
};
