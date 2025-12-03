import { createSlice } from "@reduxjs/toolkit";

interface TSettingsState {
  showMedications: boolean;
  isWelcomeShown: boolean;
}

const initialState: TSettingsState = {
  showMedications: true,
  isWelcomeShown: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleShowMedications: (state) => {
      state.showMedications = !state.showMedications;
    },
    setWelcomeShown: (state) => {
      state.isWelcomeShown = true;
    },
  },
});

export const { toggleShowMedications, setWelcomeShown } = settingsSlice.actions;

export default settingsSlice.reducer;
