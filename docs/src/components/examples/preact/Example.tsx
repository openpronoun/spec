/**
 * PLACEHOLDER — example content owned by the maintainer.
 * This proves the Preact integration builds and hydrates.
 */
import { useState } from "preact/hooks";
import { placeholder } from "@openpronoun/core";

export default function Example() {
  const [value] = useState(() => placeholder());

  return (
    <div style={{ padding: "1rem", border: "1px solid #444", borderRadius: "8px" }}>
      <p>
        <strong>Preact</strong> — via <code>@openpronoun/core</code>:
      </p>
      <p>
        Result: <code>{value}</code>
      </p>
    </div>
  );
}
