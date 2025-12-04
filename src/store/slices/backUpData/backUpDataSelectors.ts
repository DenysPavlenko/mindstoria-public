import { RootState } from "@/store";
import { TBackUpData } from "@/types";
import { createSelector } from "@reduxjs/toolkit";

const selectState = (state: RootState) => {
  return state;
};

export const selectDataToBackUp = createSelector(
  [selectState],
  (state): TBackUpData => {
    return {
      emotionDefinitions: state.emotionDefinitions.items,
      impactDefinitions: state.impactDefinitions.items,
      medications: state.medications.items,
      sleepLogs: state.sleepLogs.items,
      medLogs: state.medLogs.items,
      logs: state.logs.items,
      cbtLogs: state.cbtLogs.items,
    };
  }
);
