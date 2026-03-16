import { RootState } from "@/store/store";
import { createSelector } from "@reduxjs/toolkit";

const selectUI = (state: RootState) => state.ui;

export const selectStatsPeriod = createSelector(selectUI, (ui) => {
  return ui?.statsPreferences?.period ?? "week";
});

export const selectStatsDateIso = createSelector(selectUI, (ui) => {
  return ui?.statsSession?.dateIso ?? "";
});
