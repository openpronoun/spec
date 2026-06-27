"use client";

import {
  closestCenter,
  DndContext,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import type { DragEndEvent, DragStartEvent, UniqueIdentifier } from "@dnd-kit/core";
import {
  arrayMove,
  horizontalListSortingStrategy,
  SortableContext,
} from "@dnd-kit/sortable";
import clsx from "clsx";
import React, { useMemo, useRef, useState } from "react";
import Select, { components } from "react-select";
import type { ActionMeta, GroupBase, MultiValue } from "react-select";

import {
  BadgeGroupHeading,
  BadgeOption,
  createBadgeMenuWithEditor,
} from "./BadgeMenuComponents";
import PronounDetailEditor from "./PronounDetailEditor";
import { formatGroupLabel, formatOptionLabel } from "./PronounOptionFormatter";
import {
  COMMON_PRONOUN_SETS,
  createExampleSentences,
  formatPronounSet,
  getObjective,
  getSubjective,
  isStandardSet,
  KNOWN_NEOPRONOUN_SETS,
  PronounType,
  SPECIAL_PRONOUN_SETS,
} from "./pronounUtils";
import type { PronounEntry, PronounSet } from "./pronounUtils";
import { getCustomStyles, getPronounSelectorStyles } from "./styles";
import { defaultTheme, mergeIcons, mergeTheme } from "./theme";
import {
  CustomMultiValueContainer,
  CustomMultiValueLabel,
  CustomMultiValueRemove,
} from "./PronounTag";
import SortableMultiValue from "./SortableMultiValue";
import type {
  PronounOption,
  PronounOptionGroup,
  PronounSelectorProps,
} from "./types";

/**
 * PronounSelector component for selecting pronoun sets
 */
export const PronounSelector: React.FC<PronounSelectorProps> = ({
  "aria-label": ariaLabel = "Pronoun selector",
  className,
  classNames,
  compactOptions = true,
  disabled = false,
  dropdownMode,
  grouped = true,
  icons,
  id,
  name,
  onChange,
  originalText,
  placeholder = "Select pronouns",
  theme,
  value = [],
}) => {
  // Compute effective compact mode: dropdownMode takes precedence over compactOptions
  const effectiveCompact =
    dropdownMode === "expanded"
      ? false
      : dropdownMode === "compact"
        ? true
        : compactOptions;

  const [editingPronounSet, setEditingPronounSet] = useState<null | PronounSet>(
    null,
  );
  const selectContainerRef = useRef<HTMLDivElement>(null);
  const [, setActiveId] = useState<null | UniqueIdentifier>(null);

  const resolvedTheme = theme ? mergeTheme(theme) : defaultTheme;
  const resolvedIcons = mergeIcons(icons);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  const customStyles = getCustomStyles(resolvedTheme);

  // Build option lists from the core dictionary
  const commonOptions: PronounOption[] = Object.values(COMMON_PRONOUN_SETS).map(
    (set) => ({
      examples: createExampleSentences(set).slice(0, 2),
      label: formatPronounSet(set, { format: "short" }),
      value: set,
    }),
  );

  const neoOptions: PronounOption[] = Object.values(KNOWN_NEOPRONOUN_SETS).map(
    (set) => ({
      examples: createExampleSentences(set).slice(0, 2),
      label: formatPronounSet(set, { format: "short" }),
      value: set,
    }),
  );

  const specialOptions: PronounOption[] = Object.values(
    SPECIAL_PRONOUN_SETS,
  ).map((set) => {
    let label = "";
    if (set.type === PronounType.ANY) label = "Any pronouns";
    else if (set.type === PronounType.NONE) label = "No pronouns (use name)";
    else if (set.type === PronounType.ASK) label = "Ask me";
    else if (set.type === PronounType.UNSPECIFIED) label = "Unspecified";

    return { label, value: set };
  });

  // Sentinel option that opens the custom editor
  const createCustomOption: PronounOption = {
    isCreate: true,
    isCustom: true,
    label: "Create custom pronoun set",
    value: { type: "custom", display: "" }, // placeholder; never surfaced to onChange
  };

  const groupedOptions: PronounOptionGroup[] = [
    { label: "Common Pronouns", options: commonOptions },
    { label: "Neopronouns", options: neoOptions },
    { label: "Special Options", options: specialOptions },
    { label: "Custom", options: [createCustomOption] },
  ];

  const flatOptions = groupedOptions.flatMap((g) => g.options);

  const findOptionInGroups = (
    predicate: (option: PronounOption) => boolean,
  ): PronounOption | undefined => {
    for (const group of groupedOptions) {
      const found = group.options.find(predicate);
      if (found) return found;
    }
    return undefined;
  };

  // Map current value to react-select options
  const selectedOptions: PronounOption[] = useMemo(() => {
    return value.map((entry, index) => {
      if (!entry) {
        return {
          id: `undefined-${index}`,
          label: "Unspecified",
          value: { type: "unspecified" } as PronounEntry,
        };
      }

      if (!isStandardSet(entry)) {
        // Special or custom entry — match by type
        const matchingOption = findOptionInGroups(
          (opt) =>
            !isStandardSet(opt.value) &&
            (opt.value as { type: string }).type ===
              (entry as { type: string }).type,
        );
        if (matchingOption) {
          return {
            ...matchingOption,
            id: `${(entry as { type: string }).type}-${index}`,
          };
        }
      } else {
        // Standard pronoun set — match by subjective + objective
        const sub = getSubjective(entry);
        const obl = getObjective(entry);
        const formattedLabel = formatPronounSet(entry, {
          format: "short",
          includeContext: true,
        });
        const matchingOption = findOptionInGroups(
          (opt) =>
            isStandardSet(opt.value) &&
            getSubjective(opt.value) === sub &&
            getObjective(opt.value) === obl,
        );
        if (matchingOption) {
          return {
            ...matchingOption,
            id: `${sub}-${obl}-${index}`,
            label: entry.context ? formattedLabel : matchingOption.label,
          };
        }
        // Not in the dictionary — user-entered custom set
        return {
          id: `custom-${sub}-${obl}-${index}`,
          isCustom: true,
          label: formattedLabel,
          value: entry,
        };
      }

      // Fallback: render as-is
      return {
        id: `entry-${index}`,
        label: formatPronounSet(entry, { format: "short" }),
        value: entry,
      };
    });
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleChange = (
    newValue: MultiValue<PronounOption>,
    actionMeta: ActionMeta<PronounOption>,
  ) => {
    if (
      actionMeta.action === "select-option" &&
      actionMeta.option?.isCreate
    ) {
      // Remove the sentinel from the selection and open the editor
      const filteredValue = newValue.filter((opt) => !opt.isCreate);
      setEditingPronounSet({
        subjective: "",
        objective: "",
        possessive_adjective: "",
        possessive_pronoun: "",
        reflexive: "",
      } as PronounSet);
      onChange(filteredValue.map((opt) => opt.value));
    } else {
      onChange(newValue.map((opt) => opt.value));
    }
  };

  const handleEditPronounSet = (pronounSet: PronounSet) => {
    setEditingPronounSet({ ...pronounSet });
  };

  const handleSavePronounSet = (editedSet: PronounSet) => {
    const editSub = editingPronounSet
      ? getSubjective(editingPronounSet)
      : "";
    const editObj = editingPronounSet
      ? getObjective(editingPronounSet)
      : "";
    const isNewSet = !editSub && !editObj;

    if (isNewSet) {
      onChange([...value, editedSet]);
    } else {
      const index = value.findIndex((entry) => {
        if (!isStandardSet(entry)) return false;
        return (
          getSubjective(entry) === editSub && getObjective(entry) === editObj
        );
      });
      const newValue = [...value];
      if (index !== -1) {
        newValue[index] = editedSet;
      } else {
        newValue.push(editedSet);
      }
      onChange(newValue);
    }
    setEditingPronounSet(null);
  };

  const handleCancelEdit = () => {
    setEditingPronounSet(null);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(event.active.id);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    if (over && active.id !== over.id) {
      const oldIndex = selectedOptions.findIndex(
        (opt) => opt.id === active.id,
      );
      const newIndex = selectedOptions.findIndex((opt) => opt.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onChange(arrayMove(value, oldIndex, newIndex));
      }
    }
    setActiveId(null);
  };

  return (
    <div
      className={clsx("pronoun-selector", className, classNames?.root)}
      ref={selectContainerRef}
    >
      {originalText && (
        <div
          className={clsx(
            "pronouns-selector__original-text",
            classNames?.originalTextBanner,
          )}
          style={{
            backgroundColor: resolvedTheme.colors.background,
            border: `1px solid ${resolvedTheme.colors.border}`,
            borderRadius: resolvedTheme.borderRadius,
            color: resolvedTheme.colors.helperText || resolvedTheme.colors.text,
            fontSize: resolvedTheme.fontSizes.small,
            marginBottom: "8px",
            padding: "8px 12px",
          }}
        >
          <span style={{ fontWeight: 600 }}>Original text: </span>
          <span style={{ fontStyle: "italic" }}>{originalText}</span>
        </div>
      )}
      <DndContext
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
        onDragStart={handleDragStart}
        sensors={sensors}
      >
        <SortableContext
          items={selectedOptions.map((opt) => opt.id || "")}
          strategy={horizontalListSortingStrategy}
        >
          <Select<PronounOption, true, GroupBase<PronounOption>>
            aria-describedby="pronoun-selector-description"
            aria-label={ariaLabel}
            blurInputOnSelect={editingPronounSet ? false : undefined}
            classNamePrefix="pronoun-select"
            closeMenuOnSelect={false}
            components={{
              ...(dropdownMode === "badges"
                ? {
                    GroupHeading: BadgeGroupHeading,
                    Menu: createBadgeMenuWithEditor(
                      editingPronounSet,
                      handleCancelEdit,
                      handleSavePronounSet,
                      classNames,
                      resolvedIcons,
                      theme,
                    ),
                    Option: BadgeOption,
                  }
                : {
                    Menu: (props) => (
                      <div
                        onClick={(e) =>
                          editingPronounSet && e.stopPropagation()
                        }
                        onMouseDown={(e) =>
                          editingPronounSet && e.stopPropagation()
                        }
                      >
                        <components.Menu {...props}>
                          {props.children}
                          {editingPronounSet && (
                            <div
                              className={clsx(
                                "pronoun-detail-editor-container",
                                classNames?.editorContainer,
                              )}
                              onClick={(e) => e.stopPropagation()}
                              onMouseDown={(e) => e.stopPropagation()}
                            >
                              <PronounDetailEditor
                                classNames={classNames?.editor}
                                icons={resolvedIcons}
                                onCancel={handleCancelEdit}
                                onSave={handleSavePronounSet}
                                pronounSet={editingPronounSet}
                                theme={theme}
                              />
                            </div>
                          )}
                        </components.Menu>
                      </div>
                    ),
                  }),
              MultiValue: SortableMultiValue,
              MultiValueContainer: CustomMultiValueContainer,
              MultiValueLabel: CustomMultiValueLabel,
              MultiValueRemove: (props) => (
                <CustomMultiValueRemove
                  {...props}
                  onEditPronounSet={handleEditPronounSet}
                />
              ),
            }}
            formatGroupLabel={(group) =>
              formatGroupLabel(group, classNames?.option)
            }
            formatOptionLabel={(option, meta) =>
              formatOptionLabel(
                option,
                meta,
                resolvedIcons,
                classNames?.option,
                effectiveCompact,
              )
            }
            {...({
              badgeClassNames: classNames,
              badgeTheme: resolvedTheme,
              icons: resolvedIcons,
              sortableValueClassNames: classNames?.sortableValue,
              tagClassNames: classNames?.tag,
            } as Record<string, unknown>)}
            id={id}
            isClearable={false}
            isDisabled={disabled}
            isMulti
            isSearchable={!editingPronounSet}
            menuIsOpen={editingPronounSet ? true : undefined}
            name={name}
            onChange={handleChange}
            options={
              dropdownMode === "badges" || !grouped
                ? flatOptions
                : groupedOptions
            }
            placeholder={placeholder}
            styles={customStyles}
            value={selectedOptions}
          />
        </SortableContext>
      </DndContext>

      <div
        className={clsx("sr-only", classNames?.screenReaderDescription)}
        id="pronoun-selector-description"
      >
        Select one or more pronoun sets. You can choose from common pronouns,
        neopronouns, or create a custom set. Use arrow keys to navigate options,
        space to select, and enter to open the selected option for editing.
      </div>

      <style>{getPronounSelectorStyles(resolvedTheme)}</style>
    </div>
  );
};

export default PronounSelector;
