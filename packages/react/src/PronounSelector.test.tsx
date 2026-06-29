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

// Test wrapper managing state
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

    // Ark UI Combobox.Input carries role="combobox"
    expect(screen.getByRole("combobox")).toBeDefined();
    expect(screen.getByTestId("selected-count").textContent).toBe("0");
  });

  test("renders with common pronouns", () => {
    const initialValue = [COMMON_PRONOUN_SETS.HE, COMMON_PRONOUN_SETS.SHE];
    render(<TestWrapper initialValue={initialValue} />);

    expect(screen.getByRole("combobox")).toBeDefined();
    expect(screen.getByTestId("selected-count").textContent).toBe("2");

    // Selected pronouns are rendered as tags in the control (also appear in hidden listbox)
    expect(screen.getAllByText(/he\/him/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/she\/her/i).length).toBeGreaterThan(0);
  });

  test("renders with neopronouns", () => {
    const initialValue = [KNOWN_NEOPRONOUN_SETS.XE];
    render(<TestWrapper initialValue={initialValue} />);

    expect(screen.getByRole("combobox")).toBeDefined();
    expect(screen.getByTestId("selected-count").textContent).toBe("1");
    expect(screen.getAllByText(/xe\/xem/i).length).toBeGreaterThan(0);
  });

  test("renders with special pronouns", () => {
    const initialValue = [SPECIAL_PRONOUN_SETS.ANY, SPECIAL_PRONOUN_SETS.NONE];
    render(<TestWrapper initialValue={initialValue} />);

    expect(screen.getByRole("combobox")).toBeDefined();
    expect(screen.getByTestId("selected-count").textContent).toBe("2");
    expect(screen.getAllByText(/any pronouns/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/no pronouns/i).length).toBeGreaterThan(0);
  });

  test("renders with mixed pronouns", () => {
    const initialValue = [
      COMMON_PRONOUN_SETS.THEY,
      KNOWN_NEOPRONOUN_SETS.FAE,
      SPECIAL_PRONOUN_SETS.ASK,
    ];
    render(<TestWrapper initialValue={initialValue} />);

    expect(screen.getByRole("combobox")).toBeDefined();
    expect(screen.getByTestId("selected-count").textContent).toBe("3");
    expect(screen.getAllByText(/they\/them/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/fae\/faer/i).length).toBeGreaterThan(0);
    expect(screen.getAllByText(/ask me/i).length).toBeGreaterThan(0);
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

    render(<TestWrapper initialValue={[customPronounSet]} />);

    expect(screen.getByRole("combobox")).toBeDefined();
    expect(screen.getByTestId("selected-count").textContent).toBe("1");
    expect(screen.getAllByText(/co\/cos/i).length).toBeGreaterThan(0);
  });

  test("renders with dark theme", () => {
    render(<TestWrapper theme={darkTheme} />);
    expect(screen.getByRole("combobox")).toBeDefined();
  });
});
