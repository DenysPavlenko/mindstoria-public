import { RootState } from "@/store";
import { TImpactDefinition } from "@/types";
import { createSelector } from "@reduxjs/toolkit";

const selectImpactDefinitionsItems = (state: RootState) =>
  state.impactDefinitions.items;

export const selectImpactDefinitions = createSelector(
  [selectImpactDefinitionsItems],
  (items): TImpactDefinition[] => {
    return Object.values(items);
  }
);

export const selectActiveImpactDefinitions = createSelector(
  [selectImpactDefinitions],
  (defs): TImpactDefinition[] => {
    return defs.filter((def) => !def.isArchived);
  }
);
