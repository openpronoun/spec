import { describe, it, expect } from "vitest";
import Ajv from "ajv/dist/2020.js";
import jsonSchema from "@openpronoun/schema" with { type: "json" };
import parsing from "@openpronoun/conformance/parsing" with { type: "json" };
import formatting from "@openpronoun/conformance/formatting" with { type: "json" };
import { pronounPreferenceSchema } from "../src/index.js";

const ajv = new Ajv({ allErrors: true, strict: false });
const validateJsonSchema = ajv.compile(jsonSchema as object);

const zodAccepts = (doc: unknown) => pronounPreferenceSchema.safeParse(doc).success;
const ajvAccepts = (doc: unknown) => validateJsonSchema(doc) as boolean;

// Every fixture document that is a real PronounPreference (null = "no preference").
const validDocs: unknown[] = [
  ...(parsing as any).cases.map((c: any) => c.expected).filter((d: any) => d !== null),
  ...(formatting as any).cases.map((c: any) => c.input),
];

// Documents both validators must reject. (Excludes the pathological
// "special preference + form fields" case, where the Zod port is intentionally
// stricter than the JSON Schema.)
const invalidDocs: unknown[] = [
  [],
  [{ subjective: "she", objective: "her" }],
  [{ type: "custom" }],
  [{ type: "maybe" }],
  [{ subjective: "s", objective: "o", possessive_adjective: "a", possessive_pronoun: "p", reflexive: "r", bogus: "x" }],
  [{ subjective: "s", objective: "o", possessive_adjective: "a", possessive_pronoun: "p", reflexive: "r", language: "english" }],
  [{ subjective: "s", objective: "o", possessive_adjective: "a", possessive_pronoun: "p", reflexive: "r", privacy: -1 }],
];

describe("zod mirror parity with @openpronoun/schema", () => {
  it("accepts every valid conformance fixture document", () => {
    for (const doc of validDocs) {
      expect(ajvAccepts(doc), `ajv should accept ${JSON.stringify(doc)}`).toBe(true);
      expect(zodAccepts(doc), `zod should accept ${JSON.stringify(doc)}`).toBe(true);
    }
  });

  it("rejects the shared invalid set", () => {
    for (const doc of invalidDocs) {
      expect(ajvAccepts(doc), `ajv should reject ${JSON.stringify(doc)}`).toBe(false);
      expect(zodAccepts(doc), `zod should reject ${JSON.stringify(doc)}`).toBe(false);
    }
  });

  it("agrees with the JSON Schema on accept/reject for every checked document", () => {
    for (const doc of [...validDocs, ...invalidDocs]) {
      expect(zodAccepts(doc)).toBe(ajvAccepts(doc));
    }
  });
});
