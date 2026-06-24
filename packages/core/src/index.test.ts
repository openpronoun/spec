import { describe, it, expect } from "vitest";
import { placeholder } from "./index.js";

describe("core", () => {
  it("placeholder returns a string", () => {
    expect(typeof placeholder()).toBe("string");
  });
});
