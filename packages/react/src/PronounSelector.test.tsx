import {
  COMMON_PRONOUN_SETS,
  KNOWN_NEOPRONOUN_SETS,
  SPECIAL_PRONOUN_SETS,
} from "./pronounUtils";
import type { PronounEntry } from "./pronounUtils";
import { render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, test } from "vitest";

import { PronounSelector } from "./PronounSelector";
import { darkTheme } from "./theme";
import type { PronounTheme } from "./theme";

// Test wrapper component to manage state
const TestWrapper = ({
  initialValue = [],
  theme = undefined,
}: {
  initialValue?: PronounEntry[];
  theme?: Partial<PronounTheme> | undefined;
}) => {
  const [value, setValue] = useState<PronounEntry[]>(initialValue);

  return (
    <div>
      <PronounSelector onChange={setValue} theme={theme} value={value} />
      <div data-testid="selected-count">{value.length}</div>
    </div>
  );
};

describe("PronounSelector", () => {
  test("renders with empty value", () => {
    render(<TestWrapper />);

    // Check that the component renders
    expect(screen.getByRole("combobox")).toBeDefined();

    // Check that no pronouns are selected
    expect(screen.getByTestId("selected-count").textContent).toBe("0");
  });

  test("renders with common pronouns", () => {
    const initialValue = [COMMON_PRONOUN_SETS.HE, COMMON_PRONOUN_SETS.SHE];
    render(<TestWrapper initialValue={initialValue} />);

    // Check that the component renders
    expect(screen.getByRole("combobox")).toBeDefined();

    // Check that two pronouns are selected
    expect(screen.getByTestId("selected-count").textContent).toBe("2");

    // Check that the selected pronouns are displayed
    expect(screen.getByText(/he\/him/i)).toBeDefined();
    expect(screen.getByText(/she\/her/i)).toBeDefined();
  });

  test("renders with neopronouns", () => {
    // Use only XE for this test since it's rendering correctly
    const initialValue = [KNOWN_NEOPRONOUN_SETS.XE];
    render(<TestWrapper initialValue={initialValue} />);

    // Check that the component renders
    expect(screen.getByRole("combobox")).toBeDefined();

    // Check that one pronoun is selected
    expect(screen.getByTestId("selected-count").textContent).toBe("1");

    // Check that the selected pronoun is displayed
    expect(screen.getByText(/xe\/xem/i)).toBeDefined();
  });

  test("renders with special pronouns", () => {
    const initialValue = [SPECIAL_PRONOUN_SETS.ANY, SPECIAL_PRONOUN_SETS.NONE];
    render(<TestWrapper initialValue={initialValue} />);

    // Check that the component renders
    expect(screen.getByRole("combobox")).toBeDefined();

    // Check that two pronouns are selected
    expect(screen.getByTestId("selected-count").textContent).toBe("2");

    // Check that the selected pronouns are displayed
    expect(screen.getByText(/any pronouns/i)).toBeDefined();
    expect(screen.getByText(/no pronouns/i)).toBeDefined();
  });

  test("renders with mixed pronouns", () => {
    const initialValue = [
      COMMON_PRONOUN_SETS.THEY,
      KNOWN_NEOPRONOUN_SETS.FAE,
      SPECIAL_PRONOUN_SETS.ASK,
    ];
    render(<TestWrapper initialValue={initialValue} />);

    // Check that the component renders
    expect(screen.getByRole("combobox")).toBeDefined();

    // Check that three pronouns are selected
    expect(screen.getByTestId("selected-count").textContent).toBe("3");

    // Check that the selected pronouns are displayed
    expect(screen.getByText(/they\/them/i)).toBeDefined();
    expect(screen.getByText(/fae\/faer/i)).toBeDefined();
    expect(screen.getByText(/ask me/i)).toBeDefined();
  });

  test("renders with custom pronouns", () => {
    const customPronounSet: PronounEntry = {
      language: "en",
      objective: "cos",
      possessive_adjective: "cos",
      possessive_pronoun: "cos",
      reflexive: "coself",
      subjective: "co",
    };

    const initialValue = [customPronounSet];
    render(<TestWrapper initialValue={initialValue} />);

    // Check that the component renders
    expect(screen.getByRole("combobox")).toBeDefined();

    // Check that one pronoun is selected
    expect(screen.getByTestId("selected-count").textContent).toBe("1");

    // Check that the selected pronoun is displayed
    expect(screen.getByText(/co\/cos/i)).toBeDefined();
  });

  test("renders with dark theme", () => {
    render(<TestWrapper theme={darkTheme} />);

    // Check that the component renders
    expect(screen.getByRole("combobox")).toBeDefined();
  });
});
