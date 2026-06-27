import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import FormField from "./FormField";

describe("FormField", () => {
  // Test data
  const mockOnChange = vi.fn();

  // Reset mocks before each test
  beforeEach(() => {
    mockOnChange.mockReset();
  });

  describe("Text input field", () => {
    test("renders with correct label and description", () => {
      render(
        <FormField
          description="Test description"
          fieldName="subjective"
          id="test-field"
          label="Test Label"
          onChange={mockOnChange}
          value="Test value"
        />,
      );

      expect(screen.getByLabelText("Test Label")).toBeDefined();
      expect(screen.getByText("Test description")).toBeDefined();
      expect(screen.getByDisplayValue("Test value")).toBeDefined();
    });

    test("calls onChange when input value changes", () => {
      render(
        <FormField
          fieldName="subjective"
          id="test-field"
          label="Test Label"
          onChange={mockOnChange}
          value="Test value"
        />,
      );

      const input = screen.getByLabelText("Test Label");
      fireEvent.change(input, { target: { value: "New value" } });

      expect(mockOnChange).toHaveBeenCalledWith("subjective", "New value");
    });

    test("applies required attribute correctly", () => {
      render(
        <FormField
          fieldName="subjective"
          id="test-field"
          label="Test Label"
          onChange={mockOnChange}
          required={true}
          value="Test value"
        />,
      );

      const input = screen.getByLabelText("Test Label");
      expect(input.getAttribute("aria-required")).toBe("true");
    });

    test("applies placeholder correctly", () => {
      render(
        <FormField
          fieldName="subjective"
          id="test-field"
          label="Test Label"
          onChange={mockOnChange}
          placeholder="Test placeholder"
          value=""
        />,
      );

      const input = screen.getByLabelText("Test Label");
      expect(input.getAttribute("placeholder")).toBe("Test placeholder");
    });
  });

  describe("Select field", () => {
    test("renders select with options", () => {
      render(
        <FormField
          fieldName="language"
          id="test-select"
          label="Test Select"
          onChange={mockOnChange}
          type="select"
          value="option1"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </FormField>,
      );

      expect(screen.getByLabelText("Test Select")).toBeDefined();
      expect(screen.getByRole("option", { name: "Option 1" })).toBeDefined();
      expect(screen.getByRole("option", { name: "Option 2" })).toBeDefined();
    });

    test("calls onChange when select value changes", () => {
      render(
        <FormField
          fieldName="language"
          id="test-select"
          label="Test Select"
          onChange={mockOnChange}
          type="select"
          value="option1"
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
        </FormField>,
      );

      const select = screen.getByLabelText("Test Select");
      fireEvent.change(select, { target: { value: "option2" } });

      expect(mockOnChange).toHaveBeenCalledWith("language", "option2");
    });
  });

  test("applies classNames to all elements", () => {
    const { container } = render(
      <FormField
        classNames={{
          description: "custom-desc",
          input: "custom-input",
          label: "custom-label",
          root: "custom-root",
        }}
        description="Help text"
        fieldName="subjective"
        id="test-field"
        label="Test Label"
        onChange={vi.fn()}
        value="test"
      />,
    );
    expect(
      container.querySelector(".pronoun-detail-editor-field.custom-root"),
    ).toBeDefined();
    expect(
      container.querySelector(
        ".pronoun-detail-editor-field-label.custom-label",
      ),
    ).toBeDefined();
    expect(
      container.querySelector(
        ".pronoun-detail-editor-field-input.custom-input",
      ),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-detail-editor-field-desc.custom-desc"),
    ).toBeDefined();
  });

  test("renders without classNames prop", () => {
    const { container } = render(
      <FormField
        fieldName="subjective"
        id="test-field"
        label="Test Label"
        onChange={vi.fn()}
        value="test"
      />,
    );
    expect(
      container.querySelector(".pronoun-detail-editor-field"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-detail-editor-field-label"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-detail-editor-field-input"),
    ).toBeDefined();
  });
});
