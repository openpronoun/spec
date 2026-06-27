/**
 * Utilities and adapters for the @openpronoun/react package.
 *
 * Provides the API surface the React components need — built entirely on top of
 * @openpronoun/core so there is no duplicate logic.
 */

import {
  format,
  parse,
  validate,
  validationErrors,
  PRONOUN_DICTIONARY,
} from "@openpronoun/core";
import type {
  PronounSet,
  PronounEntry,
  SpecialPreference,
  PronounPreference,
} from "@openpronoun/core";

// Re-export core types so components can import from one place
export type {
  PronounSet,
  PronounEntry,
  SpecialPreference,
  PronounPreference,
};

// ---------------------------------------------------------------------------
// PronounType — string-literal constants for the spec's four special types.
// Standard pronoun sets have NO type field; check with isStandardSet().
// ---------------------------------------------------------------------------

export const PronounType = {
  ANY: "any",
  NONE: "none",
  ASK: "ask",
  UNSPECIFIED: "unspecified",
  CUSTOM: "custom",
} as const;
export type PronounTypeValue = (typeof PronounType)[keyof typeof PronounType];

// ---------------------------------------------------------------------------
// Privacy levels — integer codes matching the spec's privacy field.
// 0 = public (default when omitted).
// ---------------------------------------------------------------------------

export const PrivacyLevel = {
  PUBLIC: 0,
  AUTHENTICATED: 1,
  CONNECTIONS: 2,
  PRIVATE: 3,
} as const;

// ---------------------------------------------------------------------------
// Pronoun set dictionaries (derived from PRONOUN_DICTIONARY in core)
// ---------------------------------------------------------------------------

// First four entries: she/her, he/him, they/them, it/its
export const COMMON_PRONOUN_SETS = {
  SHE: PRONOUN_DICTIONARY[0] as PronounSet,
  HE: PRONOUN_DICTIONARY[1] as PronounSet,
  THEY: PRONOUN_DICTIONARY[2] as PronounSet,
  IT: PRONOUN_DICTIONARY[3] as PronounSet,
} as const;

// Remaining entries are neopronouns (explicit keys to avoid clash between two ze sets)
export const KNOWN_NEOPRONOUN_SETS = {
  XE: PRONOUN_DICTIONARY[4] as PronounSet,
  ZE: PRONOUN_DICTIONARY[5] as PronounSet,
  FAE: PRONOUN_DICTIONARY[6] as PronounSet,
  PER: PRONOUN_DICTIONARY[7] as PronounSet,
  EY: PRONOUN_DICTIONARY[8] as PronounSet,
  E: PRONOUN_DICTIONARY[9] as PronounSet,
  ZE_HIR: PRONOUN_DICTIONARY[10] as PronounSet,
  AE: PRONOUN_DICTIONARY[11] as PronounSet,
  CO: PRONOUN_DICTIONARY[12] as PronounSet,
  NE: PRONOUN_DICTIONARY[13] as PronounSet,
  THON: PRONOUN_DICTIONARY[14] as PronounSet,
  VE: PRONOUN_DICTIONARY[15] as PronounSet,
} as const;

// Special preference objects for any/none/ask/unspecified
export const SPECIAL_PRONOUN_SETS = {
  ANY: { type: "any" } as SpecialPreference,
  NONE: { type: "none" } as SpecialPreference,
  ASK: { type: "ask" } as SpecialPreference,
  UNSPECIFIED: { type: "unspecified" } as SpecialPreference,
} as const;

// ---------------------------------------------------------------------------
// Type guards
// ---------------------------------------------------------------------------

/** Returns true when entry is a standard pronoun set (no `type` field). */
export function isStandardSet(entry: PronounEntry): entry is PronounSet {
  return !("type" in entry);
}

// ---------------------------------------------------------------------------
// Field accessors — handle both full-key (subjective/objective/…) and
// compact-key (sub/obj/…) variants of PronounSet.
// ---------------------------------------------------------------------------

export function getSubjective(set: PronounSet): string {
  if ("subjective" in set) return set.subjective;
  return (set as { sub: string }).sub;
}

export function getObjective(set: PronounSet): string {
  if ("objective" in set) return set.objective;
  return (set as { obj: string }).obj;
}

export function getPossessiveAdjective(set: PronounSet): string {
  if ("possessive_adjective" in set) return set.possessive_adjective;
  return (set as { p_a: string }).p_a;
}

export function getPossessivePronoun(set: PronounSet): string {
  if ("possessive_pronoun" in set) return set.possessive_pronoun;
  return (set as { p_pn: string }).p_pn;
}

export function getReflexive(set: PronounSet): string {
  if ("reflexive" in set) return set.reflexive;
  return (set as { ref: string }).ref;
}

function cap(s: string): string {
  return s ? s.charAt(0).toUpperCase() + s.slice(1) : s;
}

// ---------------------------------------------------------------------------
// Example sentences
// ---------------------------------------------------------------------------

/**
 * Generates five illustrative sentences using every form of a pronoun set.
 * Only meaningful for sets that have all five forms populated.
 */
export function createExampleSentences(set: PronounSet): string[] {
  const sub = getSubjective(set);
  const obj = getObjective(set);
  const posAdj = getPossessiveAdjective(set);
  const possPron = getPossessivePronoun(set);
  const refl = getReflexive(set);

  if (!sub || !obj) return [];

  return [
    `${cap(sub)} went to the store.`,
    `I saw ${obj} at the park.`,
    `${cap(posAdj)} book is on the table.`,
    `The book is ${possPron}.`,
    `${cap(sub)} did it ${refl}.`,
  ];
}

// ---------------------------------------------------------------------------
// Format utilities
// ---------------------------------------------------------------------------

const FORMAT_MAP = {
  short: "short",
  medium: "expanded", // medium maps to expanded (sub/obj/poss-pronoun)
  long: "expanded",   // long maps to expanded (sub/obj/poss-pronoun)
} as const;

/**
 * Formats a single pronoun entry for display.
 * Wraps core's `format()` for single-entry use.
 */
export function formatPronounSet(
  entry: PronounEntry,
  opts: {
    format?: "long" | "medium" | "short";
    includeContext?: boolean;
  } = {},
): string {
  const form = FORMAT_MAP[opts.format ?? "short"];
  return format([entry], { form });
}

/**
 * Formats an array of entries into a display string.
 * @param opts.format - "short" (default) = "she/her", "medium"/"long" = "she/her/hers"
 */
export function formatPronouns(
  entries: PronounEntry[],
  opts?: { format?: "long" | "medium" | "short" },
): string {
  if (entries.length === 0) return "";
  const form = FORMAT_MAP[opts?.format ?? "short"];
  return format(entries, { form });
}

// ---------------------------------------------------------------------------
// Parse utilities
// ---------------------------------------------------------------------------

/**
 * Parses a freetext pronoun string into structured entries.
 * Returns the parsed entries and the preserved original text.
 */
export function parsePronounPreference(input: string): {
  sets: PronounEntry[];
  originalText: string;
} {
  const result = parse(input);
  return { originalText: input, sets: result ?? [] };
}

// ---------------------------------------------------------------------------
// Validation utilities
// ---------------------------------------------------------------------------

/**
 * Returns true when a single entry is valid per the spec.
 */
export function validatePronounSet(entry: PronounEntry): boolean {
  return validate([entry]);
}

/**
 * Returns human-readable validation error strings for a single entry.
 */
export function getPronounSetValidationErrors(entry: PronounEntry): string[] {
  return validationErrors([entry]);
}
