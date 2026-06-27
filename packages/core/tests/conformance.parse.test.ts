import { describe, expect, it } from "vitest";

import type { PronounPreference } from "../src/types";

import fixtures from "@openpronoun/conformance/parsing";
import { parse } from "../src/parser";

type ParseFixture = {
  category: string;
  name: string;
  input: string;
  expected: PronounPreference | null;
};

describe("Parsing conformance", () => {
  for (const fixture of (fixtures as { cases: ParseFixture[] }).cases) {
    it(`[${fixture.category}] ${fixture.name}`, () => {
      const result = parse(fixture.input);
      expect(result).toEqual(fixture.expected);
    });
  }
});
