import { RootState } from "@/store";
import { TImpactDefinition, TSentimentSection } from "@/types";
import { buildSentimentSections } from "@/utils";
import { createSelector } from "@reduxjs/toolkit";

export const selectImpactDefinitionItems = (state: RootState) =>
  state.impactDefinitions.items;
export const selectImpactDefinitionCategories = (state: RootState) =>
  state.impactDefinitions.categories;
export const selectImpactDefinitionCategoryOrder = (state: RootState) =>
  state.impactDefinitions.categoryOrder;

export const selectImpactDefinitions = createSelector(
  [selectImpactDefinitionItems],
  (items): TImpactDefinition[] => {
    return Object.values(items);
  },
);

export const selectActiveImpactDefinitions = createSelector(
  [selectImpactDefinitions],
  (defs): TImpactDefinition[] => {
    return defs.filter((def) => !def.isArchived);
  },
);

export const selectArchivedImpactDefinitions = createSelector(
  [selectImpactDefinitions],
  (defs): TImpactDefinition[] => defs.filter((def) => !!def.isArchived),
);

export const selectAllImpactSections = createSelector(
  [
    selectImpactDefinitionCategoryOrder,
    selectImpactDefinitionCategories,
    selectImpactDefinitions,
  ],
  (categoryOrder, categories, impacts): TSentimentSection[] =>
    buildSentimentSections(categoryOrder, categories, impacts),
);

export const selectImpactSections = createSelector(
  [selectAllImpactSections],
  (sections): TSentimentSection[] => {
    return sections.map((section) => {
      return {
        ...section,
        data: section.data.filter((impact) => !impact.isArchived),
      };
    });
  },
);
