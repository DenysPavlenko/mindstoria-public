import { RootState } from "@/store/store";
import { createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const selectSettings = (state: RootState) => state.settings;

export const selectStartScreenShow = createSelector(
  selectSettings,
  (settings) => {
    return !settings.isWelcomeShown || !settings.isNotificationsSetupShown;
  },
);

export const selectIsRatingEligible = createSelector(
  selectSettings,
  (settings) => {
    if (settings.ratingStatus === "pending") return true;
    if (
      settings.ratingStatus === "postponed" &&
      settings.ratingPostponedUntil !== null &&
      dayjs().isAfter(dayjs(settings.ratingPostponedUntil))
    ) {
      return true;
    }
    return false;
  },
);
