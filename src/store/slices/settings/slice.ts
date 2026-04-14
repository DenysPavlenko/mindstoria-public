import { NOTIFICATION_SETTINGS } from "@/appConstants";
import { TCBTScreenView, TNotificationSettings } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

type TRatingStatus = "pending" | "rated" | "postponed";

interface TSettingsState {
  showMedications: boolean;
  isWelcomeShown: boolean;
  cbtScreenView: TCBTScreenView;
  isNotificationsSetupShown: boolean;
  notifications: TNotificationSettings;
  haptics: boolean;
  ratingStatus: TRatingStatus;
  ratingPostponedUntil: string | null;
  ratingPromptCount: number;
  showRatingPrompt: boolean;
}

const POSTPONE_DAYS = 30;

const initialState: TSettingsState = {
  showMedications: true,
  haptics: true,
  isWelcomeShown: false,
  isNotificationsSetupShown: false,
  cbtScreenView: "calendar",
  notifications: { ...NOTIFICATION_SETTINGS },
  ratingStatus: "pending",
  ratingPostponedUntil: null,
  ratingPromptCount: 0,
  showRatingPrompt: false,
};

export const settingsSlice = createSlice({
  name: "settings",
  initialState,
  reducers: {
    toggleShowMedications: (state) => {
      state.showMedications = !state.showMedications;
    },
    toggleHaptics: (state) => {
      state.haptics = !state.haptics;
    },
    setWelcomeShown: (state) => {
      state.isWelcomeShown = true;
    },
    setNotificationsSetupShown: (state) => {
      state.isNotificationsSetupShown = true;
    },
    // CBT Screen View
    setCbtScreenView: (state, action: PayloadAction<"list" | "calendar">) => {
      state.cbtScreenView = action.payload;
    },
    // Notification actions
    toggleNotifications: (state) => {
      state.notifications.enabled = !state.notifications.enabled;
    },
    disableNotifications: (state) => {
      state.notifications.enabled = false;
    },
    enableNotifications: (state) => {
      state.notifications.enabled = true;
    },
    toggleNotificationDay: (state, action: PayloadAction<number>) => {
      const day = action.payload;
      const index = state.notifications.selectedDays.indexOf(day);
      if (index > -1) {
        state.notifications.selectedDays.splice(index, 1);
      } else {
        state.notifications.selectedDays.push(day);
      }
    },
    addNotificationTime: (state, action: PayloadAction<string>) => {
      const time = action.payload;
      if (!state.notifications.times.includes(time)) {
        state.notifications.times.push(time);
        state.notifications.times.sort(); // Keep times sorted
      }
    },
    removeNotificationTime: (state, action: PayloadAction<string>) => {
      const time = action.payload;
      state.notifications.times = state.notifications.times.filter(
        (t) => t !== time,
      );
    },
    requestRatingPrompt: (state) => {
      state.showRatingPrompt = true;
      state.ratingPromptCount += 1;
    },
    clearRatingPrompt: (state) => {
      state.showRatingPrompt = false;
    },
    markAppRated: (state) => {
      state.ratingStatus = "rated";
    },
    postponeAppRating: (state) => {
      state.ratingStatus = "postponed";
      state.ratingPostponedUntil = dayjs()
        .add(POSTPONE_DAYS, "day")
        .toISOString();
    },
  },
});

export const {
  toggleShowMedications,
  toggleHaptics,
  setCbtScreenView,
  setWelcomeShown,
  setNotificationsSetupShown,
  toggleNotifications,
  disableNotifications,
  enableNotifications,
  toggleNotificationDay,
  addNotificationTime,
  removeNotificationTime,
  requestRatingPrompt,
  clearRatingPrompt,
  markAppRated,
  postponeAppRating,
} = settingsSlice.actions;

export default settingsSlice.reducer;
