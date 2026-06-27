export interface CanonicalEntry {
  readonly subjective: string;
  readonly objective: string;
  readonly possessive_adjective: string;
  readonly possessive_pronoun: string;
  readonly reflexive: string;
}

export const PRONOUN_DICTIONARY: readonly CanonicalEntry[] = [
  // Common sets
  {
    subjective: "she",
    objective: "her",
    possessive_adjective: "her",
    possessive_pronoun: "hers",
    reflexive: "herself",
  },
  {
    subjective: "he",
    objective: "him",
    possessive_adjective: "his",
    possessive_pronoun: "his",
    reflexive: "himself",
  },
  {
    subjective: "they",
    objective: "them",
    possessive_adjective: "their",
    possessive_pronoun: "theirs",
    reflexive: "themselves",
  },
  {
    subjective: "it",
    objective: "it",
    possessive_adjective: "its",
    possessive_pronoun: "its",
    reflexive: "itself",
  },
  // Neopronouns
  {
    subjective: "xe",
    objective: "xem",
    possessive_adjective: "xyr",
    possessive_pronoun: "xyrs",
    reflexive: "xemself",
  },
  {
    subjective: "ze",
    objective: "zir",
    possessive_adjective: "zir",
    possessive_pronoun: "zirs",
    reflexive: "zirself",
  },
  {
    subjective: "fae",
    objective: "faer",
    possessive_adjective: "faer",
    possessive_pronoun: "faers",
    reflexive: "faerself",
  },
  {
    subjective: "per",
    objective: "per",
    possessive_adjective: "per",
    possessive_pronoun: "pers",
    reflexive: "perself",
  },
  {
    subjective: "ey",
    objective: "em",
    possessive_adjective: "eir",
    possessive_pronoun: "eirs",
    reflexive: "emself",
  },
  {
    subjective: "e",
    objective: "em",
    possessive_adjective: "eir",
    possessive_pronoun: "eirs",
    reflexive: "emself",
  },
  {
    subjective: "ze",
    objective: "hir",
    possessive_adjective: "hir",
    possessive_pronoun: "hirs",
    reflexive: "hirself",
  },
  {
    subjective: "ae",
    objective: "aer",
    possessive_adjective: "aer",
    possessive_pronoun: "aers",
    reflexive: "aerself",
  },
  {
    subjective: "co",
    objective: "co",
    possessive_adjective: "cos",
    possessive_pronoun: "cos",
    reflexive: "coself",
  },
  {
    subjective: "ne",
    objective: "nem",
    possessive_adjective: "nir",
    possessive_pronoun: "nirs",
    reflexive: "nemself",
  },
  {
    subjective: "thon",
    objective: "thon",
    possessive_adjective: "thons",
    possessive_pronoun: "thons",
    reflexive: "thonself",
  },
  {
    subjective: "ve",
    objective: "ver",
    possessive_adjective: "vis",
    possessive_pronoun: "vis",
    reflexive: "verself",
  },
] as const;

// Reverse lookup: any known form → its canonical entry.
// Subjective always takes priority; other forms use first-write-wins.
function buildFormToSet(): Map<string, CanonicalEntry> {
  const map = new Map<string, CanonicalEntry>();
  for (const entry of PRONOUN_DICTIONARY) {
    // Subjective always wins (overwrite)
    map.set(entry.subjective, entry);
  }
  for (const entry of PRONOUN_DICTIONARY) {
    for (const form of [
      entry.objective,
      entry.possessive_adjective,
      entry.possessive_pronoun,
      entry.reflexive,
    ]) {
      if (!map.has(form)) {
        map.set(form, entry);
      }
    }
  }
  return map;
}

export const FORM_TO_SET: ReadonlyMap<string, CanonicalEntry> =
  buildFormToSet();

export const SPECIAL_KEYWORDS = {
  any: [
    "any",
    "any pronoun",
    "any pronouns",
    "any/all",
    "all/any",
    "any and all",
    "any and all pronouns",
    "all",
    "all pronouns",
    "no preference",
    "whatever",
    "whatever you want",
    "whatever you prefer",
    "whatever is fine",
    "whatever you feel comfortable",
    "i don't care",
    "i dont care",
    "idc",
    "doesn't matter",
    "doesnt matter",
    "i go by all",
    "most are acceptable",
  ],
  none: [
    "none",
    "no pronouns",
    "avoid pronouns",
    "use my name",
    "name only",
    "just my name",
    "refer to me by name",
  ],
  ask: ["ask", "ask me", "ask my pronouns", "ask me my pronouns", "please ask"],
  unspecified: [
    "unsure",
    "not sure",
    "not sure yet",
    "prefer not to disclose",
    "prefer not to say",
    "choose not to disclose",
    "undecided",
    "i don't know",
    "i dont know",
    "don't know",
    "dont know",
    "don't know yet",
    "dont know yet",
    "dunno",
    "private",
  ],
} as const;

export const PLACEHOLDER_STRINGS: readonly string[] = [
  "n/a",
  "na",
  "tbd",
  "-",
  "none given",
];

export const FILLER_PATTERNS: readonly RegExp[] = [
  // suffix fillers
  /\s+is\s+fine\s*$/i,
  /\s+are\s+fine\s*$/i,
  /\s+also\s*$/i,
  /\s+as\s+well\s*$/i,
  /\s+preferred\s*$/i,
  /\s+only\s*$/i,
  /\s+please\s*$/i,
  /\s+now\s*$/i,
  // prefix fillers
  /^please\s+/i,
  /^only\s+/i,
  /^just\s+use\s+/i,
  /^i\s+use\s+/i,
  /^i\s+go\s+by\s+/i,
  // whole-segment filler phrase
  /^relevant\s+pronouns\s+are\s+fine\s*$/i,
];
