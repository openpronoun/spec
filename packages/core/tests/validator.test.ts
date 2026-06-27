import { describe, expect, it } from "vitest";

import { validate, validationErrors } from "../src/validator";

describe("validate()", () => {
  it("accepts a full-key standard entry", () => {
    expect(
      validate([
        {
          subjective: "they",
          objective: "them",
          possessive_adjective: "their",
          possessive_pronoun: "theirs",
          reflexive: "themselves",
        },
      ]),
    ).toBe(true);
  });

  it("accepts a compact-key standard entry", () => {
    expect(
      validate([{ sub: "they", obj: "them", p_a: "their", p_pn: "theirs", ref: "themselves" }]),
    ).toBe(true);
  });

  it("accepts special preference entries", () => {
    expect(validate([{ type: "any" }])).toBe(true);
    expect(validate([{ type: "none" }])).toBe(true);
    expect(validate([{ type: "ask" }])).toBe(true);
    expect(validate([{ type: "unspecified" }])).toBe(true);
  });

  it("accepts a custom entry with display", () => {
    expect(validate([{ type: "custom", display: "fox/foxs" }])).toBe(true);
  });

  it("rejects an empty array", () => {
    expect(validate([])).toBe(false);
  });

  it("rejects a non-array", () => {
    expect(validate(null)).toBe(false);
    expect(validate("she/her")).toBe(false);
    expect(validate({})).toBe(false);
  });

  it("rejects a standard entry missing required fields", () => {
    expect(validate([{ subjective: "she", objective: "her" }])).toBe(false);
  });
});

describe("validationErrors()", () => {
  it("returns empty array for valid input", () => {
    expect(
      validationErrors([
        {
          subjective: "she",
          objective: "her",
          possessive_adjective: "her",
          possessive_pronoun: "hers",
          reflexive: "herself",
        },
      ]),
    ).toEqual([]);
  });

  it("returns error messages for invalid input", () => {
    const errors = validationErrors([{ subjective: "she" }]);
    expect(errors.length).toBeGreaterThan(0);
  });
});
