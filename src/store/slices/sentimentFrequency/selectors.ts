import { RootState } from "@/store/store";
import { TEmotionDefinition, TImpactDefinition } from "@/types";
import { createSelector } from "@reduxjs/toolkit";
import { selectActiveEmotionDefinitions } from "../emotionDefinitions/selectors";
import { selectActiveImpactDefinitions } from "../impactDefinitions/selectors";

const MAX_ITEMS = 12;

export const selectImpactFrequencies = (state: RootState) =>
  state.sentimentFrequency.impacts;
export const selectEmotionFrequencies = (state: RootState) =>
  state.sentimentFrequency.emotions;

export const selectTopImpactDefs = createSelector(
  [selectActiveImpactDefinitions, selectImpactFrequencies],
  (definitions, frequencies): TImpactDefinition[] => {
    return Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_ITEMS)
      .map(([id]) => definitions.find((def) => def.id === id))
      .filter((def) => !!def);
  },
);

export const selectTopEmotionDefs = createSelector(
  [selectActiveEmotionDefinitions, selectEmotionFrequencies],
  (definitions, frequencies): TEmotionDefinition[] => {
    return Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, MAX_ITEMS)
      .map(([id]) => definitions.find((def) => def.id === id))
      .filter((def) => !!def);
  },
);

// export const selectTopImpacts = (state: RootState, topN: number = 5) => {
//   const entries = Object.entries(state.sentimentFrequency.impacts);
//   return entries
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, topN)
//     .map(([id, count]) => ({ id, count }));
// };

// export const selectTopEmotions = (state: RootState, topN: number = 5) => {
//   const entries = Object.entries(state.sentimentFrequency.emotions);
//   return entries
//     .sort((a, b) => b[1] - a[1])
//     .slice(0, topN)
//     .map(([id, count]) => ({ id, count }));
// };

// export const selectTotalImpactFrequency = (state: RootState) =>
//   Object.values(state.sentimentFrequency.impacts).reduce((a, b) => a + b, 0);

// export const selectTotalEmotionFrequency = (state: RootState) =>
//   Object.values(state.sentimentFrequency.emotions).reduce((a, b) => a + b, 0);
