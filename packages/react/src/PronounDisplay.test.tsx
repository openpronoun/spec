import {
  COMMON_PRONOUN_SETS,
  PronounType,
  SPECIAL_PRONOUN_SETS,
} from "./pronounUtils";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";

import { PronounDisplay } from "./PronounDisplay";
import { darkTheme } from "./theme";

describe("PronounDisplay", () => {
  test("renders nothing when pronouns array is empty", () => {
    const { container } = render(<PronounDisplay pronouns={[]} />);
    expect(container.innerHTML).toBe("");
  });

  test("renders a single pronoun set in short format", () => {
    render(<PronounDisplay pronouns={[COMMON_PRONOUN_SETS.SHE]} />);
    expect(screen.getByText(/she\/her/i)).toBeDefined();
  });

  test("renders multiple pronoun sets with separator", () => {
    render(
      <PronounDisplay
        pronouns={[COMMON_PRONOUN_SETS.SHE, COMMON_PRONOUN_SETS.THEY]}
        separator=" / "
      />,
    );
    // Visible text uses slash notation; aria-label uses comma notation for screen readers
    expect(screen.getByText(/she\/her/i)).toBeDefined();
    // Accessible label uses comma-separated form (no slashes read aloud)
    expect(screen.getByLabelText(/she, her/i)).toBeDefined();
  });

  test("renders in long format", () => {
    render(
      <PronounDisplay format="long" pronouns={[COMMON_PRONOUN_SETS.HE]} />,
    );
    // Long format (expanded): subjective/objective/possessive_pronoun
    expect(screen.getByText(/he\/him\/his/i)).toBeDefined();
  });

  test("handles special pronoun types", () => {
    render(
      <PronounDisplay
        pronouns={[
          SPECIAL_PRONOUN_SETS.ANY,
          SPECIAL_PRONOUN_SETS.NONE,
          SPECIAL_PRONOUN_SETS.ASK,
        ]}
      />,
    );
    expect(screen.getByText(/any pronouns/i)).toBeDefined();
    expect(screen.getByText(/no pronouns/i)).toBeDefined();
    expect(screen.getByText(/ask me/i)).toBeDefined();
  });

  test("handles UNSPECIFIED special type", () => {
    render(
      <PronounDisplay
        pronouns={[{ type: PronounType.UNSPECIFIED }]}
      />,
    );
    expect(screen.getByText(/unspecified/i)).toBeDefined();
  });

  test("renders with custom aria-label", () => {
    render(
      <PronounDisplay
        aria-label="User pronouns"
        pronouns={[COMMON_PRONOUN_SETS.THEY]}
      />,
    );
    expect(screen.getByLabelText("User pronouns")).toBeDefined();
  });

  test("renders as a different element type", () => {
    const { container } = render(
      <PronounDisplay as="div" pronouns={[COMMON_PRONOUN_SETS.HE]} />,
    );
    expect(container.querySelector("div")).toBeDefined();
  });

  test("renders with dark theme", () => {
    render(
      <PronounDisplay pronouns={[COMMON_PRONOUN_SETS.SHE]} theme={darkTheme} />,
    );
    expect(screen.getByText(/she\/her/i)).toBeDefined();
  });

  test("renders with showExamples and expands on click", () => {
    render(
      <PronounDisplay pronouns={[COMMON_PRONOUN_SETS.THEY]} showExamples />,
    );

    // Should have a clickable element
    const button = screen.getByRole("button");
    expect(button).toBeDefined();

    // Click to expand examples
    fireEvent.click(button);

    // Should show example sentences in the expanded disclosure panel
    const tooltip = document.querySelector(".pronoun-display-tooltip");
    expect(tooltip).toBeDefined();
  });

  test("applies className prop", () => {
    const { container } = render(
      <PronounDisplay
        className="custom-class"
        pronouns={[COMMON_PRONOUN_SETS.HE]}
      />,
    );
    expect(container.querySelector(".custom-class")).toBeDefined();
  });

  test("applies classNames to sub-elements", () => {
    const { container } = render(
      <PronounDisplay
        classNames={{
          pronounText: "custom-text",
          pronounWrapper: "custom-wrapper",
          root: "custom-root",
        }}
        pronouns={[COMMON_PRONOUN_SETS.SHE]}
        showExamples={true}
      />,
    );
    expect(
      container.querySelector(".pronoun-display.custom-root"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-display-pronoun.custom-wrapper"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-display-text.custom-text"),
    ).toBeDefined();
  });

  test("classNames works alongside className prop", () => {
    const { container } = render(
      <PronounDisplay
        className="external-class"
        classNames={{
          root: "custom-root",
        }}
        pronouns={[COMMON_PRONOUN_SETS.SHE]}
      />,
    );
    const root = container.querySelector(
      ".pronoun-display.external-class.custom-root",
    );
    expect(root).toBeDefined();
  });

  test("renders with default classes when classNames not provided", () => {
    const { container } = render(
      <PronounDisplay
        pronouns={[COMMON_PRONOUN_SETS.SHE]}
        showExamples={true}
      />,
    );
    expect(container.querySelector(".pronoun-display")).toBeDefined();
    expect(container.querySelector(".pronoun-display-pronoun")).toBeDefined();
  });
});
