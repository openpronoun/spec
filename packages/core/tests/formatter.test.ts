import { describe, expect, it } from "vitest";

import type { PronounPreference } from "../src/types";

import { format } from "../src/formatter";

const sheHer: PronounPreference = [
  {
    subjective: "she",
    objective: "her",
    possessive_adjective: "her",
    possessive_pronoun: "hers",
    reflexive: "herself",
  },
];

const theyThem: PronounPreference = [
  {
    subjective: "they",
    objective: "them",
    possessive_adjective: "their",
    possessive_pronoun: "theirs",
    reflexive: "themselves",
  },
];

describe("format()", () => {
  describe("short form (default)", () => {
    it("formats a single set as Sub/Obj", () => {
      expect(format(sheHer)).toBe("She/Her");
    });

    it("formats multiple sets comma-separated", () => {
      const pref: PronounPreference = [...sheHer, ...theyThem];
      expect(format(pref)).toBe("She/Her, They/Them");
    });

    it("includes context in parentheses", () => {
      const pref: PronounPreference = [
        {
          subjective: "he",
          objective: "him",
          possessive_adjective: "his",
          possessive_pronoun: "his",
          reflexive: "himself",
          context: "in professional contexts",
        },
        ...theyThem,
      ];
      expect(format(pref)).toBe("He/Him (in professional contexts), They/Them");
    });

    it("omits excluded sets", () => {
      const pref: PronounPreference = [
        ...sheHer,
        {
          subjective: "they",
          objective: "them",
          possessive_adjective: "their",
          possessive_pronoun: "theirs",
          reflexive: "themselves",
          exclude: true,
        },
      ];
      expect(format(pref)).toBe("She/Her");
    });

    it("omits privacy>=1 entries for public audience", () => {
      const pref: PronounPreference = [
        ...sheHer,
        {
          subjective: "they",
          objective: "them",
          possessive_adjective: "their",
          possessive_pronoun: "theirs",
          reflexive: "themselves",
          privacy: 1,
        },
      ];
      expect(format(pref, { audience: "public" })).toBe("She/Her");
    });

    it("sorts by ranking ascending", () => {
      const pref: PronounPreference = [
        { ...sheHer[0]!, ranking: 2 },
        { ...theyThem[0]!, ranking: 1 },
      ];
      expect(format(pref)).toBe("They/Them, She/Her");
    });
  });

  describe("expanded form", () => {
    it("formats as Sub/Obj/PossessivePronoun", () => {
      expect(format(sheHer, { form: "expanded" })).toBe("She/Her/Hers");
    });

    it("they/them expanded uses theirs", () => {
      expect(format(theyThem, { form: "expanded" })).toBe("They/Them/Theirs");
    });
  });

  describe("detailed form", () => {
    it("surfaces excluded sets with 'not' prefix", () => {
      const pref: PronounPreference = [
        {
          subjective: "he",
          objective: "him",
          possessive_adjective: "his",
          possessive_pronoun: "his",
          reflexive: "himself",
        },
        ...sheHer,
        {
          subjective: "they",
          objective: "them",
          possessive_adjective: "their",
          possessive_pronoun: "theirs",
          reflexive: "themselves",
          exclude: true,
        },
      ];
      expect(format(pref, { form: "detailed" })).toBe(
        "He/Him, She/Her (not They/Them)",
      );
    });
  });

  describe("special types", () => {
    it("any → 'Any pronouns'", () => {
      expect(format([{ type: "any" }])).toBe("Any pronouns");
    });
    it("none → 'No pronouns (use name)'", () => {
      expect(format([{ type: "none" }])).toBe("No pronouns (use name)");
    });
    it("ask → 'Ask me my pronouns'", () => {
      expect(format([{ type: "ask" }])).toBe("Ask me my pronouns");
    });
    it("unspecified → 'Unspecified'", () => {
      expect(format([{ type: "unspecified" }])).toBe("Unspecified");
    });
  });

  describe("custom entries", () => {
    it("capitalizes each slash-separated part of display", () => {
      expect(format([{ type: "custom", display: "fae/faer" }])).toBe(
        "Fae/Faer",
      );
    });
  });

  describe("compact key style", () => {
    it("reads sub/obj/p_pn from compact keys", () => {
      const pref: PronounPreference = [
        {
          sub: "they",
          obj: "them",
          p_a: "their",
          p_pn: "theirs",
          ref: "themselves",
        },
      ];
      expect(format(pref)).toBe("They/Them");
      expect(format(pref, { form: "expanded" })).toBe("They/Them/Theirs");
    });
  });
});
