import { LEGACY_EMOTION_TRANSLATION_PREFIXES } from "@/appConstants";
import { EMOTION_CATEGORY_DEFINITIONS, EMOTION_DEFINITIONS } from "@/data";
import {
  TEmotionDefinition,
  TEmotionDefinitions,
  TSentimentCategoryDefinition,
} from "@/types";
import { migrateDefinitions } from "@/utils/definitionMigration";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

interface EmotionDefinitionsState {
  items: TEmotionDefinitions;
  categories: Record<string, TSentimentCategoryDefinition>;
  categoryOrder: string[];
  version: number;
}

const EMOTION_DEFINITIONS_VERSION = 2;

const initialItems = Object.fromEntries(
  EMOTION_DEFINITIONS.map((def) => [def.id, def]),
);
const initialCategories: Record<string, TSentimentCategoryDefinition> =
  Object.fromEntries(EMOTION_CATEGORY_DEFINITIONS.map((cat) => [cat.id, cat]));
const initialCategoryOrder = EMOTION_CATEGORY_DEFINITIONS.map((cat) => cat.id);

const initialState: EmotionDefinitionsState = {
  items: initialItems,
  categories: initialCategories,
  categoryOrder: initialCategoryOrder,
  version: EMOTION_DEFINITIONS_VERSION,
};

export const emotionDefinitionsSlice = createSlice({
  name: "emotionDefinitions",
  initialState,
  reducers: {
    addEmotionDefinition: (
      state,
      action: PayloadAction<TEmotionDefinition>,
    ) => {
      const definition = action.payload;
      state.items[definition.id] = definition;
    },
    updateEmotionDefinition: (
      state,
      action: PayloadAction<TEmotionDefinition>,
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
      action: PayloadAction<TEmotionDefinitions>,
    ) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state) => {
      if (state.version !== EMOTION_DEFINITIONS_VERSION) {
        const newDefs = migrateDefinitions(
          state.items,
          EMOTION_DEFINITIONS,
          LEGACY_EMOTION_TRANSLATION_PREFIXES,
        );
        state.items = newDefs;
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
