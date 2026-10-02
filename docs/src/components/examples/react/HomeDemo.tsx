import { useEffect, useState } from "react";
import { format } from "@openpronoun/core";
import {
  PronounDisplay,
  PronounSelector,
  defaultTheme,
  darkTheme,
  type PronounEntry,
  type PronounTheme,
} from "@openpronoun/react";

/**
 * Home-page demo: the badge-mode PronounSelector, live.
 *
 * It's styled only through theme tokens built from the docs palette
 * (docs/src/styles/custom.css), which is the point: the same restyling
 * hooks any team gets. It follows the site's light/dark switch.
 */

const shared: Partial<PronounTheme> = {
  borderRadius: "12px",
  fontFamily: "inherit",
  badgeStyle: { borderRadius: "9999px" },
};

const plumDark: PronounTheme = {
  ...darkTheme,
  ...shared,
  colors: {
    ...darkTheme.colors,
    background: "#241a31",
    badgeBackground: "#36113e",
    badgeText: "#f2e9fd",
    border: "#614e78",
    focus: "#e3b6ed",
    focusRing: "rgba(227, 182, 237, 0.35)",
    helperText: "#9581ae",
    label: "#c7bdd5",
    placeholder: "#9581ae",
    primary: "#e3b6ed",
    primaryHover: "#f2e9fd",
    secondary: "#2f1c42",
    secondaryHover: "#412e55",
    text: "#f2e9fd",
  },
  focusStyle: { boxShadow: "0 0 0 3px rgba(227, 182, 237, 0.35)" },
};

const lavenderLight: PronounTheme = {
  ...defaultTheme,
  ...shared,
  colors: {
    ...defaultTheme.colors,
    background: "#ffffff",
    badgeBackground: "#f1e6fa",
    badgeText: "#4e0e5b",
    border: "#c7bdd5",
    focus: "#a700c3",
    focusRing: "rgba(167, 0, 195, 0.25)",
    helperText: "#614e78",
    label: "#412e55",
    placeholder: "#9581ae",
    primary: "#a700c3",
    primaryHover: "#4e0e5b",
    secondary: "#f2e9fd",
    secondaryHover: "#ebc9f3",
    text: "#1c1425",
  },
  focusStyle: { boxShadow: "0 0 0 3px rgba(167, 0, 195, 0.25)" },
};

const readTheme = () =>
  typeof document !== "undefined" && document.documentElement.dataset.theme === "light"
    ? "light"
    : "dark";

const useSiteTheme = () => {
  const [mode, setMode] = useState<"light" | "dark">("dark");
  useEffect(() => {
    setMode(readTheme());
    const observer = new MutationObserver(() => setMode(readTheme()));
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ["data-theme"],
    });
    return () => observer.disconnect();
  }, []);
  return mode;
};

const START: PronounEntry[] = [
  {
    subjective: "they",
    objective: "them",
    possessive_adjective: "their",
    possessive_pronoun: "theirs",
    reflexive: "themselves",
  },
  {
    subjective: "she",
    objective: "her",
    possessive_adjective: "her",
    possessive_pronoun: "hers",
    reflexive: "herself",
  },
];

export default function HomeDemo() {
  const mode = useSiteTheme();
  const theme = mode === "light" ? lavenderLight : plumDark;
  const [pronouns, setPronouns] = useState<PronounEntry[]>(START);
  const label = pronouns.length ? format(pronouns) : "Nothing selected yet";

  return (
    <div className="op-demo">
      <div className="op-demo-field">
        <span className="op-demo-label" aria-hidden="true">
          Pronouns <span className="op-demo-optional">(optional)</span>
        </span>
        <PronounSelector
          id="op-demo"
          aria-label="Pronouns (optional)"
          dropdownMode="badges"
          value={pronouns}
          onChange={setPronouns}
          theme={theme}
          placeholder="Search or type your pronouns"
        />
      </div>

      <div className="op-demo-output">
        <div>
          <span className="op-demo-label">On a profile</span>
          <PronounDisplay pronouns={pronouns} displayMode="badges" theme={theme} />
          {pronouns.length === 0 && <span className="op-demo-empty">Nothing to show</span>}
        </div>
        <div>
          <span className="op-demo-label">As text</span>
          <span className="op-demo-text" aria-live="polite">
            {label}
          </span>
        </div>
      </div>

      <details className="op-demo-json">
        <summary>What gets stored</summary>
        <pre>
          <code>{JSON.stringify(pronouns, null, 2)}</code>
        </pre>
      </details>
    </div>
  );
}
