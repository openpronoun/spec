import { describe, it, expect } from "vitest";
import { Pronoun } from "./index.js";

describe("react", () => {
  it("exports Pronoun component", () => {
    expect(Pronoun).toBeDefined();
    expect(typeof Pronoun).toBe("function");
  });
});
