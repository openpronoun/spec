import clsx from "clsx";
import React, { useEffect, useId, useRef, useState } from "react";

import type { PronounDetailEditorClassNames } from "./classNames";
import EditorFooter from "./EditorFooter";
import EditorHeader from "./EditorHeader";
import ExamplesList from "./ExamplesList";
import FormField from "./FormField";
import {
  createExampleSentences,
  isStandardSet,
  PrivacyLevel,
} from "./pronounUtils";
import type { PronounSet } from "./pronounUtils";
import { getPronounCSSVars, getPronounDetailEditorStyles } from "./styles";
import { defaultTheme, mergeIcons, mergeTheme } from "./theme";
import type { PronounIconConfig, PronounTheme } from "./theme";

export interface PronounDetailEditorProps {
  /** Optional CSS class name */
  className?: string;
  /** Optional class name overrides for internal elements */
  classNames?: PronounDetailEditorClassNames;
  /** Optional icon overrides */
  icons?: Partial<PronounIconConfig>;
  /** Callback when the editor is closed without saving */
  onCancel: () => void;
  /** Callback when the pronoun set is saved */
  onSave: (pronounSet: PronounSet) => void;
  /** The pronoun set to edit */
  pronounSet: null | PronounSet;
  /** Optional theme */
  theme?: Partial<PronounTheme>;
}

// Internal working type — the editor always uses full-key snake_case fields.
type EditableSet = {
  subjective: string;
  objective: string;
  possessive_adjective: string;
  possessive_pronoun: string;
  reflexive: string;
  context?: string;
  privacy?: number;
  language?: string;
  exclude?: boolean;
  ranking?: number;
};

function toEditable(set: PronounSet): EditableSet {
  if ("subjective" in set) {
    return {
      context: set.context ?? "",
      exclude: set.exclude,
      language: set.language ?? "en",
      objective: set.objective,
      possessive_adjective: set.possessive_adjective,
      possessive_pronoun: set.possessive_pronoun,
      privacy: set.privacy ?? PrivacyLevel.PUBLIC,
      ranking: set.ranking,
      reflexive: set.reflexive,
      subjective: set.subjective,
    };
  }
  // Compact-key variant
  return {
    language: (set as { lang?: string }).lang ?? "en",
    objective: (set as { obj: string }).obj,
    possessive_adjective: (set as { p_a: string }).p_a,
    possessive_pronoun: (set as { p_pn: string }).p_pn,
    privacy: PrivacyLevel.PUBLIC,
    reflexive: (set as { ref: string }).ref,
    subjective: (set as { sub: string }).sub,
  };
}

/**
 * Component for editing the details of a pronoun set.
 * Always produces full-key (snake_case) PronounSets on save.
 */
export const PronounDetailEditor: React.FC<PronounDetailEditorProps> = ({
  className,
  classNames,
  icons,
  onCancel,
  onSave,
  pronounSet,
  theme,
}) => {
  const [editedSet, setEditedSet] = useState<EditableSet | null>(null);
  const [examples, setExamples] = useState<string[]>([]);

  useEffect(() => {
    if (pronounSet) {
      setEditedSet(toEditable(pronounSet));
    } else {
      setEditedSet(null);
    }
  }, [pronounSet]);

  useEffect(() => {
    if (editedSet) {
      // Cast back to PronounSet to use the shared utility
      const asSet = editedSet as unknown as PronounSet;
      if (isStandardSet(asSet)) {
        setExamples(createExampleSentences(asSet));
      } else {
        setExamples([]);
      }
    } else {
      setExamples([]);
    }
  }, [editedSet]);

  const handleInputChange = (field: string, value: number | string) => {
    if (editedSet) {
      setEditedSet({ ...editedSet, [field]: value });
    }
  };

  const handleSave = () => {
    if (editedSet) {
      // D9: form values SHOULD be stored lowercase; trim whitespace for safety
      const normalized: EditableSet = {
        ...editedSet,
        subjective: editedSet.subjective.toLowerCase().trim(),
        objective: editedSet.objective.toLowerCase().trim(),
        possessive_adjective: editedSet.possessive_adjective.toLowerCase().trim(),
        possessive_pronoun: editedSet.possessive_pronoun.toLowerCase().trim(),
        reflexive: editedSet.reflexive.toLowerCase().trim(),
      };
      onSave(normalized as unknown as PronounSet);
    }
  };

  const uid = useId();
  const titleId = `${uid}-editor-title`;
  const mergedTheme = theme ? mergeTheme(theme) : defaultTheme;
  const resolvedIcons = mergeIcons(icons);
  const firstInputRef = useRef<HTMLInputElement>(null);
  const dialogRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      firstInputRef.current?.focus({ preventScroll: true });
    }, 100);
    return () => clearTimeout(timer);
  }, []);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    e.stopPropagation();
    if (e.key === "Escape") {
      onCancel();
      return;
    }
    if (e.key === "Tab") {
      const focusable = dialogRef.current?.querySelectorAll<HTMLElement>(
        'button:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      );
      if (!focusable || focusable.length === 0) return;
      const arr = Array.from(focusable);
      const first = arr[0];
      const last = arr[arr.length - 1];
      if (!first || !last) return;
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    }
  };

  if (!editedSet) return null;

  return (
    <div
      aria-labelledby={titleId}
      aria-modal="true"
      className={clsx("pronoun-detail-editor", className, classNames?.root)}
      onKeyDown={handleKeyDown}
      ref={dialogRef}
      role="dialog"
      style={getPronounCSSVars(mergedTheme)}
    >
      <EditorHeader
        classNames={classNames?.header}
        icons={resolvedIcons}
        onClose={onCancel}
        title={editedSet.subjective ? "Edit Pronoun Set" : "Create Pronoun Set"}
        titleId={titleId}
      />

      <div className={clsx("pronoun-detail-editor-body", classNames?.body)}>
        <div className={clsx("pronoun-detail-editor-form", classNames?.form)}>
          <FormField
            classNames={classNames?.field}
            description='The form used as the subject of a sentence (e.g., "they")'
            fieldName="subjective"
            id={`${uid}-subjective`}
            inputRef={firstInputRef}
            label='Subjective (e.g., "they")'
            onChange={handleInputChange}
            placeholder="Subjective form"
            required={true}
            value={editedSet.subjective}
          />

          <FormField
            classNames={classNames?.field}
            description='The form used as the object of a sentence (e.g., "them")'
            fieldName="objective"
            id={`${uid}-objective`}
            label='Objective (e.g., "them")'
            onChange={handleInputChange}
            placeholder="Objective form"
            required={true}
            value={editedSet.objective}
          />

          <FormField
            classNames={classNames?.field}
            description='The form used before a noun to show possession (e.g., "their")'
            fieldName="possessive_adjective"
            id={`${uid}-possessive_adjective`}
            label='Possessive Adjective (e.g., "their")'
            onChange={handleInputChange}
            placeholder="Possessive adjective form"
            required={true}
            value={editedSet.possessive_adjective}
          />

          <FormField
            classNames={classNames?.field}
            description='The form used to show possession without a noun (e.g., "theirs")'
            fieldName="possessive_pronoun"
            id={`${uid}-possessive_pronoun`}
            label='Possessive Pronoun (e.g., "theirs")'
            onChange={handleInputChange}
            placeholder="Possessive pronoun form"
            required={true}
            value={editedSet.possessive_pronoun}
          />

          <FormField
            classNames={classNames?.field}
            description='The form used when the subject and object are the same (e.g., "themself")'
            fieldName="reflexive"
            id={`${uid}-reflexive`}
            label='Reflexive (e.g., "themself")'
            onChange={handleInputChange}
            placeholder="Reflexive form"
            required={true}
            value={editedSet.reflexive}
          />

          <FormField
            classNames={classNames?.field}
            description="When or where these pronouns should be used (optional)"
            fieldName="context"
            id={`${uid}-context`}
            label="Context (optional)"
            onChange={handleInputChange}
            placeholder="e.g., in professional settings, with family"
            value={editedSet.context ?? ""}
          />

          <FormField
            classNames={classNames?.field}
            description="Who can see these pronouns"
            fieldName="privacy"
            id={`${uid}-privacy`}
            label="Privacy Level"
            onChange={handleInputChange}
            type="select"
            value={editedSet.privacy ?? PrivacyLevel.PUBLIC}
          >
            <option value={PrivacyLevel.PUBLIC}>
              Public — visible to everyone
            </option>
            <option value={PrivacyLevel.AUTHENTICATED}>
              Authenticated — visible to logged-in users only
            </option>
            <option value={PrivacyLevel.CONNECTIONS}>
              Connections — visible to connections only
            </option>
            <option value={PrivacyLevel.PRIVATE}>
              Private — not shown publicly
            </option>
          </FormField>

          <FormField
            classNames={classNames?.field}
            description="ISO 639-1 language code (e.g. en, es, fr, de)"
            fieldName="language"
            id={`${uid}-language`}
            label="Language"
            onChange={handleInputChange}
            placeholder="en"
            value={editedSet.language ?? "en"}
          />
        </div>

        <ExamplesList classNames={classNames?.examples} examples={examples} />
      </div>

      <EditorFooter
        classNames={classNames?.footer}
        onCancel={onCancel}
        onSave={handleSave}
        pronounSet={editedSet as unknown as PronounSet}
      />

      <style>{getPronounDetailEditorStyles()}</style>
    </div>
  );
};

export default PronounDetailEditor;
