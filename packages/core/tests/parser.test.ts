import { describe, expect, it } from "vitest";

import { parse } from "../src/parser";

describe("parse()", () => {
  describe("empty / null input", () => {
    it("returns null for empty string", () => {
      expect(parse("")).toBeNull();
    });
    it("returns null for whitespace-only string", () => {
      expect(parse("   ")).toBeNull();
    });
    it("returns null for null", () => {
      expect(parse(null)).toBeNull();
    });
    it("returns null for undefined", () => {
      expect(parse(undefined)).toBeNull();
    });
    it("returns null for N/A placeholder", () => {
      expect(parse("N/A")).toBeNull();
    });
    it("returns null for NA placeholder", () => {
      expect(parse("NA")).toBeNull();
    });
    it("returns null for 'none given' placeholder", () => {
      expect(parse("none given")).toBeNull();
    });
  });

  describe("single known set", () => {
    it("parses she/her (capitalized input)", () => {
      const result = parse("She/Her");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({
        subjective: "she",
        objective: "her",
        possessive_adjective: "her",
        possessive_pronoun: "hers",
        reflexive: "herself",
      });
    });

    it("parses he/him/his (with possessive)", () => {
      const result = parse("he/him/his");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "he", objective: "him" });
    });

    it("fills partial set from dictionary (bare subjective)", () => {
      const result = parse("they");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({
        subjective: "they",
        objective: "them",
        possessive_adjective: "their",
        possessive_pronoun: "theirs",
        reflexive: "themselves",
      });
    });

    it("parses neopronoun set xe/xem", () => {
      const result = parse("Xe/Xem");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "xe", objective: "xem" });
    });

    it("disambiguates ze/zir to ze/zir set (not ze/hir)", () => {
      const result = parse("ze/zir");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "ze", objective: "zir" });
    });

    it("disambiguates ze/hir to ze/hir set", () => {
      const result = parse("ze/hir");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "ze", objective: "hir" });
    });
  });

  describe("multiple sets", () => {
    it("parses comma-separated sets", () => {
      const result = parse("she/her, they/them");
      expect(result).toHaveLength(2);
      expect(result![0]).toMatchObject({ subjective: "she" });
      expect(result![1]).toMatchObject({ subjective: "they" });
    });

    it("parses 'and'-separated sets", () => {
      const result = parse("he/him and they/them");
      expect(result).toHaveLength(2);
    });

    it("parses 'or'-separated sets", () => {
      const result = parse("she/her or he/him");
      expect(result).toHaveLength(2);
    });

    it("parses '&'-separated sets", () => {
      const result = parse("he/him/his & she/her/hers");
      expect(result).toHaveLength(2);
    });

    it("parses space-separated bare subjectives", () => {
      const result = parse("he she");
      expect(result).toHaveLength(2);
    });

    it("parses space-separated slash-groups", () => {
      const result = parse("she/her they/them");
      expect(result).toHaveLength(2);
    });
  });

  describe("concatenation splitting", () => {
    it("splits they/them/he/him into two sets", () => {
      const result = parse("they/them/he/him");
      expect(result).toHaveLength(2);
      expect(result![0]).toMatchObject({ subjective: "they" });
      expect(result![1]).toMatchObject({ subjective: "he" });
    });

    it("splits three bare subjectives via slashes", () => {
      const result = parse("he/she/they");
      expect(result).toHaveLength(3);
    });
  });

  describe("form recovery", () => {
    it("recovers two sets from objective forms him/her", () => {
      const result = parse("him/her");
      expect(result).toHaveLength(2);
      expect(result!.some((e) => "subjective" in e && e.subjective === "he")).toBe(true);
      expect(result!.some((e) => "subjective" in e && e.subjective === "she")).toBe(true);
    });

    it("deduplicates her/she into one set", () => {
      const result = parse("her/she");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "she" });
    });
  });

  describe("separator normalization", () => {
    it("treats backslash as slash", () => {
      const result = parse("they\\them");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "they" });
    });

    it("strips spaces around slashes (they/ them/ theirs)", () => {
      const result = parse("they/ them/ theirs");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "they" });
    });

    it("spaced slash she / they yields two sets", () => {
      const result = parse("she / they");
      expect(result).toHaveLength(2);
    });
  });

  describe("special keywords", () => {
    it("any pronoun → any", () => {
      expect(parse("Any pronoun")).toEqual([{ type: "any" }]);
    });
    it("any/all → any", () => {
      expect(parse("any/all")).toEqual([{ type: "any" }]);
    });
    it("whatever you feel comfortable → any", () => {
      expect(parse("whatever you feel comfortable")).toEqual([{ type: "any" }]);
    });
    it("i go by all → any", () => {
      expect(parse("i go by all")).toEqual([{ type: "any" }]);
    });
    it("any and all pronouns → any", () => {
      expect(parse("any and all pronouns")).toEqual([{ type: "any" }]);
    });
    it("no pronouns → none", () => {
      expect(parse("no pronouns")).toEqual([{ type: "none" }]);
    });
    it("none, refer to me by name → none (deduplicated)", () => {
      expect(parse("none, refer to me by name")).toEqual([{ type: "none" }]);
    });
    it("use my name → none", () => {
      expect(parse("use my name")).toEqual([{ type: "none" }]);
    });
    it("ask me → ask", () => {
      expect(parse("ask me")).toEqual([{ type: "ask" }]);
    });
    it("unsure → unspecified", () => {
      expect(parse("unsure")).toEqual([{ type: "unspecified" }]);
    });
    it("prefer not to disclose → unspecified", () => {
      expect(parse("prefer not to disclose")).toEqual([{ type: "unspecified" }]);
    });
    it("not sure yet → unspecified", () => {
      expect(parse("not sure yet")).toEqual([{ type: "unspecified" }]);
    });
    it("choose not to disclose → unspecified", () => {
      expect(parse("choose not to disclose")).toEqual([{ type: "unspecified" }]);
    });
    it("don't know yet → unspecified", () => {
      expect(parse("don't know yet")).toEqual([{ type: "unspecified" }]);
    });
    it("most are acceptable → any", () => {
      expect(parse("most are acceptable")).toEqual([{ type: "any" }]);
    });
  });

  describe("filler stripping", () => {
    it("strips trailing 'is fine'", () => {
      const result = parse("he/him is fine");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "he" });
    });
    it("strips trailing 'are fine'", () => {
      const result = parse("she/her are fine");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "she" });
    });
    it("strips trailing 'also' after comma-separated sets", () => {
      const result = parse("she/her/hers, he/him/his also");
      expect(result).toHaveLength(2);
    });
    it("strips 'i use' prefix", () => {
      const result = parse("i use she/her");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "she" });
    });
    it("strips 'i go by' prefix", () => {
      const result = parse("i go by they/them");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "they" });
    });
    it("Any is fine → any", () => {
      expect(parse("Any is fine")).toEqual([{ type: "any" }]);
    });
  });

  describe("context capture", () => {
    it("extracts parenthetical context", () => {
      const result = parse("she/her (only in professional settings)");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({
        subjective: "she",
        context: "only in professional settings",
      });
    });

    it("extracts bracket context", () => {
      const result = parse("they/them [at work only]");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({
        subjective: "they",
        context: "at work only",
      });
    });
  });

  describe("exclusions", () => {
    it("marks 'just not X' set as excluded", () => {
      const result = parse("he/him or she/her, just not they/them");
      expect(result).toHaveLength(3);
      const excl = result!.find((e) => "exclude" in e && e.exclude === true);
      expect(excl).toMatchObject({ subjective: "they", exclude: true });
    });

    it("marks 'not X' set as excluded", () => {
      const result = parse("she/her, not they/them");
      expect(result).toHaveLength(2);
      const excl = result!.find((e) => "exclude" in e && e.exclude === true);
      expect(excl).toMatchObject({ subjective: "they", exclude: true });
    });

    it("marks 'never X' set as excluded", () => {
      const result = parse("she/her, never he/him");
      expect(result).toHaveLength(2);
      const excl = result!.find((e) => "exclude" in e && e.exclude === true);
      expect(excl).toMatchObject({ subjective: "he", exclude: true });
    });

    it("marks 'except X' set as excluded", () => {
      const result = parse("any, except she/her");
      expect(result).toHaveLength(2);
      const excl = result!.find((e) => "exclude" in e && e.exclude === true);
      expect(excl).toMatchObject({ subjective: "she", exclude: true });
    });

    it("'not sure yet' is unspecified, not an exclusion", () => {
      expect(parse("not sure yet")).toEqual([{ type: "unspecified" }]);
    });

    it("'not sure yet' as a segment is unspecified", () => {
      const result = parse("she/her, not sure yet");
      expect(result).toHaveLength(2);
      expect(result![1]).toEqual({ type: "unspecified" });
    });
  });

  describe("custom entries", () => {
    it("preserves unrecognized slash-set as custom", () => {
      expect(parse("fox/foxs")).toEqual([{ type: "custom", display: "fox/foxs" }]);
    });
    it("preserves unrecognized single word as custom", () => {
      expect(parse("david")).toEqual([{ type: "custom", display: "david" }]);
    });
    it("returns recognized set + custom for mixed input", () => {
      const result = parse("they/them/theirs, Reading");
      expect(result).toHaveLength(2);
      expect(result![0]).toMatchObject({ subjective: "they" });
      expect(result![1]).toEqual({ type: "custom", display: "Reading" });
    });
    it("returns recognized set + custom numeric noise", () => {
      const result = parse("she/her/hers, 12345");
      expect(result).toHaveLength(2);
      expect(result![1]).toEqual({ type: "custom", display: "12345" });
    });
  });

  describe("leading empty element", () => {
    it("leading comma produces one set", () => {
      const result = parse(", He/him");
      expect(result).toHaveLength(1);
      expect(result![0]).toMatchObject({ subjective: "he" });
    });
  });

  describe("deduplication", () => {
    it("deduplicates case-insensitive sets", () => {
      const result = parse("he/him, He/him");
      expect(result).toHaveLength(1);
    });
    it("deduplicates comma-scrambled forms she,her,he,him", () => {
      const result = parse("she,her,he,him");
      expect(result).toHaveLength(2);
    });
  });
});
