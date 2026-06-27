export type {
  PronounPreference,
  PronounEntry,
  PronounSet,
  SpecialPreference,
  CustomEntry,
} from "@openpronoun/zod";

export {
  pronounPreferenceSchema,
  pronounEntrySchema,
  pronounSetSchema,
  specialPreferenceSchema,
  customEntrySchema,
  SPECIAL_TYPES,
} from "@openpronoun/zod";

export interface FormatOptions {
  form?: "short" | "expanded" | "detailed";
  audience?: string;
}
