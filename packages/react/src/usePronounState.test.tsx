import { COMMON_PRONOUN_SETS } from "./pronounUtils";
import type { PronounEntry } from "./pronounUtils";
import { fireEvent, render, screen } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";

import { usePronounState } from "./usePronounState";

const HE_SET = COMMON_PRONOUN_SETS.HE!;
const SHE_SET = COMMON_PRONOUN_SETS.SHE!;
const THEY_SET = COMMON_PRONOUN_SETS.THEY!;

// Test component that exposes hook state
const TestComponent = ({ initialValue }: { initialValue?: PronounEntry[] }) => {
  const state = usePronounState(initialValue);

  return (
    <div>
      <div data-testid="count">{state.pronouns.length}</div>
      <div data-testid="formatted">{state.formatted}</div>
      <div data-testid="isValid">{String(state.isValid)}</div>
      <div data-testid="errors">{state.errors.join("; ")}</div>
      <button data-testid="add-he" onClick={() => state.addPronoun(HE_SET)}>
        Add He
      </button>
      <button data-testid="add-she" onClick={() => state.addPronoun(SHE_SET)}>
        Add She
      </button>
      <button data-testid="remove-0" onClick={() => state.removePronoun(0)}>
        Remove First
      </button>
      <button
        data-testid="update-0"
        onClick={() => state.updatePronoun(0, THEY_SET)}
      >
        Update First to They
      </button>
      <button data-testid="reorder" onClick={() => state.reorderPronouns(0, 1)}>
        Swap 0 and 1
      </button>
      <button data-testid="clear" onClick={() => state.clearPronouns()}>
        Clear
      </button>
      <button
        data-testid="set-all"
        onClick={() => state.setPronouns([HE_SET, SHE_SET])}
      >
        Set All
      </button>
    </div>
  );
};

describe("usePronounState", () => {
  test("initializes with empty array by default", () => {
    render(<TestComponent />);
    expect(screen.getByTestId("count").textContent).toBe("0");
    expect(screen.getByTestId("isValid").textContent).toBe("true");
    expect(screen.getByTestId("formatted").textContent).toBe("");
  });

  test("initializes with provided value", () => {
    render(<TestComponent initialValue={[HE_SET]} />);
    expect(screen.getByTestId("count").textContent).toBe("1");
    expect(screen.getByTestId("formatted").textContent).toMatch(/he\/him/i);
  });

  test("addPronoun adds a pronoun set", () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByTestId("add-he"));
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  test("removePronoun removes a pronoun set by index", () => {
    render(<TestComponent initialValue={[HE_SET, SHE_SET]} />);
    expect(screen.getByTestId("count").textContent).toBe("2");
    fireEvent.click(screen.getByTestId("remove-0"));
    expect(screen.getByTestId("count").textContent).toBe("1");
  });

  test("updatePronoun updates a pronoun set at index", () => {
    render(<TestComponent initialValue={[HE_SET]} />);
    fireEvent.click(screen.getByTestId("update-0"));
    expect(screen.getByTestId("formatted").textContent).toMatch(/they\/them/i);
  });

  test("reorderPronouns swaps pronoun sets", () => {
    render(<TestComponent initialValue={[HE_SET, SHE_SET]} />);
    fireEvent.click(screen.getByTestId("reorder"));
    // After reorder, she should be first
    expect(screen.getByTestId("formatted").textContent).toMatch(/she\/her/i);
  });

  test("clearPronouns removes all pronoun sets", () => {
    render(<TestComponent initialValue={[HE_SET, SHE_SET]} />);
    expect(screen.getByTestId("count").textContent).toBe("2");
    fireEvent.click(screen.getByTestId("clear"));
    expect(screen.getByTestId("count").textContent).toBe("0");
  });

  test("setPronouns replaces all pronoun sets", () => {
    render(<TestComponent />);
    fireEvent.click(screen.getByTestId("set-all"));
    expect(screen.getByTestId("count").textContent).toBe("2");
  });

  test("isValid is true for valid pronoun sets", () => {
    render(<TestComponent initialValue={[HE_SET, SHE_SET]} />);
    expect(screen.getByTestId("isValid").textContent).toBe("true");
  });

  test("formatted returns formatted string", () => {
    render(<TestComponent initialValue={[HE_SET, SHE_SET]} />);
    const formatted = screen.getByTestId("formatted").textContent;
    expect(formatted).toMatch(/he\/him/i);
    expect(formatted).toMatch(/she\/her/i);
  });
});
