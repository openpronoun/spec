import { COMMON_PRONOUN_SETS, SPECIAL_PRONOUN_SETS } from "./pronounUtils";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, test, vi } from "vitest";

import { PronounBadge } from "./PronounBadge";
import { darkTheme, defaultIcons } from "./theme";

const SHE_SET = COMMON_PRONOUN_SETS.SHE!;
const THEY_SET = COMMON_PRONOUN_SETS.THEY!;
const ANY_SET = SPECIAL_PRONOUN_SETS.ANY!;

describe("PronounBadge", () => {
  test("renders a pronoun set in short format", () => {
    render(<PronounBadge pronoun={SHE_SET} />);
    expect(screen.getByText(/she\/her/i)).toBeDefined();
  });

  test("renders in medium format", () => {
    render(<PronounBadge format="medium" pronoun={SHE_SET} />);
    // Medium (expanded) format: subjective/objective/possessive_pronoun
    expect(screen.getByText(/she\/her\/hers/i)).toBeDefined();
  });

  test("handles special pronoun types", () => {
    render(<PronounBadge pronoun={ANY_SET} />);
    expect(screen.getByText(/any pronouns/i)).toBeDefined();
  });

  test("renders as a button when onClick is provided", () => {
    const handleClick = vi.fn();
    render(<PronounBadge onClick={handleClick} pronoun={THEY_SET} />);

    const button = screen.getByRole("button");
    fireEvent.click(button);
    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("renders remove button when removable", () => {
    const handleRemove = vi.fn();
    render(
      <PronounBadge onRemove={handleRemove} pronoun={SHE_SET} removable />,
    );

    const removeButton = screen.getByLabelText(/remove/i);
    expect(removeButton).toBeDefined();

    fireEvent.click(removeButton);
    expect(handleRemove).toHaveBeenCalledTimes(1);
  });

  test("renders as span when no onClick", () => {
    const { container } = render(<PronounBadge pronoun={SHE_SET} />);
    // Should not have a button role at the top level
    expect(container.querySelector("span")).toBeDefined();
  });

  test("applies className prop", () => {
    const { container } = render(
      <PronounBadge className="custom-badge" pronoun={SHE_SET} />,
    );
    expect(container.querySelector(".custom-badge")).toBeDefined();
  });

  test("renders with dark theme", () => {
    render(<PronounBadge pronoun={SHE_SET} theme={darkTheme} />);
    expect(screen.getByText(/she\/her/i)).toBeDefined();
  });

  test("renders custom remove icon when provided", () => {
    const handleRemove = vi.fn();
    render(
      <PronounBadge
        icons={{ ...defaultIcons, remove: "CUSTOM_REMOVE" }}
        onRemove={handleRemove}
        pronoun={SHE_SET}
        removable
      />,
    );

    const removeButton = screen.getByLabelText(/remove/i);
    expect(removeButton.textContent).toContain("CUSTOM_REMOVE");
  });

  test("applies classNames to sub-elements", () => {
    const { container } = render(
      <PronounBadge
        classNames={{
          removeButton: "custom-remove",
          root: "custom-root",
          text: "custom-text",
        }}
        onRemove={vi.fn()}
        pronoun={SHE_SET}
        removable={true}
      />,
    );
    expect(container.querySelector(".pronoun-badge.custom-root")).toBeDefined();
    expect(
      container.querySelector(".pronoun-badge-text.custom-text"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-badge-remove.custom-remove"),
    ).toBeDefined();
  });

  test("classNames works alongside className prop", () => {
    const { container } = render(
      <PronounBadge
        className="external-class"
        classNames={{
          root: "custom-root",
        }}
        pronoun={SHE_SET}
      />,
    );
    const root = container.querySelector(
      ".pronoun-badge.external-class.custom-root",
    );
    expect(root).toBeDefined();
  });

  test("applies classNames on clickable variant", () => {
    const { container } = render(
      <PronounBadge
        classNames={{
          root: "custom-root",
          text: "custom-text",
        }}
        onClick={vi.fn()}
        pronoun={SHE_SET}
      />,
    );
    expect(
      container.querySelector("button.pronoun-badge.custom-root"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-badge-text.custom-text"),
    ).toBeDefined();
  });
});
