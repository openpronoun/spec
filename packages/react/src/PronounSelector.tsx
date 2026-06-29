"use client";

import { Combobox, createListCollection } from "@ark-ui/react/combobox";
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
import React, { useMemo, useState } from "react";

import PronounDetailEditor from "./PronounDetailEditor";
import { formatOptionLabel } from "./PronounOptionFormatter";
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
import { getPronounCSSVars, getPronounSelectorStyles } from "./styles";
import { defaultTheme, mergeIcons, mergeTheme } from "./theme";
import SortableMultiValue from "./SortableMultiValue";
import type {
  PronounOption,
  PronounOptionGroup,
  PronounSelectorProps,
} from "./types";

const CREATE_SENTINEL_VALUE = "__create-custom__";

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
  const effectiveCompact =
    dropdownMode === "expanded"
      ? false
      : dropdownMode === "compact"
        ? true
        : compactOptions;

  const [editingPronounSet, setEditingPronounSet] = useState<null | PronounSet>(null);
  const [inputValue, setInputValue] = useState("");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [, setActiveId] = useState<null | UniqueIdentifier>(null);

  const resolvedTheme = theme ? mergeTheme(theme) : defaultTheme;
  const resolvedIcons = mergeIcons(icons);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } }),
    useSensor(KeyboardSensor),
  );

  // ── Option lists ──────────────────────────────────────────────────────────

  const commonOptions: PronounOption[] = useMemo(
    () =>
      Object.values(COMMON_PRONOUN_SETS).map((set) => ({
        examples: createExampleSentences(set).slice(0, 2),
        id: `common-${formatPronounSet(set, { format: "short" })}`,
        label: formatPronounSet(set, { format: "short" }),
        value: set,
      })),
    [],
  );

  const neoOptions: PronounOption[] = useMemo(
    () =>
      Object.values(KNOWN_NEOPRONOUN_SETS).map((set) => ({
        examples: createExampleSentences(set).slice(0, 2),
        id: `neo-${formatPronounSet(set, { format: "short" })}`,
        label: formatPronounSet(set, { format: "short" }),
        value: set,
      })),
    [],
  );

  const specialOptions: PronounOption[] = useMemo(
    () =>
      Object.values(SPECIAL_PRONOUN_SETS).map((set) => {
        let label = "";
        if (set.type === PronounType.ANY) label = "Any pronouns";
        else if (set.type === PronounType.NONE) label = "No pronouns (use name)";
        else if (set.type === PronounType.ASK) label = "Ask me";
        else if (set.type === PronounType.UNSPECIFIED) label = "Unspecified";
        return { id: `special-${set.type}`, label, value: set };
      }),
    [],
  );

  const createCustomOption: PronounOption = useMemo(
    () => ({
      id: CREATE_SENTINEL_VALUE,
      isCreate: true,
      isCustom: true,
      label: "Create custom pronoun set",
      value: { type: "custom", display: "" },
    }),
    [],
  );

  const groupedOptions: PronounOptionGroup[] = useMemo(
    () => [
      { label: "Common Pronouns", options: commonOptions },
      { label: "Neopronouns", options: neoOptions },
      { label: "Special Options", options: specialOptions },
      { label: "Custom", options: [createCustomOption] },
    ],
    [commonOptions, neoOptions, specialOptions, createCustomOption],
  );

  const allOptions = useMemo(
    () => groupedOptions.flatMap((g) => g.options),
    [groupedOptions],
  );

  // ── Filtering ─────────────────────────────────────────────────────────────

  const filteredOptions = useMemo(() => {
    if (!inputValue) return allOptions;
    const lower = inputValue.toLowerCase();
    return allOptions.filter(
      (opt) => opt.isCreate || opt.label.toLowerCase().includes(lower),
    );
  }, [allOptions, inputValue]);

  const filteredGroupedOptions = useMemo(() => {
    if (!inputValue) return groupedOptions;
    const filteredSet = new Set(filteredOptions);
    return groupedOptions
      .map((g) => ({ ...g, options: g.options.filter((o) => filteredSet.has(o)) }))
      .filter((g) => g.options.length > 0);
  }, [groupedOptions, filteredOptions, inputValue]);

  // ── Ark UI collection ─────────────────────────────────────────────────────

  const collection = useMemo(
    () =>
      createListCollection({
        itemToString: (item) => item.label,
        itemToValue: (item) => item.id ?? item.label,
        items: filteredOptions,
      }),
    [filteredOptions],
  );

  // ── Selected options ──────────────────────────────────────────────────────

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
        const matchingOption = allOptions.find(
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
        const sub = getSubjective(entry);
        const obl = getObjective(entry);
        const formattedLabel = formatPronounSet(entry, {
          format: "short",
          includeContext: true,
        });
        const matchingOption = allOptions.find(
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
        return {
          id: `custom-${sub}-${obl}-${index}`,
          isCustom: true,
          label: formattedLabel,
          value: entry,
        };
      }

      return {
        id: `entry-${index}`,
        label: formatPronounSet(entry, { format: "short" }),
        value: entry,
      };
    });
  }, [value, allOptions]); // eslint-disable-line react-hooks/exhaustive-deps

  // selectedValues must use the same IDs as collection.itemToValue so Ark UI can
  // correctly track which items are selected (distinct from dnd-kit's index IDs).
  const selectedValues = useMemo(() => {
    return value.flatMap((entry): string[] => {
      if (!entry) return [];
      if (!isStandardSet(entry)) {
        const match = allOptions.find(
          (o) =>
            !isStandardSet(o.value) &&
            (o.value as { type: string }).type ===
              (entry as { type: string }).type,
        );
        return match ? [match.id ?? match.label] : [];
      }
      const sub = getSubjective(entry);
      const obl = getObjective(entry);
      const match = allOptions.find(
        (o) =>
          isStandardSet(o.value) &&
          getSubjective(o.value) === sub &&
          getObjective(o.value) === obl,
      );
      return match ? [match.id ?? match.label] : [];
    });
  }, [value, allOptions]);

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleValueChange = ({ value: newValues }: { value: string[] }) => {
    if (newValues.includes(CREATE_SENTINEL_VALUE)) {
      setEditingPronounSet({
        objective: "",
        possessive_adjective: "",
        possessive_pronoun: "",
        reflexive: "",
        subjective: "",
      } as PronounSet);
      return;
    }
    const newEntries = newValues
      .map((v) => allOptions.find((o) => (o.id ?? o.label) === v)?.value)
      .filter((e): e is PronounEntry => e !== undefined);
    onChange(newEntries);
    setInputValue("");
  };

  const handleInputChange = ({ inputValue: next }: { inputValue: string }) => {
    setInputValue(next);
  };

  const handleOpenChange = ({ open }: { open: boolean }) => {
    if (!open && editingPronounSet) return;
    setIsMenuOpen(open);
  };

  const handleEditPronounSet = (pronounSet: PronounSet) => {
    setEditingPronounSet({ ...pronounSet });
  };

  const handleSavePronounSet = (editedSet: PronounSet) => {
    const editSub = editingPronounSet ? getSubjective(editingPronounSet) : "";
    const editObj = editingPronounSet ? getObjective(editingPronounSet) : "";
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
      const oldIndex = selectedOptions.findIndex((opt) => opt.id === active.id);
      const newIndex = selectedOptions.findIndex((opt) => opt.id === over.id);
      if (oldIndex !== -1 && newIndex !== -1) {
        onChange(arrayMove(value, oldIndex, newIndex));
      }
    }
    setActiveId(null);
  };

  // ── Badge mode option click ───────────────────────────────────────────────

  const handleBadgeClick = (opt: PronounOption) => {
    if (opt.isCreate) {
      setEditingPronounSet({
        objective: "",
        possessive_adjective: "",
        possessive_pronoun: "",
        reflexive: "",
        subjective: "",
      } as PronounSet);
      return;
    }
    const optId = opt.id ?? opt.label;
    const isSelected = selectedValues.includes(optId);
    handleValueChange({
      value: isSelected
        ? selectedValues.filter((v) => v !== optId)
        : [...selectedValues, optId],
    });
  };

  // ── Render ────────────────────────────────────────────────────────────────

  const displayGroups = grouped ? filteredGroupedOptions : [{ label: "", options: filteredOptions }];

  return (
    <div
      className={clsx("pronoun-selector", className, classNames?.root)}
      style={getPronounCSSVars(resolvedTheme)}
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
        <Combobox.Root
          collection={collection}
          disabled={disabled}
          id={id}
          inputBehavior="none"
          inputValue={inputValue}
          multiple
          onInputValueChange={handleInputChange}
          onOpenChange={handleOpenChange}
          onValueChange={handleValueChange}
          open={editingPronounSet ? true : isMenuOpen}
          value={selectedValues}
        >
          <Combobox.Control
            aria-label={ariaLabel}
            className={clsx("pronoun-select__control", classNames?.control)}
          >
            <SortableContext
              items={selectedOptions.map((opt) => opt.id ?? "")}
              strategy={horizontalListSortingStrategy}
            >
              {selectedOptions.map((opt) => (
                <SortableMultiValue
                  key={opt.id}
                  classNames={classNames?.sortableValue}
                  icons={resolvedIcons}
                  id={opt.id ?? opt.label}
                  onEdit={handleEditPronounSet}
                  onRemove={(removeId) => {
                    const idx = selectedOptions.findIndex((o) => o.id === removeId);
                    if (idx !== -1) onChange(value.filter((_, i) => i !== idx));
                  }}
                  option={opt}
                  tagClassNames={classNames?.tag}
                />
              ))}
            </SortableContext>

            <Combobox.Input
              aria-describedby="pronoun-selector-description"
              className={clsx("pronoun-select__input", classNames?.input)}
              disabled={!!editingPronounSet}
              name={name}
              placeholder={selectedOptions.length === 0 ? placeholder : undefined}
            />

            <Combobox.Trigger
              aria-label="Toggle pronoun options"
              className={clsx("pronoun-select__trigger", classNames?.trigger)}
            >
              <svg
                aria-hidden="true"
                fill="none"
                height="16"
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                viewBox="0 0 16 16"
                width="16"
              >
                <path d="M4 6l4 4 4-4" />
              </svg>
            </Combobox.Trigger>
          </Combobox.Control>

          <Combobox.Positioner className="pronoun-select__positioner">
            <Combobox.Content
              className={clsx(
                "pronoun-select__menu",
                dropdownMode === "badges" && "pronoun-badge-menu",
                classNames?.menu,
              )}
            >
              {dropdownMode === "badges" ? (
                // ── Badges mode: flat pill grid ───────────────────────────
                <>
                  {!editingPronounSet &&
                    allOptions.map((opt) => (
                      <Combobox.Item
                        key={opt.id ?? opt.label}
                        className={clsx(
                          "pronoun-badge-pill",
                          opt.isCreate && "pronoun-badge-pill--custom",
                          classNames?.badgePill,
                          selectedValues.includes(opt.id ?? opt.label) &&
                            clsx("pronoun-badge-pill--selected", classNames?.badgePillSelected),
                          opt.isCreate && classNames?.badgePillCustom,
                        )}
                        item={opt}
                        onClick={opt.isCreate ? () => handleBadgeClick(opt) : undefined}
                      >
                        <Combobox.ItemIndicator>
                          <span
                            className={clsx(
                              "pronoun-badge-check",
                              classNames?.badgeCheckIcon,
                            )}
                          >
                            ✓
                          </span>
                        </Combobox.ItemIndicator>
                        <Combobox.ItemText>
                          {opt.isCreate ? (
                            <>{resolvedIcons.create} Custom</>
                          ) : (
                            opt.label
                          )}
                        </Combobox.ItemText>
                      </Combobox.Item>
                    ))}

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
                </>
              ) : (
                // ── Standard / expanded mode: grouped list ────────────────
                <>
                  {displayGroups.map((group) => (
                    <Combobox.ItemGroup
                      key={group.label || "all"}
                      id={group.label || "all"}
                    >
                      {group.label && (
                        <Combobox.ItemGroupLabel
                          className={clsx(
                            "pronoun-group-label",
                            classNames?.option?.groupLabel,
                          )}
                        >
                          <span
                            className={clsx(
                              "pronoun-group-label-text",
                              classNames?.option?.groupLabelText,
                            )}
                          >
                            {group.label}
                          </span>
                          <span
                            className={clsx(
                              "pronoun-group-count",
                              classNames?.option?.groupCount,
                            )}
                          >
                            {group.options.length}
                          </span>
                        </Combobox.ItemGroupLabel>
                      )}

                      {group.options.map((opt) => (
                        <Combobox.Item
                          key={opt.id ?? opt.label}
                          className={clsx(
                            "pronoun-select__option",
                            opt.isCreate && "pronoun-select__option--create",
                            classNames?.option?.optionLabel,
                          )}
                          item={opt}
                        >
                          <Combobox.ItemText>
                            {formatOptionLabel(
                              opt,
                              resolvedIcons,
                              classNames?.option,
                              effectiveCompact,
                            )}
                          </Combobox.ItemText>
                          {!opt.isCreate && (
                            <Combobox.ItemIndicator
                              className="pronoun-select__item-indicator"
                            >
                              ✓
                            </Combobox.ItemIndicator>
                          )}
                        </Combobox.Item>
                      ))}
                    </Combobox.ItemGroup>
                  ))}

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
                </>
              )}
            </Combobox.Content>
          </Combobox.Positioner>
        </Combobox.Root>
      </DndContext>

      <div
        className={clsx("sr-only", classNames?.screenReaderDescription)}
        id="pronoun-selector-description"
      >
        Select one or more pronoun sets. You can choose from common pronouns,
        neopronouns, or create a custom set. Use arrow keys to navigate options,
        space to select, and enter to open the selected option for editing.
      </div>

      <style>{getPronounSelectorStyles()}</style>
    </div>
  );
};

export default PronounSelector;
