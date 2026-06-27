import type {
  CustomEntry,
  PronounEntry,
  PronounPreference,
  SpecialPreference,
} from "../types";

import {
  FILLER_PATTERNS,
  FORM_TO_SET,
  PLACEHOLDER_STRINGS,
  SPECIAL_KEYWORDS,
  type CanonicalEntry,
} from "../constants";

type SpecialType = "any" | "none" | "ask" | "unspecified";

function matchSpecialKeyword(text: string): SpecialType | undefined {
  for (const [type, keywords] of Object.entries(SPECIAL_KEYWORDS) as [
    SpecialType,
    readonly string[],
  ][]) {
    if ((keywords as readonly string[]).includes(text)) return type;
  }
  return undefined;
}

function stripFiller(text: string): string {
  let s = text;
  for (const pattern of FILLER_PATTERNS) {
    s = s.replace(pattern, "").trim();
  }
  return s;
}

function isPlaceholder(text: string): boolean {
  return PLACEHOLDER_STRINGS.includes(text);
}

function formBelongsToEntry(form: string, entry: CanonicalEntry): boolean {
  return (
    entry.subjective === form ||
    entry.objective === form ||
    entry.possessive_adjective === form ||
    entry.possessive_pronoun === form ||
    entry.reflexive === form
  );
}

function makeStandardEntry(
  set: CanonicalEntry,
  context: string | undefined,
  excluded: boolean,
): PronounEntry {
  const entry: Record<string, unknown> = {
    subjective: set.subjective,
    objective: set.objective,
    possessive_adjective: set.possessive_adjective,
    possessive_pronoun: set.possessive_pronoun,
    reflexive: set.reflexive,
  };
  if (context !== undefined) entry["context"] = context;
  if (excluded) entry["exclude"] = true;
  return entry as PronounEntry;
}

function resolveTokens(
  tokensLc: string[],
  originalText: string,
  context: string | undefined,
  excluded: boolean,
): PronounEntry[] {
  const hasKnownToken = tokensLc.some((t) => FORM_TO_SET.has(t));

  if (!hasKnownToken) {
    const entry: CustomEntry = { type: "custom", display: originalText };
    if (context !== undefined) entry.context = context;
    if (excluded) entry.exclude = true;
    return [entry];
  }

  const result: PronounEntry[] = [];
  let currentSet: CanonicalEntry | null = null;

  for (const token of tokensLc) {
    const candidate = FORM_TO_SET.get(token);
    if (!candidate) continue;

    if (currentSet === null) {
      currentSet = candidate;
    } else if (
      candidate === currentSet ||
      formBelongsToEntry(token, currentSet)
    ) {
      // same set or an alternate form of the current set — keep accumulating
    } else if (candidate.subjective === currentSet.subjective) {
      // same subjective, different set — disambiguation token (e.g. "zir" after "ze")
      currentSet = candidate;
    } else {
      result.push(makeStandardEntry(currentSet, context, excluded));
      currentSet = candidate;
    }
  }

  if (currentSet !== null) {
    result.push(makeStandardEntry(currentSet, context, excluded));
  }

  return result;
}

function deduplicateEntries(entries: PronounEntry[]): PronounEntry[] {
  const seen = new Set<string>();
  return entries.filter((entry) => {
    let key: string;
    if ("type" in entry && entry.type !== "custom") {
      key = `special:${entry.type}`;
    } else if ("type" in entry && entry.type === "custom") {
      key = `custom:${(entry as CustomEntry).display}`;
    } else if ("subjective" in entry && entry.subjective) {
      key = `sub:${entry.subjective}`;
    } else if ("sub" in entry && (entry as { sub?: string }).sub) {
      key = `sub:${(entry as { sub?: string }).sub}`;
    } else {
      return true;
    }
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

export function parse(
  input: string | null | undefined,
): PronounPreference | null {
  if (!input?.trim()) return null;

  // Normalize: smart quotes, surrounding quotes, backslash→slash,
  // spaces around slashes, collapsed whitespace.
  const text = input
    .replace(/[‘’‛]/g, "'")
    .replace(/^["'](.+)["']$/, "$1")
    .replace(/\\/g, "/")
    .replace(/\s*\/\s*/g, "/")
    .replace(/\s+/g, " ")
    .trim();

  if (!text) return null;

  const textLc = text.toLowerCase();

  if (isPlaceholder(textLc)) return null;

  // Check whole input against special keywords before splitting.
  const wholeSpecialType = matchSpecialKeyword(textLc);
  if (wholeSpecialType) return [{ type: wholeSpecialType }];

  // Split on set-level separators: comma, semicolon, ampersand, "and", "or".
  const segments = text.split(/,\s*|;\s*|\s+&\s+|\s+and\s+|\s+or\s+/i);

  const entries: PronounEntry[] = [];

  for (const rawSeg of segments) {
    const seg = rawSeg.trim();
    if (!seg) continue;

    let workSeg = seg;
    let workLc = seg.toLowerCase();

    // Extract parenthetical or bracketed context: "she/her (at work)" or "[at work]".
    let context: string | undefined;
    const parenMatch =
      workSeg.match(/\s*\(([^)]+)\)\s*$/) ??
      workSeg.match(/\s*\[([^\]]+)\]\s*$/);
    if (parenMatch) {
      context = parenMatch[1]!.trim() || undefined;
      workSeg = workSeg.slice(0, parenMatch.index!).trim();
      workLc = workSeg.toLowerCase();
    }

    // Strip filler phrases — apply FILLER_PATTERNS to the original-case workSeg
    // (all patterns have /i), then re-derive workLc.
    for (const pattern of FILLER_PATTERNS) {
      workSeg = workSeg.replace(pattern, "").trim();
    }
    workLc = workSeg.toLowerCase();

    if (!workLc) continue;

    // Check special keyword BEFORE exclusion detection so that phrases like
    // "not sure yet" are caught here and not misread as exclusions.
    const segSpecialType = matchSpecialKeyword(workLc);
    if (segSpecialType) {
      const entry: SpecialPreference = { type: segSpecialType };
      if (context !== undefined)
        (entry as Record<string, unknown>)["context"] = context;
      entries.push(entry);
      continue;
    }

    // Placeholder check.
    if (isPlaceholder(workLc)) continue;

    // Detect and strip exclusion prefix ("just not", "not", "never", "except").
    let excluded = false;
    const exclusionMatch = workLc.match(
      /^(?:just\s+not|not|never|except)\s+(.+)$/,
    );
    if (exclusionMatch) {
      excluded = true;
      const remainder = exclusionMatch[1]!;
      workSeg = workSeg.slice(workSeg.length - remainder.length);
      workLc = remainder;
    }

    // Tokenize by "/" and space, resolve to known sets.
    const tokensLc = workLc.split(/[/ ]+/).filter(Boolean);
    if (tokensLc.length === 0) continue;

    const resolved = resolveTokens(tokensLc, workSeg, context, excluded);
    entries.push(...resolved);
  }

  const deduped = deduplicateEntries(entries);
  return deduped.length > 0 ? deduped : null;
}
