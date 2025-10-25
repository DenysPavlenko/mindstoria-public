import { createSlice } from "@reduxjs/toolkit";

interface TSettingsState {
  showMedications: boolean;
}

const initialState: TSettingsState = {
  showMedications: true,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleShowMedications: (state) => {
      state.showMedications = !state.showMedications;
    },
  },
});

export const { toggleShowMedications } = settingsSlice.actions;

export default settingsSlice.reducer;
