import type { PronounSet } from "./pronounUtils";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import EditorFooter from "./EditorFooter";

describe("EditorFooter", () => {
  // Test data
  const mockOnSave = vi.fn();
  const mockOnCancel = vi.fn();

  const validPronounSet: PronounSet = {
    language: "en",
    objective: "them",
    possessive_adjective: "their",
    possessive_pronoun: "theirs",
    reflexive: "themself",
    subjective: "they",
  };

  const invalidPronounSet: PronounSet = {
    language: "en",
    objective: "",
    possessive_adjective: "",
    possessive_pronoun: "",
    reflexive: "",
    subjective: "",
  };

  // Reset mocks before each test
  beforeEach(() => {
    mockOnSave.mockReset();
    mockOnCancel.mockReset();
  });

  test("renders save and cancel buttons", () => {
    render(
      <EditorFooter
        onCancel={mockOnCancel}
        onSave={mockOnSave}
        pronounSet={validPronounSet}
      />,
    );

    expect(
      screen.getByRole("button", { name: "Save pronoun set" }),
    ).toBeDefined();
    expect(
      screen.getByRole("button", { name: "Cancel editing" }),
    ).toBeDefined();
  });

  test("calls onSave when save button is clicked", () => {
    render(
      <EditorFooter
        onCancel={mockOnCancel}
        onSave={mockOnSave}
        pronounSet={validPronounSet}
      />,
    );

    const saveButton = screen.getByRole("button", { name: "Save pronoun set" });
    fireEvent.click(saveButton);

    expect(mockOnSave).toHaveBeenCalledTimes(1);
  });

  test("calls onCancel when cancel button is clicked", () => {
    render(
      <EditorFooter
        onCancel={mockOnCancel}
        onSave={mockOnSave}
        pronounSet={validPronounSet}
      />,
    );

    const cancelButton = screen.getByRole("button", { name: "Cancel editing" });
    fireEvent.click(cancelButton);

    expect(mockOnCancel).toHaveBeenCalledTimes(1);
  });

  test("disables save button when required fields are empty", () => {
    render(
      <EditorFooter
        onCancel={mockOnCancel}
        onSave={mockOnSave}
        pronounSet={invalidPronounSet}
      />,
    );

    const saveButton = screen.getByRole("button", {
      name: "Save pronoun set",
    });
    expect((saveButton as HTMLButtonElement).disabled).toBe(true);

    // Clicking the disabled button should not call onSave
    fireEvent.click(saveButton);
    expect(mockOnSave).not.toHaveBeenCalled();
  });

  test("stops propagation when buttons are clicked", () => {
    const mockParentClick = vi.fn();

    render(
      <div
        onClick={mockParentClick}
        onKeyDown={() => {}}
        role="button"
        tabIndex={0}
      >
        <EditorFooter
          onCancel={mockOnCancel}
          onSave={mockOnSave}
          pronounSet={validPronounSet}
        />
      </div>,
    );

    const saveButton = screen.getByRole("button", { name: "Save pronoun set" });
    fireEvent.click(saveButton);

    expect(mockParentClick).not.toHaveBeenCalled();

    const cancelButton = screen.getByRole("button", { name: "Cancel editing" });
    fireEvent.click(cancelButton);

    expect(mockParentClick).not.toHaveBeenCalled();
  });

  test("applies classNames to all elements", () => {
    const { container } = render(
      <EditorFooter
        classNames={{
          cancelButton: "custom-cancel",
          root: "custom-root",
          saveButton: "custom-save",
        }}
        onCancel={vi.fn()}
        onSave={vi.fn()}
        pronounSet={validPronounSet}
      />,
    );
    expect(
      container.querySelector(".pronoun-detail-editor-footer.custom-root"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-detail-editor-cancel.custom-cancel"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-detail-editor-save.custom-save"),
    ).toBeDefined();
  });

  test("renders without classNames prop", () => {
    const { container } = render(
      <EditorFooter
        onCancel={vi.fn()}
        onSave={vi.fn()}
        pronounSet={validPronounSet}
      />,
    );
    expect(
      container.querySelector(".pronoun-detail-editor-footer"),
    ).toBeDefined();
  });
});
