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
        // Merge new definitions with existing user-created ones
        const userCreated = Object.values(state.items).filter(
          (item) => item.isUserCreated
        );
        state.items = {
          ...Object.fromEntries(positiveEmotions.map((def) => [def.id, def])),
          ...Object.fromEntries(negativeEmotions.map((def) => [def.id, def])),
          ...Object.fromEntries(userCreated.map((def) => [def.id, def])),
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
