import type { PronounEntry } from "./pronounUtils";
import { fireEvent, render } from "@testing-library/react";
import React from "react";
import { describe, expect, test, vi } from "vitest";

import { PronounTag } from "./PronounTag";
import { defaultIcons } from "./theme";
import type { PronounOption } from "./types";

const standardOption: PronounOption = {
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

const specialOption: PronounOption = {
  id: "any-0",
  label: "Any pronouns",
  value: { type: "any" } as PronounEntry,
};

describe("PronounTag", () => {
  test("renders container with data-id", () => {
    const { container } = render(
      <PronounTag icons={defaultIcons} id="they-them-0" option={standardOption} />,
    );
    const el = container.querySelector(".pronoun-tag-container");
    expect(el).toBeTruthy();
    expect(el?.getAttribute("data-id")).toBe("they-them-0");
  });

  test("renders label and drag handle", () => {
    const { container } = render(
      <PronounTag icons={defaultIcons} id="they-them-0" option={standardOption} />,
    );
    expect(container.querySelector(".pronoun-tag-label")).toBeTruthy();
    expect(container.querySelector(".pronoun-drag-handle")).toBeTruthy();
    expect(container.textContent).toContain("they/them");
  });

  test("renders edit + remove buttons for standard sets when onEdit provided", () => {
    const onEdit = vi.fn();
    const { container } = render(
      <PronounTag
        icons={defaultIcons}
        id="they-them-0"
        onEdit={onEdit}
        option={standardOption}
      />,
    );
    expect(container.querySelector(".pronoun-tag-edit")).toBeTruthy();
    expect(container.querySelector(".pronoun-tag-remove")).toBeTruthy();
  });

  test("edit button click calls onEdit with the pronoun set", () => {
    const onEdit = vi.fn();
    const { container } = render(
      <PronounTag
        icons={defaultIcons}
        id="they-them-0"
        onEdit={onEdit}
        option={standardOption}
      />,
    );
    fireEvent.click(container.querySelector(".pronoun-tag-edit") as HTMLElement);
    expect(onEdit).toHaveBeenCalledWith(standardOption.value);
  });

  test("edit button Enter/Space calls onEdit", () => {
    const onEdit = vi.fn();
    const { container } = render(
      <PronounTag
        icons={defaultIcons}
        id="they-them-0"
        onEdit={onEdit}
        option={standardOption}
      />,
    );
    const btn = container.querySelector(".pronoun-tag-edit") as HTMLElement;
    fireEvent.keyDown(btn, { key: "Enter" });
    expect(onEdit).toHaveBeenCalledTimes(1);
    fireEvent.keyDown(btn, { key: " " });
    expect(onEdit).toHaveBeenCalledTimes(2);
  });

  test("remove button click calls onRemove with id", () => {
    const onRemove = vi.fn();
    const { container } = render(
      <PronounTag
        icons={defaultIcons}
        id="they-them-0"
        onRemove={onRemove}
        option={standardOption}
      />,
    );
    fireEvent.click(container.querySelector(".pronoun-tag-remove") as HTMLElement);
    expect(onRemove).toHaveBeenCalledWith("they-them-0");
  });

  test("no edit button rendered for special sets", () => {
    const onEdit = vi.fn();
    const { container } = render(
      <PronounTag
        icons={defaultIcons}
        id="any-0"
        onEdit={onEdit}
        option={specialOption}
      />,
    );
    expect(container.querySelector(".pronoun-tag-edit")).toBeNull();
    expect(container.querySelector(".pronoun-tag-remove")).toBeTruthy();
  });

  test("no edit button rendered when onEdit not provided", () => {
    const { container } = render(
      <PronounTag icons={defaultIcons} id="they-them-0" option={standardOption} />,
    );
    expect(container.querySelector(".pronoun-tag-edit")).toBeNull();
  });

  test("renders custom icons", () => {
    const onEdit = vi.fn();
    const customIcons = { ...defaultIcons, edit: "CUSTOM_EDIT", remove: "CUSTOM_REMOVE", dragHandle: "CUSTOM_DRAG" };
    const { container } = render(
      <PronounTag
        icons={customIcons}
        id="they-them-0"
        onEdit={onEdit}
        option={standardOption}
      />,
    );
    expect(container.textContent).toContain("CUSTOM_EDIT");
    expect(container.textContent).toContain("CUSTOM_REMOVE");
    expect(container.textContent).toContain("CUSTOM_DRAG");
  });

  test("applies classNames", () => {
    const onEdit = vi.fn();
    const { container } = render(
      <PronounTag
        classNames={{
          actions: "custom-actions",
          container: "custom-container",
          dragHandle: "custom-drag",
          editButton: "custom-edit",
          label: "custom-label",
          removeButton: "custom-remove",
        }}
        icons={defaultIcons}
        id="they-them-0"
        onEdit={onEdit}
        option={standardOption}
      />,
    );
    expect(container.querySelector(".pronoun-tag-container.custom-container")).toBeTruthy();
    expect(container.querySelector(".pronoun-tag-label.custom-label")).toBeTruthy();
    expect(container.querySelector(".pronoun-drag-handle.custom-drag")).toBeTruthy();
    expect(container.querySelector(".pronoun-tag-actions.custom-actions")).toBeTruthy();
    expect(container.querySelector(".pronoun-tag-edit.custom-edit")).toBeTruthy();
    expect(container.querySelector(".pronoun-tag-remove.custom-remove")).toBeTruthy();
  });
});
