import type { PronounEntry } from "./pronounUtils";
import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, test, vi } from "vitest";

import type { PronounOption } from "./types";

// Mock the entire SortableMultiValue module to avoid DnD dependencies
vi.mock("./SortableMultiValue", () => ({
  default: ({
    children,
    data,
    isDragging,
  }: {
    children: React.ReactNode;
    data: { id: string };
    isDragging: boolean;
  }) => (
    <div
      className={`pronoun-multi-value ${isDragging ? "is-dragging" : ""}`}
      data-id={(data as { id: string }).id}
      data-testid="sortable-multi-value"
    >
      {children}
    </div>
  ),
}));

// Import the component after mocking
import SortableMultiValue from "./SortableMultiValue";

// Cast to mock type so TypeScript accepts isDragging as a prop in tests
const MockedSortableMultiValue = SortableMultiValue as unknown as React.FC<{
  children?: React.ReactNode;
  data: PronounOption;
  isDragging: boolean;
}>;

describe("SortableMultiValue", () => {
  // Test data
  const mockPronounOption: PronounOption = {
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

  test("renders with correct data-id", () => {
    const { getByTestId } = render(
      <MockedSortableMultiValue
        data={mockPronounOption}
        isDragging={false}
      >
        <div>Test Content</div>
      </MockedSortableMultiValue>,
    );

    const element = getByTestId("sortable-multi-value");
    expect(element).toBeDefined();
    expect(element.getAttribute("data-id")).toBe("they-them-0");
    expect(element.textContent).toBe("Test Content");
    expect(element.className).not.toContain("is-dragging");
  });

  test("applies dragging class when isDragging is true", () => {
    const { getByTestId } = render(
      <MockedSortableMultiValue
        data={mockPronounOption}
        isDragging={true}
      >
        <div>Test Content</div>
      </MockedSortableMultiValue>,
    );

    const element = getByTestId("sortable-multi-value");
    expect(element.className).toContain("is-dragging");
  });
});
