import { RootState } from "@/store/store";
import { createSelector } from "@reduxjs/toolkit";

const selectSettings = (state: RootState) => state.settings;

export const selectStartScreenShow = createSelector(
  selectSettings,
  (settings) => {
    return !settings.isWelcomeShown || !settings.isNotificationsSetupShown;
  }
);
