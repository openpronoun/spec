import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { beforeEach, describe, expect, test, vi } from "vitest";

import EditorHeader from "./EditorHeader";
import { defaultIcons } from "./theme";

describe("EditorHeader", () => {
  const mockOnClose = vi.fn();

  beforeEach(() => {
    mockOnClose.mockReset();
  });

  test("renders with correct title for create mode", () => {
    render(
      <EditorHeader
        icons={defaultIcons}
        isEditing={false}
        onClose={mockOnClose}
        title="Create Pronoun Set"
        titleId="test-title"
      />,
    );

    expect(screen.getByText("Create Pronoun Set")).toBeDefined();
    expect(screen.getByRole("button", { name: "Close editor" })).toBeDefined();
  });

  test("renders with correct title for edit mode", () => {
    render(
      <EditorHeader
        icons={defaultIcons}
        isEditing={true}
        onClose={mockOnClose}
        title="Edit Pronoun Set"
        titleId="test-title"
      />,
    );

    expect(screen.getByText("Edit Pronoun Set")).toBeDefined();
  });

  test("calls onClose when close button is clicked", () => {
    render(
      <EditorHeader
        icons={defaultIcons}
        isEditing={false}
        onClose={mockOnClose}
        title="Create Pronoun Set"
        titleId="test-title"
      />,
    );

    const closeButton = screen.getByRole("button", { name: "Close editor" });
    fireEvent.click(closeButton);

    expect(mockOnClose).toHaveBeenCalledTimes(1);
  });

  test("stops propagation when close button is clicked", () => {
    const mockParentClick = vi.fn();

    render(
      <div
        onClick={mockParentClick}
        onKeyDown={() => {}}
        role="button"
        tabIndex={0}
      >
        <EditorHeader
          icons={defaultIcons}
          isEditing={false}
          onClose={mockOnClose}
          title="Create Pronoun Set"
          titleId="test-title"
        />
      </div>,
    );

    const closeButton = screen.getByRole("button", { name: "Close editor" });
    fireEvent.click(closeButton);

    expect(mockParentClick).not.toHaveBeenCalled();
  });

  test("renders custom close icon when provided", () => {
    const customIcons = { ...defaultIcons, close: "CUSTOM_CLOSE" };

    render(
      <EditorHeader
        icons={customIcons}
        isEditing={false}
        onClose={mockOnClose}
        title="Create Pronoun Set"
        titleId="test-title"
      />,
    );

    const closeButton = screen.getByRole("button", { name: "Close editor" });
    expect(closeButton.textContent).toContain("CUSTOM_CLOSE");
  });

  test("applies classNames to all elements", () => {
    const { container } = render(
      <EditorHeader
        classNames={{
          closeButton: "custom-close",
          root: "custom-root",
          title: "custom-title",
        }}
        icons={defaultIcons}
        isEditing={true}
        onClose={vi.fn()}
        title="Test"
        titleId="test-title"
      />,
    );
    expect(
      container.querySelector(".pronoun-detail-editor-header.custom-root"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-detail-editor-title.custom-title"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-detail-editor-close.custom-close"),
    ).toBeDefined();
  });

  test("renders without classNames prop", () => {
    const { container } = render(
      <EditorHeader
        icons={defaultIcons}
        isEditing={false}
        onClose={vi.fn()}
        title="Test"
        titleId="test-title"
      />,
    );
    expect(
      container.querySelector(".pronoun-detail-editor-header"),
    ).toBeDefined();
  });
});
