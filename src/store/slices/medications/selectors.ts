import { RootState } from "@/store/store";
import { TMedication } from "@/types";
import { createSelector } from "@reduxjs/toolkit";

const selectMedicationItems = (state: RootState) => state.medications.items;

export const selectMedications = createSelector(
  [selectMedicationItems],
  (medications): TMedication[] => {
    return Object.values(medications);
  }
);

export const selectNonArchivedMedications = createSelector(
  [selectMedications],
  (medications): TMedication[] => {
    return medications.filter((med) => !med.isArchived);
  }
);

export const selectActiveMedications = createSelector(
  [selectMedications],
  (medications): TMedication[] => {
    return medications.filter((med) => med.isActive);
  }
);
