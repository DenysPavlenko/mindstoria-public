import { NOTIFICATION_SETTINGS } from "@/appConstants";
import { TNotificationSettings } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface TSettingsState {
  showMedications: boolean;
  isWelcomeShown: boolean;
  isNotificationsSetupShown: boolean;
  notifications: TNotificationSettings;
}

const initialState: TSettingsState = {
  showMedications: true,
  isWelcomeShown: false,
  isNotificationsSetupShown: false,
  notifications: { ...NOTIFICATION_SETTINGS },
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
    setNotificationsSetupShown: (state) => {
      state.isNotificationsSetupShown = true;
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
        (t) => t !== time
      );
    },
  },
});

export const {
  toggleShowMedications,
  setWelcomeShown,
  setNotificationsSetupShown,
  toggleNotifications,
  disableNotifications,
  enableNotifications,
  toggleNotificationDay,
  addNotificationTime,
  removeNotificationTime,
} = settingsSlice.actions;

export default settingsSlice.reducer;
