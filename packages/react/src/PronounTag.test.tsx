import type { PronounEntry } from "./pronounUtils";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import type { GroupBase, MultiValueGenericProps } from "react-select";
import { describe, expect, test, vi } from "vitest";

import {
  CustomMultiValueContainer,
  CustomMultiValueLabel,
  CustomMultiValueRemove,
} from "./PronounTag";
import { defaultIcons } from "./theme";
import type { PronounOption } from "./types";

describe("PronounTag Components", () => {
  // Test data
  const mockPronounOption = {
    id: "they-them-0",
    label: "they/them",
    value: {
      language: "en",
      objective: "them",
      possessive_adjective: "their",
      possessive_pronoun: "theirs",
      reflexive: "themself",
      subjective: "they",
    } as PronounEntry,
  };

  const mockSpecialPronounOption = {
    id: "any-0",
    label: "Any pronouns",
    value: {
      type: "any",
    } as PronounEntry,
  };

  describe("CustomMultiValueContainer", () => {
    test("renders with correct class and data-id", () => {
      const mockProps = {
        children: <div>Test Content</div>,
        data: mockPronounOption,
        innerProps: {},
        selectProps: {},
      } as unknown as MultiValueGenericProps<
        PronounOption,
        true,
        GroupBase<PronounOption>
      >;

      const { container } = render(
        <CustomMultiValueContainer {...mockProps} />,
      );

      const containerElement = container.firstChild as HTMLElement;
      expect(containerElement.classList.contains("pronoun-tag-container")).toBe(
        true,
      );
      expect(containerElement.getAttribute("data-id")).toBe("they-them-0");
      expect(containerElement.textContent).toBe("Test Content");
    });
  });

  describe("CustomMultiValueLabel", () => {
    test("renders with drag handle and children", () => {
      // Create a minimal mock of the required props
      const mockSelectProps = {
        icons: defaultIcons,
      } as Record<string, unknown>;

      const { container } = render(
        <CustomMultiValueLabel
          children={<span>they/them</span>}
          data={mockPronounOption}
          innerProps={{}}
          selectProps={mockSelectProps as never}
        />,
      );

      const labelElement = container.querySelector(".pronoun-tag-label");
      expect(labelElement).toBeDefined();

      const dragHandle = container.querySelector(".pronoun-drag-handle");
      expect(dragHandle).toBeDefined();
      expect(dragHandle).toBeTruthy();

      expect(container.textContent).toContain("they/them");
    });

    test("renders custom drag handle icon from selectProps", () => {
      const mockSelectProps = {
        icons: { ...defaultIcons, dragHandle: "CUSTOM_DRAG" },
      } as Record<string, unknown>;

      const { container } = render(
        <CustomMultiValueLabel
          children={<span>they/them</span>}
          data={mockPronounOption}
          innerProps={{}}
          selectProps={mockSelectProps as never}
        />,
      );

      const dragHandle = container.querySelector(".pronoun-drag-handle");
      expect(dragHandle?.textContent).toContain("CUSTOM_DRAG");
    });
  });

  describe("CustomMultiValueRemove", () => {
    test("renders edit button for specific pronoun sets", () => {
      const onEditMock = vi.fn();

      // Create a minimal mock of the required props
      const mockSelectProps = {
        icons: defaultIcons,
      } as Record<string, unknown>;

      const { container } = render(
        <CustomMultiValueRemove
          data={mockPronounOption}
          innerProps={{}}
          onEditPronounSet={onEditMock}
          selectProps={mockSelectProps as never}
        />,
      );

      const editButton = container.querySelector(".pronoun-tag-edit");
      expect(editButton).toBeDefined();

      // Test click handler
      fireEvent.click(editButton as HTMLElement);
      expect(onEditMock).toHaveBeenCalledWith(mockPronounOption.value);

      // Test keyboard handler
      fireEvent.keyDown(editButton as HTMLElement, { key: "Enter" });
      expect(onEditMock).toHaveBeenCalledTimes(2);

      fireEvent.keyDown(editButton as HTMLElement, { key: " " });
      expect(onEditMock).toHaveBeenCalledTimes(3);
    });

    test("does not render edit button for special pronoun sets", () => {
      const onEditMock = vi.fn();

      // Create a minimal mock of the required props
      const mockSelectProps = {
        icons: defaultIcons,
      } as Record<string, unknown>;

      const { container } = render(
        <CustomMultiValueRemove
          data={mockSpecialPronounOption}
          innerProps={{}}
          onEditPronounSet={onEditMock}
          selectProps={mockSelectProps as never}
        />,
      );

      const editButton = container.querySelector(".pronoun-tag-edit");
      expect(editButton).toBeNull();
    });

    test("renders custom edit icon from selectProps", () => {
      const onEditMock = vi.fn();

      const mockSelectProps = {
        icons: { ...defaultIcons, edit: "CUSTOM_EDIT" },
      } as Record<string, unknown>;

      const { container } = render(
        <CustomMultiValueRemove
          data={mockPronounOption}
          innerProps={{}}
          onEditPronounSet={onEditMock}
          selectProps={mockSelectProps as never}
        />,
      );

      expect(container.textContent).toContain("CUSTOM_EDIT");
    });

    test("renders custom remove icon from selectProps", () => {
      const onEditMock = vi.fn();

      const mockSelectProps = {
        icons: { ...defaultIcons, remove: "CUSTOM_REMOVE" },
      } as Record<string, unknown>;

      const { container } = render(
        <CustomMultiValueRemove
          data={mockPronounOption}
          innerProps={{}}
          onEditPronounSet={onEditMock}
          selectProps={mockSelectProps as never}
        />,
      );

      expect(container.textContent).toContain("CUSTOM_REMOVE");
    });

    test("renders custom remove icon for non-specific pronoun sets", () => {
      const onEditMock = vi.fn();

      const mockSelectProps = {
        icons: { ...defaultIcons, remove: "CUSTOM_REMOVE" },
      } as Record<string, unknown>;

      const { container } = render(
        <CustomMultiValueRemove
          data={mockSpecialPronounOption}
          innerProps={{}}
          onEditPronounSet={onEditMock}
          selectProps={mockSelectProps as never}
        />,
      );

      expect(container.textContent).toContain("CUSTOM_REMOVE");
    });

    test("applies tagClassNames from selectProps", () => {
      const onEditMock = vi.fn();

      const mockSelectProps = {
        icons: defaultIcons,
        tagClassNames: {
          removeButton: "custom-remove",
        },
      } as Record<string, unknown>;

      const { container } = render(
        <CustomMultiValueRemove
          data={mockSpecialPronounOption}
          innerProps={{}}
          onEditPronounSet={onEditMock}
          selectProps={mockSelectProps as never}
        />,
      );

      expect(
        container.querySelector(".pronoun-tag-remove.custom-remove"),
      ).toBeDefined();
    });

    test("applies tagClassNames to actions and buttons for specific pronoun sets", () => {
      const onEditMock = vi.fn();

      const mockSelectProps = {
        icons: defaultIcons,
        tagClassNames: {
          actions: "custom-actions",
          editButton: "custom-edit",
          removeButton: "custom-remove",
        },
      } as Record<string, unknown>;

      const { container } = render(
        <CustomMultiValueRemove
          data={mockPronounOption}
          innerProps={{}}
          onEditPronounSet={onEditMock}
          selectProps={mockSelectProps as never}
        />,
      );

      expect(
        container.querySelector(".pronoun-tag-actions.custom-actions"),
      ).toBeDefined();
      expect(
        container.querySelector(".pronoun-tag-edit.custom-edit"),
      ).toBeDefined();
      expect(
        container.querySelector(".pronoun-tag-remove.custom-remove"),
      ).toBeDefined();
    });
  });

  describe("CustomMultiValueContainer - tagClassNames", () => {
    test("applies tagClassNames from selectProps", () => {
      const mockProps = {
        children: <div>Test Content</div>,
        data: mockPronounOption,
        innerProps: {},
        selectProps: {
          tagClassNames: {
            container: "custom-container",
          },
        },
      } as unknown as MultiValueGenericProps<
        PronounOption,
        true,
        GroupBase<PronounOption>
      >;

      const { container } = render(
        <CustomMultiValueContainer {...mockProps} />,
      );

      expect(
        container.querySelector(".pronoun-tag-container.custom-container"),
      ).toBeDefined();
    });
  });

  describe("CustomMultiValueLabel - tagClassNames", () => {
    test("applies tagClassNames from selectProps", () => {
      const mockSelectProps = {
        icons: defaultIcons,
        tagClassNames: {
          dragHandle: "custom-drag",
          label: "custom-label",
        },
      } as Record<string, unknown>;

      const { container } = render(
        <CustomMultiValueLabel
          children={<span>they/them</span>}
          data={mockPronounOption}
          innerProps={{}}
          selectProps={mockSelectProps as never}
        />,
      );

      expect(
        container.querySelector(".pronoun-tag-label.custom-label"),
      ).toBeDefined();
      expect(
        container.querySelector(".pronoun-drag-handle.custom-drag"),
      ).toBeDefined();
    });
  });
});
