import { RootState } from "@/store";
import { TEmotionDefinition } from "@/types/emotions";
import { TSentimentSection } from "@/types/sentiment";
import { buildSentimentSections } from "@/utils";
import { createSelector } from "@reduxjs/toolkit";

export const selectEmotionDefinitionItems = (state: RootState) =>
  state.emotionDefinitions.items;
export const selectEmotionDefinitionCategories = (state: RootState) =>
  state.emotionDefinitions.categories;
export const selectEmotionDefinitionCategoryOrder = (state: RootState) =>
  state.emotionDefinitions.categoryOrder;

export const selectEmotionDefinitions = createSelector(
  [selectEmotionDefinitionItems],
  (items): TEmotionDefinition[] => Object.values(items),
);

export const selectActiveEmotionDefinitions = createSelector(
  [selectEmotionDefinitions],
  (defs): TEmotionDefinition[] => defs.filter((def) => !def.isArchived),
);

export const selectArchivedEmotionDefinitions = createSelector(
  [selectEmotionDefinitions],
  (defs): TEmotionDefinition[] => defs.filter((def) => !!def.isArchived),
);

export const selectAllEmotionSections = createSelector(
  [
    selectEmotionDefinitionCategoryOrder,
    selectEmotionDefinitionCategories,
    selectEmotionDefinitions,
  ],
  (categoryOrder, categories, emotions): TSentimentSection[] =>
    buildSentimentSections(categoryOrder, categories, emotions),
);

export const selectEmotionSections = createSelector(
  [selectAllEmotionSections],
  (sections): TSentimentSection[] => {
    return sections.map((section) => {
      return {
        ...section,
        data: section.data.filter((emotion) => !emotion.isArchived),
      };
    });
  },
);
