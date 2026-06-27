import type { FormatOptions, PronounEntry, PronounPreference } from "./types";

// Helpers for reading either full or compact key styles.

function sub(e: PronounEntry): string | undefined {
  if ("subjective" in e) return e.subjective;
  if ("sub" in e) return (e as { sub?: string }).sub;
  return undefined;
}

function obj(e: PronounEntry): string | undefined {
  if ("objective" in e) return e.objective;
  if ("obj" in e) return (e as { obj?: string }).obj;
  return undefined;
}

function ppn(e: PronounEntry): string | undefined {
  if ("possessive_pronoun" in e) return e.possessive_pronoun;
  if ("p_pn" in e) return (e as { p_pn?: string }).p_pn;
  return undefined;
}

function ctx(e: PronounEntry): string | undefined {
  if ("context" in e && e.context) return e.context;
  if ("ctx" in e && (e as { ctx?: string }).ctx)
    return (e as { ctx?: string }).ctx;
  return undefined;
}

function ranking(e: PronounEntry): number | undefined {
  if ("ranking" in e && e.ranking !== undefined) return e.ranking;
  if ("rnk" in e && (e as { rnk?: number }).rnk !== undefined)
    return (e as { rnk?: number }).rnk;
  return undefined;
}

function privacy(e: PronounEntry): number | undefined {
  if ("privacy" in e && e.privacy !== undefined) return e.privacy;
  if ("pvc" in e && (e as { pvc?: number }).pvc !== undefined)
    return (e as { pvc?: number }).pvc;
  return undefined;
}

function excluded(e: PronounEntry): boolean {
  if ("exclude" in e && e.exclude === true) return true;
  if ("exc" in e && (e as { exc?: boolean }).exc === true) return true;
  return false;
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

function capitalizeSlashSeparated(s: string): string {
  return s.split("/").map(capitalize).join("/");
}

function formatSingleEntry(
  entry: PronounEntry,
  form: "short" | "expanded" | "detailed",
): string {
  if ("type" in entry) {
    const t = entry.type;
    if (t === "any") return "Any pronouns";
    if (t === "none") return "No pronouns (use name)";
    if (t === "ask") return "Ask me my pronouns";
    if (t === "unspecified") return "Unspecified";
    if (t === "custom") {
      const display = (entry as { type: "custom"; display: string }).display;
      return capitalizeSlashSeparated(display);
    }
  }

  const s = sub(entry);
  const o = obj(entry);
  const p = ppn(entry);

  if (!s || !o) return "";

  let base: string;
  if (form === "expanded") {
    base = `${capitalize(s)}/${capitalize(o)}/${capitalize(p ?? o)}`;
  } else {
    base = `${capitalize(s)}/${capitalize(o)}`;
  }

  const context = ctx(entry);
  if (context) base += ` (${context})`;

  return base;
}

export function format(
  preference: PronounPreference,
  options: FormatOptions = {},
): string {
  const form = options.form ?? "short";
  const isPublic = options.audience === "public";

  // Filter by privacy for public audience.
  let visible = preference.filter((e) => {
    if (isPublic) {
      const p = privacy(e);
      if (p !== undefined && p >= 1) return false;
    }
    return true;
  });

  // Sort by ranking (ascending — lower number = higher preference).
  // Entries without ranking stay at the end in their original order.
  visible = [...visible].sort((a, b) => {
    const ra = ranking(a);
    const rb = ranking(b);
    if (ra !== undefined && rb !== undefined) return ra - rb;
    if (ra !== undefined) return -1;
    if (rb !== undefined) return 1;
    return 0;
  });

  if (form === "detailed") {
    const positive = visible.filter((e) => !excluded(e));
    const negative = visible.filter((e) => excluded(e));

    const posStr = positive
      .map((e) => formatSingleEntry(e, "short"))
      .filter(Boolean)
      .join(", ");

    if (negative.length === 0) return posStr;

    const negStr = negative
      .map((e) => {
        const s = sub(e);
        const o = obj(e);
        return s && o ? `not ${capitalize(s)}/${capitalize(o)}` : "";
      })
      .filter(Boolean)
      .join(", ");

    return negStr ? `${posStr} (${negStr})` : posStr;
  }

  // short / expanded: omit excluded entries.
  const displayable = visible.filter((e) => !excluded(e));

  return displayable
    .map((e) => formatSingleEntry(e, form))
    .filter(Boolean)
    .join(", ");
}
