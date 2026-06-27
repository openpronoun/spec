import { COMMON_PRONOUN_SETS } from "./pronounUtils";
import type { PronounEntry } from "./pronounUtils";
import { render, screen } from "@testing-library/react";
import React, { useState } from "react";
import { describe, expect, test } from "vitest";

import type { PronounFormClassNames } from "./classNames";
import { PronounForm } from "./PronounForm";
import { darkTheme } from "./theme";

const HE_SET = COMMON_PRONOUN_SETS.HE!;

// Controlled wrapper
const ControlledWrapper = ({
  initialValue = [],
  ...props
}: {
  classNames?: PronounFormClassNames;
  disabled?: boolean;
  error?: string;
  helperText?: string;
  initialValue?: PronounEntry[];
  label?: string;
  previewFormat?: "long" | "medium" | "short";
  required?: boolean;
  showPreview?: boolean;
  theme?: Parameters<typeof PronounForm>[0]["theme"];
}) => {
  const [value, setValue] = useState<PronounEntry[]>(initialValue);
  return <PronounForm onChange={setValue} value={value} {...props} />;
};

describe("PronounForm", () => {
  test("renders with default label", () => {
    render(<ControlledWrapper />);
    expect(screen.getByText("Pronouns")).toBeDefined();
  });

  test("renders with custom label", () => {
    render(<ControlledWrapper label="Your Pronouns" />);
    expect(screen.getByText("Your Pronouns")).toBeDefined();
  });

  test("renders required indicator", () => {
    render(<ControlledWrapper required />);
    expect(screen.getByText("*")).toBeDefined();
  });

  test("renders helper text", () => {
    render(<ControlledWrapper helperText="Select your preferred pronouns" />);
    expect(screen.getByText("Select your preferred pronouns")).toBeDefined();
  });

  test("renders error message", () => {
    render(<ControlledWrapper error="Pronouns are required" />);
    expect(screen.getByText("Pronouns are required")).toBeDefined();
  });

  test("error message takes precedence over helper text", () => {
    render(
      <ControlledWrapper
        error="Pronouns are required"
        helperText="Select your preferred pronouns"
      />,
    );
    expect(screen.getByText("Pronouns are required")).toBeDefined();
    expect(screen.queryByText("Select your preferred pronouns")).toBeNull();
  });

  test("renders with preview when showPreview is true and has value", () => {
    render(<ControlledWrapper initialValue={[HE_SET]} showPreview />);
    expect(screen.getByText("Preview:")).toBeDefined();
  });

  test("does not render preview when no value", () => {
    render(<ControlledWrapper showPreview />);
    expect(screen.queryByText("Preview:")).toBeNull();
  });

  test("renders with dark theme", () => {
    render(<ControlledWrapper theme={darkTheme} />);
    expect(screen.getByText("Pronouns")).toBeDefined();
  });

  test("renders in uncontrolled mode", () => {
    render(<PronounForm />);
    expect(screen.getByText("Pronouns")).toBeDefined();
  });

  test("renders the PronounSelector", () => {
    render(<ControlledWrapper />);
    // PronounSelector renders a combobox
    expect(screen.getByRole("combobox")).toBeDefined();
  });

  test("applies classNames to form elements", () => {
    const { container } = render(
      <PronounForm
        classNames={{
          errorMessage: "custom-error",
          helperText: "custom-helper",
          label: "custom-label",
          root: "custom-root",
        }}
        error="Error message"
        helperText="Help text"
        label="Pronouns"
      />,
    );
    expect(container.querySelector(".pronoun-form.custom-root")).toBeDefined();
    expect(
      container.querySelector(".pronoun-form-label.custom-label"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-form-error.custom-error"),
    ).toBeDefined();
  });

  test("applies classNames to preview elements", () => {
    const { container } = render(
      <ControlledWrapper
        classNames={{
          previewContainer: "custom-preview",
          previewLabel: "custom-preview-label",
        }}
        initialValue={[HE_SET]}
        showPreview={true}
      />,
    );
    expect(
      container.querySelector(".pronoun-form-preview.custom-preview"),
    ).toBeDefined();
    expect(
      container.querySelector(
        ".pronoun-form-preview-label.custom-preview-label",
      ),
    ).toBeDefined();
  });

  test("classNames works alongside className prop", () => {
    const { container } = render(
      <PronounForm
        className="external-class"
        classNames={{
          root: "custom-root",
        }}
        label="Pronouns"
      />,
    );
    expect(
      container.querySelector(".pronoun-form.external-class.custom-root"),
    ).toBeDefined();
  });

  test("renders with default classes when classNames not provided", () => {
    const { container } = render(
      <PronounForm helperText="Help" label="Pronouns" />,
    );
    expect(container.querySelector(".pronoun-form")).toBeDefined();
    expect(container.querySelector(".pronoun-form-label")).toBeDefined();
    expect(container.querySelector(".pronoun-form-helper")).toBeDefined();
  });
});
