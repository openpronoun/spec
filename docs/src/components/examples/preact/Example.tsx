import { useState } from "preact/hooks";
import { parse, format } from "@openpronoun/core";

export default function Example() {
  const [input, setInput] = useState("she/her, they/them");
  const parsed = input ? parse(input) : null;
  const short = parsed ? format(parsed) : "";
  const expanded = parsed ? format(parsed, { form: "expanded" }) : "";

  return (
    <div style={{ padding: "1rem", border: "1px solid #e2e8f0", borderRadius: "8px", fontFamily: "system-ui, sans-serif" }}>
      <p style={{ margin: "0 0 8px", fontWeight: 600 }}>
        Preact — <code>@openpronoun/core</code>
      </p>
      <input
        onInput={(e) => setInput((e.target as HTMLInputElement).value)}
        placeholder="e.g. she/her, they/them"
        style={{ border: "1px solid #e2e8f0", borderRadius: "4px", fontSize: "14px", padding: "6px 10px", width: "100%" }}
        value={input}
      />
      {parsed && (
        <dl style={{ fontSize: "13px", margin: "10px 0 0" }}>
          <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
            <dt style={{ color: "#718096", minWidth: "80px" }}>Short</dt>
            <dd style={{ margin: 0 }}><strong>{short}</strong></dd>
          </div>
          <div style={{ display: "flex", gap: "8px", marginBottom: "4px" }}>
            <dt style={{ color: "#718096", minWidth: "80px" }}>Expanded</dt>
            <dd style={{ margin: 0 }}><strong>{expanded}</strong></dd>
          </div>
          <div style={{ display: "flex", gap: "8px" }}>
            <dt style={{ color: "#718096", minWidth: "80px" }}>Entries</dt>
            <dd style={{ margin: 0 }}>{parsed.length}</dd>
          </div>
        </dl>
      )}
      {!parsed && input && (
        <p style={{ color: "#718096", fontSize: "13px", margin: "8px 0 0" }}>No pronouns recognized.</p>
      )}
    </div>
  );
}
