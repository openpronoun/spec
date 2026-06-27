"use client";

import {
  formatPronouns,
  isStandardSet,
  parsePronounPreference,
  validatePronounSet,
} from "./pronounUtils";
import type { PronounEntry } from "./pronounUtils";
import { useEffect, useMemo, useRef, useState } from "react";

/**
 * Options for the usePronounParser hook
 */
export interface UsePronounParserOptions {
  /** Debounce delay in milliseconds (default: 300) */
  debounceMs?: number;
}

/**
 * Return type for the usePronounParser hook
 */
export interface UsePronounParserReturn {
  /** Validation errors across all parsed pronoun sets */
  errors: string[];
  /** Formatted display string of parsed pronouns */
  formatted: string;
  /** Current raw input string */
  input: string;
  /** Whether all parsed pronoun sets are valid */
  isValid: boolean;
  /** The original text preserved from the input */
  originalText: string;
  /** Parsed pronoun entries from the input */
  parsed: PronounEntry[];
  /** Set the raw input string */
  setInput: (input: string) => void;
}

/**
 * Hook for parsing pronoun input on the fly with optional debouncing
 *
 * @param options - Parser options including debounce delay
 * @returns Parser state and controls
 */
export function usePronounParser(
  options?: UsePronounParserOptions,
): UsePronounParserReturn {
  const debounceMs = options?.debounceMs ?? 300;
  const [input, setInput] = useState("");
  const [debouncedInput, setDebouncedInput] = useState("");
  const timerRef = useRef<null | ReturnType<typeof setTimeout>>(null);

  useEffect(() => {
    if (debounceMs <= 0) {
      setDebouncedInput(input);
      return;
    }

    timerRef.current = setTimeout(() => {
      setDebouncedInput(input);
    }, debounceMs);

    return () => {
      if (timerRef.current !== null) {
        clearTimeout(timerRef.current);
      }
    };
  }, [input, debounceMs]);

  const preference = useMemo(
    () =>
      debouncedInput
        ? parsePronounPreference(debouncedInput)
        : { originalText: "", sets: [] },
    [debouncedInput],
  );

  const parsed = preference.sets;
  const originalText = preference.originalText ?? "";

  const formatted = useMemo(() => formatPronouns(parsed), [parsed]);

  const { errors, isValid } = useMemo(() => {
    if (parsed.length === 0) {
      return { errors: [] as string[], isValid: true };
    }

    const allErrors: string[] = [];
    let allValid = true;

    for (const pronounSet of parsed) {
      // Special preferences and custom entries are always structurally valid
      if (!isStandardSet(pronounSet)) continue;
      const valid = validatePronounSet(pronounSet);
      if (!valid) {
        allValid = false;
        allErrors.push(`Invalid pronoun set: ${formatPronouns([pronounSet])}`);
      }
    }

    return { errors: allErrors, isValid: allValid };
  }, [parsed]);

  return {
    errors,
    formatted,
    input,
    isValid,
    originalText,
    parsed,
    setInput,
  };
}

export default usePronounParser;
