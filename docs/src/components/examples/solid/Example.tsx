/**
 * PLACEHOLDER — example content owned by the maintainer.
 * This proves the Solid integration builds and hydrates.
 */
import { placeholder } from "@openpronoun/core";

export default function Example() {
  const value = placeholder();

  return (
    <div style={{ padding: "1rem", border: "1px solid #444", borderRadius: "8px" }}>
      <p>
        <strong>Solid</strong> — via <code>@openpronoun/core</code>:
      </p>
      <p>
        Result: <code>{value}</code>
      </p>
    </div>
  );
}
