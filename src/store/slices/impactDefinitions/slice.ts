import { LEGACY_IMPACT_TRANSLATION_PREFIXES } from "@/appConstants";
import {
  IMPACT_CATEGORY_DEFINITIONS,
  IMPACT_DEFINITIONS,
} from "@/data/impactDefinitions";
import { TImpactDefinition, TImpactDefinitions } from "@/types/impacts";
import { TSentimentCategoryDefinition } from "@/types/sentiment";
import { migrateDefinitions } from "@/utils";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

interface ImpactDefinitionsState {
  items: TImpactDefinitions;
  categories: Record<string, TSentimentCategoryDefinition>;
  categoryOrder: string[];
  version: number;
}

const IMPACT_DEFINITIONS_VERSION = 3;

const inititalItems = Object.fromEntries(
  IMPACT_DEFINITIONS.map((def) => [def.id, def]),
);
const initialCategories: Record<string, TSentimentCategoryDefinition> =
  Object.fromEntries(IMPACT_CATEGORY_DEFINITIONS.map((cat) => [cat.id, cat]));
const initialCategoryOrder = IMPACT_CATEGORY_DEFINITIONS.map((cat) => cat.id);

const initialState: ImpactDefinitionsState = {
  items: inititalItems,
  categories: initialCategories,
  categoryOrder: initialCategoryOrder,
  version: IMPACT_DEFINITIONS_VERSION,
};

export const impactDefinitionsSlice = createSlice({
  name: "impactDefinitions",
  initialState,
  reducers: {
    addImpactDefinition: (state, action: PayloadAction<TImpactDefinition>) => {
      const definition = action.payload;
      state.items[definition.id] = definition;
    },
    updateImpactDefinition: (
      state,
      action: PayloadAction<TImpactDefinition>,
    ) => {
      const definition = action.payload;
      state.items[definition.id] = definition;
    },
    archiveImpactDefinition: (state, action: PayloadAction<string>) => {
      const definitionId = action.payload;
      if (state.items[definitionId]) {
        state.items[definitionId].isArchived = true;
      }
    },
    importImpactDefinitions: (
      state,
      action: PayloadAction<TImpactDefinitions>,
    ) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state) => {
      if (state.version !== IMPACT_DEFINITIONS_VERSION) {
        const newDefs = migrateDefinitions(
          state.items,
          IMPACT_DEFINITIONS,
          LEGACY_IMPACT_TRANSLATION_PREFIXES,
        );
        state.items = newDefs;
        state.version = IMPACT_DEFINITIONS_VERSION;
      }
    });
  },
});

export const {
  addImpactDefinition,
  updateImpactDefinition,
  archiveImpactDefinition,
  importImpactDefinitions,
} = impactDefinitionsSlice.actions;

export default impactDefinitionsSlice.reducer;
