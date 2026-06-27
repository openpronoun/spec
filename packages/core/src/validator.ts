import type { PronounPreference } from "./types";

import { pronounPreferenceSchema } from "./types";

export function validate(input: unknown): input is PronounPreference {
  return pronounPreferenceSchema.safeParse(input).success;
}

export function validateOrThrow(input: unknown): PronounPreference {
  return pronounPreferenceSchema.parse(input);
}

export function validationErrors(input: unknown): string[] {
  const result = pronounPreferenceSchema.safeParse(input);
  if (result.success) return [];
  return result.error.issues.map(
    (e) => `${e.path.map(String).join(".")}: ${e.message}`,
  );
}
