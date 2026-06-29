import { render } from "@testing-library/react";
import React from "react";
import { describe, expect, test } from "vitest";

import { formatGroupLabel, formatOptionLabel } from "./PronounOptionFormatter";
import { defaultIcons } from "./theme";
import type { PronounOption, PronounOptionGroup } from "./types";

describe("PronounOptionFormatter", () => {
  describe("formatOptionLabel", () => {
    test("renders the create-custom sentinel option", () => {
      const customOption: PronounOption = {
        isCreate: true,
        label: "Create custom pronoun set",
        value: { type: "custom", display: "" },
      };

      const { container } = render(
        <>{formatOptionLabel(customOption, defaultIcons) as React.ReactElement}</>,
      );

      expect(container.querySelector(".pronoun-create-custom")).toBeTruthy();
      expect(container.textContent).toContain("Create custom pronoun set");
    });

    test("renders custom create icon", () => {
      const customOption: PronounOption = {
        isCreate: true,
        label: "Create custom pronoun set",
        value: { type: "custom", display: "" },
      };

      const { container } = render(
        <>
          {formatOptionLabel(
            customOption,
            { ...defaultIcons, create: "CUSTOM_CREATE" },
          ) as React.ReactElement}
        </>,
      );

      expect(container.textContent).toContain("CUSTOM_CREATE");
    });

    test("renders examples in expanded mode (compact=false)", () => {
      const option: PronounOption = {
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
        <>{formatOptionLabel(option, defaultIcons, undefined, false) as React.ReactElement}</>,
      );

      expect(container.querySelector(".pronoun-examples")).toBeTruthy();
      expect(container.textContent).toContain("they/them");
      expect(container.textContent).toContain("They went to the store.");
      expect(container.textContent).toContain("I saw them yesterday.");
    });

    test("renders only label in compact mode (compact=true)", () => {
      const option: PronounOption = {
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

      const result = formatOptionLabel(option, defaultIcons, undefined, true);
      expect(result).toBe("they/them");
    });

    test("applies classNames to the create option", () => {
      const customOption: PronounOption = {
        isCreate: true,
        label: "Create custom pronoun set",
        value: { type: "custom", display: "" },
      };

      const { container } = render(
        <>
          {formatOptionLabel(customOption, defaultIcons, {
            createCustom: "custom-create",
            createCustomIcon: "custom-icon",
          }) as React.ReactElement}
        </>,
      );

      expect(container.querySelector(".pronoun-create-custom.custom-create")).toBeTruthy();
      expect(container.querySelector(".pronoun-create-custom-icon.custom-icon")).toBeTruthy();
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

      expect(container.querySelector(".pronoun-group-label")).toBeTruthy();
      expect(container.textContent).toContain("Common Pronouns");
      expect(container.querySelector(".pronoun-group-count")).toBeTruthy();
      expect(container.textContent).toContain("2");
    });

    test("applies classNames", () => {
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
        ],
      };

      const { container } = render(
        <>
          {formatGroupLabel(group, {
            groupCount: "custom-count",
            groupLabel: "custom-group",
          }) as React.ReactElement}
        </>,
      );

      expect(container.querySelector(".pronoun-group-label.custom-group")).toBeTruthy();
      expect(container.querySelector(".pronoun-group-count.custom-count")).toBeTruthy();
    });
  });
});
