import { render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";

import ExamplesList from "./ExamplesList";

describe("ExamplesList", () => {
  // Test data
  const exampleSentences = [
    "They went to the store.",
    "I saw them yesterday.",
    "Their book is on the table.",
  ];

  test("renders example sentences", () => {
    render(<ExamplesList examples={exampleSentences} />);

    // Check that the heading is rendered
    expect(screen.getByText("Example Sentences")).toBeDefined();

    // Check that all example sentences are rendered
    exampleSentences.forEach((sentence) => {
      expect(screen.getByText(sentence)).toBeDefined();
    });
  });

  test("applies classNames to all elements", () => {
    const { container } = render(
      <ExamplesList
        classNames={{
          heading: "custom-heading",
          item: "custom-item",
          list: "custom-list",
          root: "custom-root",
        }}
        examples={["Example 1", "Example 2"]}
      />,
    );
    expect(
      container.querySelector(".pronoun-detail-editor-examples.custom-root"),
    ).toBeDefined();
    expect(
      container.querySelector(
        ".pronoun-detail-editor-examples-heading.custom-heading",
      ),
    ).toBeDefined();
    expect(
      container.querySelector(
        ".pronoun-detail-editor-examples-list.custom-list",
      ),
    ).toBeDefined();
    expect(
      container.querySelector(
        ".pronoun-detail-editor-examples-item.custom-item",
      ),
    ).toBeDefined();
  });

  test("renders without classNames prop", () => {
    const { container } = render(<ExamplesList examples={["Example 1"]} />);
    expect(
      container.querySelector(".pronoun-detail-editor-examples"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-detail-editor-examples-heading"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-detail-editor-examples-list"),
    ).toBeDefined();
    expect(
      container.querySelector(".pronoun-detail-editor-examples-item"),
    ).toBeDefined();
  });

  test("renders nothing when examples array is empty", () => {
    const { container } = render(<ExamplesList examples={[]} />);

    // The component should not render anything
    expect(container.firstChild).toBeNull();
  });

  test("renders with correct ARIA attributes", () => {
    render(<ExamplesList examples={exampleSentences} />);

    // Heading gets a unique ID via useId(); verify the list references it
    const heading = screen.getByText("Example Sentences");
    const headingId = heading.getAttribute("id");
    expect(headingId).toBeTruthy();

    const list = screen.getByRole("list");
    expect(list.getAttribute("aria-labelledby")).toBe(headingId);
  });
});
