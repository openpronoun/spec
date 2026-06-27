"use client";

import {
  formatPronouns,
  getPronounSetValidationErrors,
  isStandardSet,
  validatePronounSet,
} from "./pronounUtils";
import type { PronounEntry } from "./pronounUtils";
import { useCallback, useMemo, useState } from "react";

/**
 * Options for the usePronounState hook
 */
export interface UsePronounStateOptions {
  /** Initial original text */
  initialOriginalText?: string;
  /** Initial pronoun sets */
  initialPronouns?: PronounEntry[];
}

/**
 * Return type for the usePronounState hook
 */
export interface UsePronounStateReturn {
  /** Add a pronoun entry to the end */
  addPronoun: (pronoun: PronounEntry) => void;
  /** Clear the original text */
  clearOriginalText: () => void;
  /** Clear all pronoun entries */
  clearPronouns: () => void;
  /** Validation errors across all pronoun entries */
  errors: string[];
  /** Formatted display string */
  formatted: string;
  /** Whether all pronoun entries are valid */
  isValid: boolean;
  /** The original freetext input */
  originalText: string | undefined;
  /** Current pronoun entries */
  pronouns: PronounEntry[];
  /** Remove a pronoun entry by index */
  removePronoun: (index: number) => void;
  /** Reorder pronoun entries by moving from one index to another */
  reorderPronouns: (fromIndex: number, toIndex: number) => void;
  /** Set the original text */
  setOriginalText: (text: string | undefined) => void;
  /** Replace all pronoun entries */
  setPronouns: (pronouns: PronounEntry[]) => void;
  /** Update a pronoun entry at a specific index */
  updatePronoun: (index: number, pronoun: PronounEntry) => void;
}

/**
 * Hook for managing pronoun state in forms
 *
 * @param initialValue - Optional initial pronoun sets
 * @returns Pronoun state management object
 */
export function usePronounState(
  initialValue: PronounEntry[] | UsePronounStateOptions = [],
): UsePronounStateReturn {
  const isOptions = !Array.isArray(initialValue);
  const initialPronouns = isOptions
    ? (initialValue.initialPronouns ?? [])
    : initialValue;
  const initialOriginalText = isOptions
    ? initialValue.initialOriginalText
    : undefined;

  const [pronouns, setPronounsState] = useState<PronounEntry[]>(initialPronouns);
  const [originalText, setOriginalTextState] = useState<string | undefined>(
    initialOriginalText,
  );

  const setPronouns = useCallback((newPronouns: PronounEntry[]) => {
    setPronounsState(newPronouns);
  }, []);

  const addPronoun = useCallback((pronoun: PronounEntry) => {
    setPronounsState((prev) => [...prev, pronoun]);
  }, []);

  const removePronoun = useCallback((index: number) => {
    setPronounsState((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const updatePronoun = useCallback((index: number, pronoun: PronounEntry) => {
    setPronounsState((prev) => {
      if (index < 0 || index >= prev.length) {
        return prev;
      }
      const next = [...prev];
      next[index] = pronoun;
      return next;
    });
  }, []);

  const reorderPronouns = useCallback((fromIndex: number, toIndex: number) => {
    setPronounsState((prev) => {
      if (
        fromIndex < 0 ||
        fromIndex >= prev.length ||
        toIndex < 0 ||
        toIndex >= prev.length
      ) {
        return prev;
      }
      const next = [...prev];
      const moved = next.splice(fromIndex, 1)[0];
      if (moved !== undefined) {
        next.splice(toIndex, 0, moved);
      }
      return next;
    });
  }, []);

  const clearPronouns = useCallback(() => {
    setPronounsState([]);
  }, []);

  const setOriginalText = useCallback((text: string | undefined) => {
    setOriginalTextState(text);
  }, []);

  const clearOriginalText = useCallback(() => {
    setOriginalTextState(undefined);
  }, []);

  const { errors, isValid } = useMemo(() => {
    if (pronouns.length === 0) {
      return { errors: [] as string[], isValid: true };
    }

    const allErrors: string[] = [];
    let allValid = true;

    for (const pronounSet of pronouns) {
      // Special preferences and custom entries are always structurally valid
      if (!isStandardSet(pronounSet)) continue;
      const valid = validatePronounSet(pronounSet);
      if (!valid) {
        allValid = false;
        const setErrors = getPronounSetValidationErrors(pronounSet);
        allErrors.push(...setErrors);
      }
    }

    return { errors: allErrors, isValid: allValid };
  }, [pronouns]);

  const formatted = useMemo(() => formatPronouns(pronouns), [pronouns]);

  return {
    addPronoun,
    clearOriginalText,
    clearPronouns,
    errors,
    formatted,
    isValid,
    originalText,
    pronouns,
    removePronoun,
    reorderPronouns,
    setOriginalText,
    setPronouns,
    updatePronoun,
  };
}

export default usePronounState;
