import { TMedication, TMedications } from "@/types/medications";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MedicationsState {
  items: TMedications;
}

const initialState: MedicationsState = {
  items: {},
};

const medicationsSlice = createSlice({
  name: "medications",
  initialState,
  reducers: {
    addMedication(state, action: PayloadAction<TMedication>) {
      const medication = action.payload;
      state.items[medication.id] = medication;
    },
    updateMedication(state, action: PayloadAction<TMedication>) {
      const medication = action.payload;
      state.items[medication.id] = medication;
    },
    deactivateMedication(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id].isActive = false;
      }
    },
    activateMedication(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id].isActive = true;
      }
    },
    archiveMedication(state, action: PayloadAction<string>) {
      const id = action.payload;
      if (state.items[id]) {
        state.items[id].isArchived = true;
      }
    },
    importMedications(state, action: PayloadAction<TMedications>) {
      state.items = action.payload;
    },
  },
});

export const {
  addMedication,
  updateMedication,
  deactivateMedication,
  activateMedication,
  archiveMedication,
  importMedications,
} = medicationsSlice.actions;

export default medicationsSlice.reducer;
