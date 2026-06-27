import type { PronounPreference } from "./types";

export function filterByAudience(
  preference: PronounPreference,
  audience: string,
): PronounPreference {
  if (audience !== "public") return preference;
  return preference.filter((entry) => {
    const p =
      "privacy" in entry
        ? entry.privacy
        : "pvc" in entry
          ? (entry as { pvc?: number }).pvc
          : undefined;
    return p === undefined || p < 1;
  });
}
