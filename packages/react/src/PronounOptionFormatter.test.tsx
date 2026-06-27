import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";

import { formatGroupLabel, formatOptionLabel } from "./PronounOptionFormatter";
import { defaultIcons } from "./theme";
import type { PronounOption, PronounOptionGroup } from "./types";

describe("PronounOptionFormatter", () => {
  describe("formatOptionLabel", () => {
    test("renders custom pronoun set option", () => {
      const customOption: PronounOption = {
        isCreate: true,
        label: "Create custom pronoun set",
        value: { type: "custom", display: "" },
      };

      const { container } = render(
        <>
          {
            formatOptionLabel(
              customOption,
              {
                context: "menu",
              },
              defaultIcons,
            ) as React.ReactElement
          }
        </>,
      );

      expect(container.querySelector(".pronoun-create-custom")).toBeDefined();
      expect(container.textContent).toContain("Create custom pronoun set");
    });

    test("renders custom create icon when provided", () => {
      const customOption: PronounOption = {
        isCreate: true,
        label: "Create custom pronoun set",
        value: { type: "custom", display: "" },
      };

      const customIcons = { ...defaultIcons, create: "CUSTOM_CREATE" };

      const { container } = render(
        <>
          {
            formatOptionLabel(
              customOption,
              { context: "menu" },
              customIcons,
            ) as React.ReactElement
          }
        </>,
      );

      expect(container.textContent).toContain("CUSTOM_CREATE");
    });

    test("renders specific pronoun set with examples in menu context", () => {
      const specificOption: PronounOption = {
        examples: ["They went to the store.", "I saw them yesterday."],
        label: "they/them",
        value: {
          language: "en",
          objective: "them",
          possessive_adjective: "their",
          possessive_pronoun: "theirs",
          reflexive: "themself",
          subjective: "they",
        },
      };

      const { container } = render(
        <>
          {
            formatOptionLabel(
              specificOption,
              {
                context: "menu",
              },
              defaultIcons,
            ) as React.ReactElement
          }
        </>,
      );

      expect(container.querySelector(".pronoun-examples")).toBeDefined();
      expect(container.textContent).toContain("they/them");
      expect(container.textContent).toContain("They went to the store.");
      expect(container.textContent).toContain("I saw them yesterday.");
    });

    test("renders only label in value context", () => {
      const specificOption: PronounOption = {
        examples: ["They went to the store.", "I saw them yesterday."],
        label: "they/them",
        value: {
          language: "en",
          objective: "them",
          possessive_adjective: "their",
          possessive_pronoun: "theirs",
          reflexive: "themself",
          subjective: "they",
        },
      };

      const result = formatOptionLabel(
        specificOption,
        { context: "value" },
        defaultIcons,
      );
      expect(result).toBe("they/them");
    });
  });

  describe("formatGroupLabel", () => {
    test("renders group label with count", () => {
      const group: PronounOptionGroup = {
        label: "Common Pronouns",
        options: [
          {
            label: "he/him",
            value: {
              language: "en",
              objective: "him",
              possessive_adjective: "his",
              possessive_pronoun: "his",
              reflexive: "himself",
              subjective: "he",
            },
          },
          {
            label: "she/her",
            value: {
              language: "en",
              objective: "her",
              possessive_adjective: "her",
              possessive_pronoun: "hers",
              reflexive: "herself",
              subjective: "she",
            },
          },
        ],
      };

      const { container } = render(
        <>{formatGroupLabel(group) as React.ReactElement}</>,
      );

      expect(container.querySelector(".pronoun-group-label")).toBeDefined();
      expect(container.textContent).toContain("Common Pronouns");
      expect(container.querySelector(".pronoun-group-count")).toBeDefined();
      expect(container.textContent).toContain("2");
    });

    describe("classNames support", () => {
      test("formatOptionLabel applies classNames to custom option", () => {
        const customOption: PronounOption = {
          isCreate: true,
          label: "Create custom pronoun set",
          value: { type: "custom", display: "" },
        };

        const { container } = render(
          <>
            {
              formatOptionLabel(
                customOption,
                { context: "menu" },
                defaultIcons,
                {
                  createCustom: "custom-create",
                  createCustomIcon: "custom-icon",
                },
              ) as React.ReactElement
            }
          </>,
        );
        expect(
          container.querySelector(".pronoun-create-custom.custom-create"),
        ).toBeDefined();
        expect(
          container.querySelector(".pronoun-create-custom-icon.custom-icon"),
        ).toBeDefined();
      });

      test("formatGroupLabel applies classNames", () => {
        const group: PronounOptionGroup = {
          label: "Common Pronouns",
          options: [
            {
              label: "he/him",
              value: {
                language: "en",
                objective: "him",
                possessive_adjective: "his",
                possessive_pronoun: "his",
                reflexive: "himself",
                subjective: "he",
              },
            },
            {
              label: "she/her",
              value: {
                language: "en",
                objective: "her",
                possessive_adjective: "her",
                possessive_pronoun: "hers",
                reflexive: "herself",
                subjective: "she",
              },
            },
          ],
        };

        const { container } = render(
          <>
            {
              formatGroupLabel(group, {
                groupCount: "custom-count",
                groupLabel: "custom-group",
              }) as React.ReactElement
            }
          </>,
        );
        expect(
          container.querySelector(".pronoun-group-label.custom-group"),
        ).toBeDefined();
        expect(
          container.querySelector(".pronoun-group-count.custom-count"),
        ).toBeDefined();
      });
    });
  });
});
