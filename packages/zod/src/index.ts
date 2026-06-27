import { z } from "zod";

/**
 * Zod mirror of the canonical OpenPronoun JSON Schema (`@openpronoun/schema`).
 *
 * This is a hand-written, idiomatic Zod port kept in sync with
 * `pronoun-set.schema.json` via the parity test (see `test/parity.test.ts`),
 * which checks that both validators agree across the `@openpronoun/conformance`
 * fixtures. The JSON Schema remains the canonical, cross-language artifact;
 * this package exists for TypeScript ergonomics (inferred types + nicer errors).
 *
 * Intentional difference from the JSON Schema: special preferences here are
 * strict (no stray pronoun-form fields), whereas the JSON Schema is looser on
 * that pathological case. Both agree on every conformance fixture.
 */

const nonEmpty = z.string().min(1);
const iso6391 = z.string().regex(/^[a-z]{2}$/, "expected an ISO 639-1 code");

/** Optional per-entry metadata, in both full and compact key styles. */
const metadata = {
  ranking: z.number().int().optional(),
  rnk: z.number().int().optional(),
  context: z.string().optional(),
  ctx: z.string().optional(),
  privacy: z.number().int().min(0).optional(),
  pvc: z.number().int().min(0).optional(),
  language: iso6391.optional(),
  lang: iso6391.optional(),
  exclude: z.boolean().optional(),
  exc: z.boolean().optional(),
} as const;

const fullForms = {
  subjective: nonEmpty,
  objective: nonEmpty,
  possessive_adjective: nonEmpty,
  possessive_pronoun: nonEmpty,
  reflexive: nonEmpty,
} as const;

const compactForms = {
  sub: nonEmpty,
  obj: nonEmpty,
  p_a: nonEmpty,
  p_pn: nonEmpty,
  ref: nonEmpty,
} as const;

/** A standard pronoun set in full keys. */
export const fullPronounSetSchema = z.strictObject({ ...fullForms, ...metadata });

/** A standard pronoun set in compact keys. */
export const compactPronounSetSchema = z.strictObject({ ...compactForms, ...metadata });

/** A standard pronoun set (either key style). */
export const pronounSetSchema = z.union([fullPronounSetSchema, compactPronounSetSchema]);

/** The non-set special preferences. */
export const SPECIAL_TYPES = ["any", "none", "ask", "unspecified"] as const;

/** A special preference: any / none / ask / unspecified. */
export const specialPreferenceSchema = z.strictObject({
  type: z.enum(SPECIAL_TYPES),
  ...metadata,
});

/**
 * A custom entry: requires `display`, and may additionally carry pronoun-form
 * fields (a merged or partially specified set).
 */
export const customEntrySchema = z.strictObject({
  type: z.literal("custom"),
  display: nonEmpty,
  subjective: nonEmpty.optional(),
  objective: nonEmpty.optional(),
  possessive_adjective: nonEmpty.optional(),
  possessive_pronoun: nonEmpty.optional(),
  reflexive: nonEmpty.optional(),
  sub: nonEmpty.optional(),
  obj: nonEmpty.optional(),
  p_a: nonEmpty.optional(),
  p_pn: nonEmpty.optional(),
  ref: nonEmpty.optional(),
  ...metadata,
});

/** A single entry: a standard set, a special preference, or a custom entry. */
export const pronounEntrySchema = z.union([
  specialPreferenceSchema,
  customEntrySchema,
  pronounSetSchema,
]);

/** A pronoun preference: one or more entries, in user-preferred order. */
export const pronounPreferenceSchema = z.array(pronounEntrySchema).min(1);

export type PronounSet = z.infer<typeof pronounSetSchema>;
export type SpecialPreference = z.infer<typeof specialPreferenceSchema>;
export type CustomEntry = z.infer<typeof customEntrySchema>;
export type PronounEntry = z.infer<typeof pronounEntrySchema>;
export type PronounPreference = z.infer<typeof pronounPreferenceSchema>;
