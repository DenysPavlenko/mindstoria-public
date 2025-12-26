import { negativeImpacts, positiveImpacts } from "@/data";
import { TImpactDefinition, TImpactDefinitions } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { REHYDRATE } from "redux-persist";

interface ImpactDefinitionsState {
  items: TImpactDefinitions;
  version: number;
}

const IMPACT_DEFINITIONS_VERSION = 2;

const initialState: ImpactDefinitionsState = {
  items: {
    ...Object.fromEntries(positiveImpacts.map((def) => [def.id, def])),
    ...Object.fromEntries(negativeImpacts.map((def) => [def.id, def])),
  },
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
      action: PayloadAction<TImpactDefinition>
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
      action: PayloadAction<TImpactDefinitions>
    ) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(REHYDRATE, (state) => {
      if (state.version !== IMPACT_DEFINITIONS_VERSION) {
        // Get current default IDs
        const currentDefaultIds = new Set([
          ...positiveImpacts.map((def) => def.id),
          ...negativeImpacts.map((def) => def.id),
        ]);

        // Keep existing items that are either user-created OR still in defaults
        const itemsToKeep = Object.values(state.items).filter((item) => {
          return item.isUserCreated || currentDefaultIds.has(item.id);
        });

        // Add any new default items
        const existingIds = new Set(itemsToKeep.map((item) => item.id));
        const newDefaults = [
          ...positiveImpacts.filter((def) => !existingIds.has(def.id)),
          ...negativeImpacts.filter((def) => !existingIds.has(def.id)),
        ];

        state.items = {
          ...Object.fromEntries(itemsToKeep.map((item) => [item.id, item])),
          ...Object.fromEntries(newDefaults.map((def) => [def.id, def])),
        };
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
