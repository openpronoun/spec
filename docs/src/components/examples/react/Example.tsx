import { useState } from "react";
import {
  PronounDisplay,
  PronounSelector,
  PronounForm,
  PronounBadge,
  usePronounParser,
  COMMON_PRONOUN_SETS,
  KNOWN_NEOPRONOUN_SETS,
  SPECIAL_PRONOUN_SETS,
  darkTheme,
  type PronounEntry,
} from "@openpronoun/react";

// ---------------------------------------------------------------------------
// Shared styles
// ---------------------------------------------------------------------------

const card: React.CSSProperties = {
  background: "#f7fafc",
  border: "1px solid #e2e8f0",
  borderRadius: "8px",
  marginBottom: "16px",
  padding: "16px",
};

const label: React.CSSProperties = {
  color: "#4a5568",
  display: "block",
  fontSize: "11px",
  fontWeight: 700,
  letterSpacing: "0.08em",
  marginBottom: "8px",
  textTransform: "uppercase",
};

const row: React.CSSProperties = {
  alignItems: "center",
  display: "flex",
  flexWrap: "wrap",
  gap: "8px",
  marginBottom: "8px",
};

const pill: React.CSSProperties = {
  background: "#edf2f7",
  borderRadius: "4px",
  color: "#4a5568",
  fontSize: "11px",
  fontWeight: 600,
  padding: "2px 6px",
};

// ---------------------------------------------------------------------------
// Tabs
// ---------------------------------------------------------------------------

const TABS = ["Display", "Selection", "Form", "Parser", "Themes"] as const;
type Tab = (typeof TABS)[number];

// ---------------------------------------------------------------------------
// Main showcase component
// ---------------------------------------------------------------------------

export default function Example() {
  const [tab, setTab] = useState<Tab>("Display");
  const [selectorValue, setSelectorValue] = useState<PronounEntry[]>([
    COMMON_PRONOUN_SETS.SHE,
    COMMON_PRONOUN_SETS.THEY,
  ]);

  return (
    <div style={{ fontFamily: "system-ui, -apple-system, sans-serif", maxWidth: "600px" }}>
      {/* Tab bar */}
      <div
        style={{
          borderBottom: "1px solid #e2e8f0",
          display: "flex",
          flexWrap: "wrap",
          gap: "4px",
          marginBottom: "20px",
          paddingBottom: "8px",
        }}
      >
        {TABS.map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            style={{
              background: tab === t ? "#4299e1" : "transparent",
              border: "1px solid",
              borderColor: tab === t ? "#4299e1" : "#e2e8f0",
              borderRadius: "4px",
              color: tab === t ? "#fff" : "#4a5568",
              cursor: "pointer",
              fontSize: "13px",
              fontWeight: tab === t ? 600 : 400,
              padding: "4px 12px",
            }}
            type="button"
          >
            {t}
          </button>
        ))}
      </div>

      {tab === "Display" && <DisplayTab />}
      {tab === "Selection" && (
        <SelectionTab value={selectorValue} onChange={setSelectorValue} />
      )}
      {tab === "Form" && <FormTab />}
      {tab === "Parser" && <ParserTab />}
      {tab === "Themes" && <ThemesTab />}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Display tab — PronounDisplay + PronounBadge
// ---------------------------------------------------------------------------

function DisplayTab() {
  const she_they: PronounEntry[] = [COMMON_PRONOUN_SETS.SHE, COMMON_PRONOUN_SETS.THEY];
  const xeXem: PronounEntry[] = [KNOWN_NEOPRONOUN_SETS.XE];

  return (
    <div>
      {/* Text display */}
      <div style={card}>
        <span style={label}>PronounDisplay — text mode</span>
        <div style={row}>
          <span style={pill}>short</span>
          <PronounDisplay pronouns={she_they} />
        </div>
        <div style={row}>
          <span style={pill}>long (expanded)</span>
          <PronounDisplay format="long" pronouns={[COMMON_PRONOUN_SETS.SHE]} />
        </div>
        <div style={row}>
          <span style={pill}>neopronouns</span>
          <PronounDisplay pronouns={xeXem} />
        </div>
        <div style={row}>
          <span style={pill}>custom separator</span>
          <PronounDisplay pronouns={she_they} separator=" · " />
        </div>
        <div style={row}>
          <span style={pill}>with examples ↓ (click pronoun)</span>
          <PronounDisplay pronouns={[COMMON_PRONOUN_SETS.THEY]} showExamples />
        </div>
      </div>

      {/* Badge display mode */}
      <div style={card}>
        <span style={label}>PronounDisplay — badge mode</span>
        <PronounDisplay displayMode="badges" pronouns={she_they} />
        <div style={{ marginTop: "8px" }}>
          <PronounDisplay
            displayMode="badges"
            format="medium"
            pronouns={[COMMON_PRONOUN_SETS.HE, COMMON_PRONOUN_SETS.THEY]}
          />
        </div>
      </div>

      {/* Special preferences */}
      <div style={card}>
        <span style={label}>Special preferences (spec §D4)</span>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          <div style={row}>
            <span style={pill}>any</span>
            <PronounDisplay pronouns={[SPECIAL_PRONOUN_SETS.ANY]} />
          </div>
          <div style={row}>
            <span style={pill}>ask</span>
            <PronounDisplay pronouns={[SPECIAL_PRONOUN_SETS.ASK]} />
          </div>
          <div style={row}>
            <span style={pill}>none</span>
            <PronounDisplay pronouns={[SPECIAL_PRONOUN_SETS.NONE]} />
          </div>
          <div style={row}>
            <span style={pill}>unspecified</span>
            <PronounDisplay pronouns={[SPECIAL_PRONOUN_SETS.UNSPECIFIED]} />
          </div>
        </div>
      </div>

      {/* Privacy filtering */}
      <div style={card}>
        <span style={label}>Privacy filtering (spec §F4 — publicOnly)</span>
        <div style={row}>
          <span style={pill}>publicOnly=true (default)</span>
          <PronounDisplay
            pronouns={[
              COMMON_PRONOUN_SETS.SHE,
              { ...COMMON_PRONOUN_SETS.THEY, privacy: 1 },
            ]}
            publicOnly={true}
          />
        </div>
        <div style={row}>
          <span style={pill}>publicOnly=false</span>
          <PronounDisplay
            pronouns={[
              COMMON_PRONOUN_SETS.SHE,
              { ...COMMON_PRONOUN_SETS.THEY, privacy: 1 },
            ]}
            publicOnly={false}
          />
        </div>
        <small style={{ color: "#718096" }}>
          They/them has privacy=1. Hidden in public context, visible when
          publicOnly=false.
        </small>
      </div>

      {/* Excluded sets */}
      <div style={card}>
        <span style={label}>Excluded sets (spec §F2a — omitted in short display)</span>
        <PronounDisplay
          pronouns={[
            COMMON_PRONOUN_SETS.SHE,
            { ...COMMON_PRONOUN_SETS.HE, exclude: true },
          ]}
        />
        <small style={{ color: "#718096" }}>
          He/him is excluded — not shown.
        </small>
      </div>

      {/* Standalone PronounBadge */}
      <div style={card}>
        <span style={label}>PronounBadge — standalone</span>
        <div style={row}>
          <PronounBadge pronoun={COMMON_PRONOUN_SETS.SHE} />
          <PronounBadge format="medium" pronoun={COMMON_PRONOUN_SETS.THEY} />
          <PronounBadge pronoun={SPECIAL_PRONOUN_SETS.ANY} />
          <PronounBadge
            pronoun={COMMON_PRONOUN_SETS.HE}
            removable
            onRemove={() => {
              /* demo */
            }}
          />
        </div>
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Selection tab — PronounSelector
// ---------------------------------------------------------------------------

function SelectionTab({
  value,
  onChange,
}: {
  value: PronounEntry[];
  onChange: (v: PronounEntry[]) => void;
}) {
  const [mode, setMode] = useState<"compact" | "expanded" | "badges">("compact");

  return (
    <div>
      {/* Mode toggle */}
      <div style={{ marginBottom: "12px" }}>
        <span style={label}>Dropdown mode</span>
        <div style={{ display: "flex", gap: "8px" }}>
          {(["compact", "expanded", "badges"] as const).map((m) => (
            <button
              key={m}
              onClick={() => setMode(m)}
              style={{
                background: mode === m ? "#4299e1" : "transparent",
                border: "1px solid",
                borderColor: mode === m ? "#4299e1" : "#e2e8f0",
                borderRadius: "4px",
                color: mode === m ? "#fff" : "#4a5568",
                cursor: "pointer",
                fontSize: "12px",
                padding: "3px 10px",
              }}
              type="button"
            >
              {m}
            </button>
          ))}
        </div>
      </div>

      <PronounSelector
        dropdownMode={mode}
        onChange={onChange}
        placeholder="Select pronouns…"
        value={value}
      />

      {value.length > 0 && (
        <div style={{ ...card, marginTop: "16px" }}>
          <span style={label}>Output</span>
          <div style={row}>
            <span style={pill}>short</span>
            <PronounDisplay pronouns={value} />
          </div>
          <div style={row}>
            <span style={pill}>long</span>
            <PronounDisplay format="long" pronouns={value} />
          </div>
          <div style={row}>
            <span style={pill}>badges</span>
            <PronounDisplay displayMode="badges" pronouns={value} />
          </div>
          <div style={{ marginTop: "8px" }}>
            <span style={label}>JSON</span>
            <pre
              style={{
                background: "#edf2f7",
                borderRadius: "4px",
                fontSize: "11px",
                margin: 0,
                overflow: "auto",
                padding: "8px",
              }}
            >
              {JSON.stringify(value, null, 2)}
            </pre>
          </div>
        </div>
      )}

      <small style={{ color: "#718096" }}>
        Drag the ⋮ handle to reorder. Click ✏️ to open the detail editor for
        custom pronoun sets.
      </small>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Form tab — PronounForm
// ---------------------------------------------------------------------------

function FormTab() {
  const [saved, setSaved] = useState<PronounEntry[] | null>(null);

  return (
    <div>
      <div style={card}>
        <span style={label}>PronounForm — default (uncontrolled)</span>
        <PronounForm
          helperText='Sharing your pronouns is optional. We ask to ensure we address you correctly.'
          label="Your pronouns"
          showPreview
        />
      </div>

      <div style={card}>
        <span style={label}>PronounForm — with all options</span>
        <PronounForm
          dropdownMode="expanded"
          helperText="Choose as many as apply. Drag to reorder by preference."
          label="Pronouns"
          onChange={setSaved}
          previewFormat="medium"
          required
          showPreview
        />
        {saved && saved.length > 0 && (
          <div
            style={{
              background: "#c6f6d5",
              borderRadius: "4px",
              color: "#276749",
              fontSize: "13px",
              marginTop: "8px",
              padding: "8px",
            }}
          >
            Saved: <strong><PronounDisplay pronouns={saved} /></strong>
          </div>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Parser tab — usePronounParser
// ---------------------------------------------------------------------------

function ParserTab() {
  const { errors, formatted, input, isValid, parsed, setInput } =
    usePronounParser({ debounceMs: 200 });

  const examples = [
    "she/her",
    "they/them, she/her",
    "any pronouns",
    "xe/xem",
    "he/him or she/her, just not they/them",
    "ask me",
  ];

  return (
    <div>
      <div style={card}>
        <label
          htmlFor="parser-input"
          style={{ ...label, marginBottom: "8px" }}
        >
          usePronounParser — live parsing
        </label>
        <input
          id="parser-input"
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type pronouns…"
          style={{
            border: "1px solid #e2e8f0",
            borderRadius: "4px",
            boxSizing: "border-box",
            fontSize: "14px",
            padding: "8px 12px",
            width: "100%",
          }}
          value={input}
        />
        <div style={{ display: "flex", flexWrap: "wrap", gap: "6px", marginTop: "8px" }}>
          {examples.map((ex) => (
            <button
              key={ex}
              onClick={() => setInput(ex)}
              style={{
                background: "#edf2f7",
                border: "none",
                borderRadius: "4px",
                color: "#4a5568",
                cursor: "pointer",
                fontSize: "11px",
                padding: "2px 8px",
              }}
              type="button"
            >
              {ex}
            </button>
          ))}
        </div>
      </div>

      {input && (
        <div style={card}>
          <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
            <div style={row}>
              <span style={pill}>formatted</span>
              <span style={{ fontSize: "14px", fontWeight: 600 }}>
                {formatted || "(empty)"}
              </span>
            </div>
            <div style={row}>
              <span style={pill}>valid</span>
              <span style={{ color: isValid ? "#276749" : "#c53030" }}>
                {isValid ? "✓ yes" : "✗ no"}
              </span>
              {errors.length > 0 && (
                <span style={{ color: "#c53030", fontSize: "12px" }}>
                  — {errors.join(", ")}
                </span>
              )}
            </div>
            <div style={row}>
              <span style={pill}>entries</span>
              <span style={{ fontSize: "13px" }}>{parsed.length}</span>
            </div>
            <div>
              <span style={label}>Structured output</span>
              <pre
                style={{
                  background: "#edf2f7",
                  borderRadius: "4px",
                  fontSize: "11px",
                  margin: 0,
                  overflow: "auto",
                  padding: "8px",
                }}
              >
                {JSON.stringify(parsed, null, 2)}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Themes tab
// ---------------------------------------------------------------------------

function ThemesTab() {
  const pronouns: PronounEntry[] = [
    COMMON_PRONOUN_SETS.SHE,
    COMMON_PRONOUN_SETS.THEY,
  ];

  return (
    <div>
      <div style={card}>
        <span style={label}>Default theme</span>
        <PronounDisplay displayMode="badges" pronouns={pronouns} />
      </div>

      <div
        style={{
          ...card,
          background: "#1a202c",
          border: "1px solid #4a5568",
        }}
      >
        <span style={{ ...label, color: "#a0aec0" }}>Dark theme</span>
        <PronounDisplay
          displayMode="badges"
          pronouns={pronouns}
          theme={darkTheme}
        />
        <div style={{ marginTop: "12px" }}>
          <PronounSelector
            onChange={() => {
              /* demo — not wired up */
            }}
            placeholder="Select pronouns…"
            theme={darkTheme}
            value={pronouns}
          />
        </div>
      </div>

      <div style={card}>
        <span style={label}>Custom theme (inline partial)</span>
        <PronounDisplay
          displayMode="badges"
          pronouns={pronouns}
          theme={{
            borderRadius: "9999px",
            colors: {
              background: "#fff",
              badgeBackground: "#faf5ff",
              badgeText: "#6b21a8",
              border: "#d8b4fe",
              disabled: "#c4b5fd",
              error: "#dc2626",
              primary: "#7c3aed",
              secondary: "#ede9fe",
              text: "#1e1b4b",
            },
          }}
        />
        <div style={{ marginTop: "8px" }}>
          <PronounSelector
            onChange={() => {
              /* demo */
            }}
            placeholder="Select pronouns…"
            theme={{
              borderRadius: "8px",
              colors: {
                background: "#fff",
                badgeBackground: "#faf5ff",
                badgeText: "#6b21a8",
                border: "#d8b4fe",
                disabled: "#c4b5fd",
                error: "#dc2626",
                primary: "#7c3aed",
                secondary: "#ede9fe",
                text: "#1e1b4b",
              },
            }}
            value={pronouns}
          />
        </div>
      </div>

      <div style={card}>
        <span style={label}>Custom class names via classNames prop</span>
        <div style={{ fontSize: "13px" }}>
          Every component accepts a <code>classNames</code> prop that adds CSS
          classes to individual sub-elements:
          <pre
            style={{
              background: "#edf2f7",
              borderRadius: "4px",
              fontSize: "11px",
              marginTop: "8px",
              overflow: "auto",
              padding: "8px",
            }}
          >
{`<PronounDisplay
  classNames={{
    root: "my-display",
    pronounWrapper: "my-pronoun",
    pronounText: "my-text",
    tooltip: "my-tooltip",
  }}
  pronouns={…}
/>`}
          </pre>
        </div>
      </div>
    </div>
  );
}
