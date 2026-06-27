import { describe, expect, it } from "vitest";

import type { FormatOptions, PronounPreference } from "../src/types";

import fixtures from "@openpronoun/conformance/formatting";
import { format } from "../src/formatter";

type FormatFixture = {
  name: string;
  input: PronounPreference;
  options: FormatOptions;
  expected: string;
};

describe("Formatting conformance", () => {
  for (const fixture of (fixtures as { cases: FormatFixture[] }).cases) {
    it(fixture.name, () => {
      const result = format(fixture.input, fixture.options);
      expect(result).toBe(fixture.expected);
    });
  }
});
