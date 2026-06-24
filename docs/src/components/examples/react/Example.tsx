/**
 * PLACEHOLDER — example content owned by the maintainer.
 * This proves the React integration builds and hydrates.
 */
import { useState } from "react";
import { placeholder } from "@openpronoun/core";
import { Pronoun } from "@openpronoun/react";

export default function Example() {
  const [value] = useState(() => placeholder());

  return (
    <div style={{ padding: "1rem", border: "1px solid #444", borderRadius: "8px" }}>
      <p>
        <strong>React</strong> — via <code>@openpronoun/react</code>:
      </p>
      <p>
        Component: <Pronoun />
      </p>
      <p>
        Direct: <code>{value}</code>
      </p>
    </div>
  );
}
