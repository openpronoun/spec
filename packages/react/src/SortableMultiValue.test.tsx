import type { PronounEntry } from "./pronounUtils";
import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, test, vi } from "vitest";

import type { PronounOption } from "./types";

// Mock dnd-kit to avoid needing a DndContext in tests
vi.mock("@dnd-kit/sortable", () => ({
  useSortable: () => ({
    attributes: {},
    isDragging: false,
    listeners: {},
    setNodeRef: () => {},
    transform: null,
    transition: undefined,
  }),
}));

import { SortableMultiValue } from "./SortableMultiValue";
import { defaultIcons } from "./theme";

const mockOption: PronounOption = {
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

describe("SortableMultiValue", () => {
  test("renders pronoun-multi-value wrapper", () => {
    const { container } = render(
      <SortableMultiValue icons={defaultIcons} id="they-them-0" option={mockOption} />,
    );
    expect(container.querySelector(".pronoun-multi-value")).toBeTruthy();
  });

  test("renders inner PronounTag with correct data-id", () => {
    const { container } = render(
      <SortableMultiValue icons={defaultIcons} id="they-them-0" option={mockOption} />,
    );
    expect(container.querySelector(".pronoun-tag-container")?.getAttribute("data-id")).toBe("they-them-0");
  });

  test("applies sortable root className", () => {
    const { container } = render(
      <SortableMultiValue
        classNames={{ root: "custom-root" }}
        icons={defaultIcons}
        id="they-them-0"
        option={mockOption}
      />,
    );
    expect(container.querySelector(".pronoun-multi-value.custom-root")).toBeTruthy();
  });

  test("forwards onEdit and onRemove to PronounTag", () => {
    const onEdit = vi.fn();
    const onRemove = vi.fn();
    const { container } = render(
      <SortableMultiValue
        icons={defaultIcons}
        id="they-them-0"
        onEdit={onEdit}
        onRemove={onRemove}
        option={mockOption}
      />,
    );
    // Edit and remove buttons should be present (standard set + onEdit provided)
    expect(container.querySelector(".pronoun-tag-edit")).toBeTruthy();
    expect(container.querySelector(".pronoun-tag-remove")).toBeTruthy();
  });

  test("forwards tagClassNames to PronounTag", () => {
    const { container } = render(
      <SortableMultiValue
        icons={defaultIcons}
        id="they-them-0"
        option={mockOption}
        tagClassNames={{ container: "custom-tag-container" }}
      />,
    );
    expect(container.querySelector(".pronoun-tag-container.custom-tag-container")).toBeTruthy();
  });
});
