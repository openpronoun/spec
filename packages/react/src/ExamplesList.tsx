import clsx from "clsx";
import React, { useId } from "react";

import type { ExamplesListClassNames } from "./classNames";

/**
 * Props for the ExamplesList component
 */
export interface ExamplesListProps {
  /**
   * Custom CSS class names for sub-elements
   */
  classNames?: ExamplesListClassNames;

  /**
   * Array of example sentences to display
   */
  examples: string[];
}

/**
 * Component for displaying example sentences for a pronoun set
 */
export const ExamplesList: React.FC<ExamplesListProps> = ({
  classNames,
  examples,
}) => {
  const headingId = useId();

  // If there are no examples, don't render anything
  if (!examples.length) {
    return null;
  }

  return (
    <div className={clsx("pronoun-detail-editor-examples", classNames?.root)}>
      <h4
        className={clsx(
          "pronoun-detail-editor-examples-heading",
          classNames?.heading,
        )}
        id={headingId}
      >
        Example Sentences
      </h4>
      <ul
        aria-labelledby={headingId}
        className={clsx(
          "pronoun-detail-editor-examples-list",
          classNames?.list,
        )}
      >
        {examples.map((example, index) => (
          <li
            className={clsx(
              "pronoun-detail-editor-examples-item",
              classNames?.item,
            )}
            key={index}
          >
            {example}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ExamplesList;
