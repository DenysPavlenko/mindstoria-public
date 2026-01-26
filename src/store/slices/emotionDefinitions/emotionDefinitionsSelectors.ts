import { RootState } from "@/store";
import { TEmotionDefinition } from "@/types";
import { createSelector } from "@reduxjs/toolkit";

const selectEmotionDefinitionsItems = (state: RootState) => {
  return state.emotionDefinitions.items;
};

export const selectEmotionDefinitions = createSelector(
  [selectEmotionDefinitionsItems],
  (items): TEmotionDefinition[] => {
    return Object.values(items);
  },
);

export const selectActiveEmotionDefinitions = createSelector(
  [selectEmotionDefinitions],
  (defs): TEmotionDefinition[] => {
    return defs.filter((def) => !def.isArchived);
  },
);
