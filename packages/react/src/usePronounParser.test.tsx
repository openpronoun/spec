import {
  act,
  fireEvent,
  render,
  screen,
  waitFor,
} from "@testing-library/react";
import React from "react";
import { describe, expect, test, vi } from "vitest";

import { usePronounParser } from "./usePronounParser";

// Test component that exposes hook state
const TestComponent = ({ debounceMs }: { debounceMs?: number }) => {
  const state = usePronounParser({ debounceMs });

  return (
    <div>
      <input
        data-testid="input"
        onChange={(e) => state.setInput(e.target.value)}
        value={state.input}
      />
      <div data-testid="parsed-count">{state.parsed.length}</div>
      <div data-testid="formatted">{state.formatted}</div>
      <div data-testid="isValid">{String(state.isValid)}</div>
      <div data-testid="errors">{state.errors.join("; ")}</div>
    </div>
  );
};

describe("usePronounParser", () => {
  test("initializes with empty state", () => {
    render(<TestComponent debounceMs={0} />);
    expect(screen.getByTestId("parsed-count").textContent).toBe("0");
    expect(screen.getByTestId("formatted").textContent).toBe("");
    expect(screen.getByTestId("isValid").textContent).toBe("true");
  });

  test("parses pronoun input without debounce", async () => {
    render(<TestComponent debounceMs={0} />);

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "she/her" } });

    await waitFor(() => {
      expect(screen.getByTestId("parsed-count").textContent).not.toBe("0");
    });

    expect(screen.getByTestId("formatted").textContent).toMatch(/she\/her/i);
  });

  test("parses multiple pronoun sets", async () => {
    render(<TestComponent debounceMs={0} />);

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "he/him, they/them" } });

    await waitFor(() => {
      const count = parseInt(
        screen.getByTestId("parsed-count").textContent || "0",
      );
      expect(count).toBeGreaterThanOrEqual(1);
    });
  });

  test("parses special keywords", async () => {
    render(<TestComponent debounceMs={0} />);

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "any" } });

    await waitFor(() => {
      expect(screen.getByTestId("parsed-count").textContent).not.toBe("0");
    });

    expect(screen.getByTestId("formatted").textContent).toMatch(/any/i);
  });

  test("debounces parsing", () => {
    vi.useFakeTimers();

    render(<TestComponent debounceMs={300} />);

    const input = screen.getByTestId("input");

    act(() => {
      fireEvent.change(input, { target: { value: "she/her" } });
    });

    // Should not have parsed yet
    expect(screen.getByTestId("parsed-count").textContent).toBe("0");

    // Advance timers past debounce
    act(() => {
      vi.advanceTimersByTime(350);
    });

    // Now it should be parsed
    expect(screen.getByTestId("parsed-count").textContent).not.toBe("0");

    vi.useRealTimers();
  });

  test("isValid is true for valid input", async () => {
    render(<TestComponent debounceMs={0} />);

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "they/them" } });

    await waitFor(() => {
      expect(screen.getByTestId("parsed-count").textContent).not.toBe("0");
    });

    expect(screen.getByTestId("isValid").textContent).toBe("true");
  });

  test("handles empty input", async () => {
    render(<TestComponent debounceMs={0} />);

    const input = screen.getByTestId("input");
    fireEvent.change(input, { target: { value: "she/her" } });

    await waitFor(() => {
      expect(screen.getByTestId("parsed-count").textContent).not.toBe("0");
    });

    fireEvent.change(input, { target: { value: "" } });

    await waitFor(() => {
      expect(screen.getByTestId("parsed-count").textContent).toBe("0");
    });
  });
});
