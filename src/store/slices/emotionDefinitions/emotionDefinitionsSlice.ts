import { negativeEmotions, positiveEmotions } from "@/data";
import { TEmotionDefinition, TEmotionDefinitions } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

interface EmotionDefinitionsState {
  items: TEmotionDefinitions;
  version: number;
}

const EMOTION_DEFINITIONS_VERSION = 1;

const initialState: EmotionDefinitionsState = {
  items: {
    ...Object.fromEntries(positiveEmotions.map((def) => [def.id, def])),
    ...Object.fromEntries(negativeEmotions.map((def) => [def.id, def])),
  },
  version: EMOTION_DEFINITIONS_VERSION,
};

export const emotionDefinitionsSlice = createSlice({
  name: "emotionDefinitions",
  initialState,
  reducers: {
    addEmotionDefinition: (
      state,
      action: PayloadAction<TEmotionDefinition>
    ) => {
      const definition = action.payload;
      state.items[definition.id] = definition;
    },
    updateEmotionDefinition: (
      state,
      action: PayloadAction<TEmotionDefinition>
    ) => {
      const definition = action.payload;
      state.items[definition.id] = definition;
    },
    archiveEmotionDefinition: (state, action: PayloadAction<string>) => {
      const definitionId = action.payload;
      if (state.items[definitionId]) {
        state.items[definitionId].isArchived = true;
      }
    },
    importEmotionDefinitions: (
      state,
      action: PayloadAction<TEmotionDefinitions>
    ) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state) => {
      if (state.version !== EMOTION_DEFINITIONS_VERSION) {
        // Get current default IDs
        const currentDefaultIds = new Set([
          ...positiveEmotions.map((def) => def.id),
          ...negativeEmotions.map((def) => def.id),
        ]);

        // Keep existing items that are either user-created OR still in defaults
        const itemsToKeep = Object.values(state.items).filter((item) => {
          return item.isUserCreated || currentDefaultIds.has(item.id);
        });

        // Add any new default items
        const existingIds = new Set(itemsToKeep.map((item) => item.id));
        const newDefaults = [
          ...positiveEmotions.filter((def) => !existingIds.has(def.id)),
          ...negativeEmotions.filter((def) => !existingIds.has(def.id)),
        ];

        state.items = {
          ...Object.fromEntries(itemsToKeep.map((item) => [item.id, item])),
          ...Object.fromEntries(newDefaults.map((def) => [def.id, def])),
        };
        state.version = EMOTION_DEFINITIONS_VERSION;
      }
    });
  },
});

export const {
  addEmotionDefinition,
  updateEmotionDefinition,
  archiveEmotionDefinition,
  importEmotionDefinitions,
} = emotionDefinitionsSlice.actions;

export default emotionDefinitionsSlice.reducer;
