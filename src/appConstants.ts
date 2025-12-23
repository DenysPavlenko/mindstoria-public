import { TNotificationSettings } from "./types";

export const APP_NAME = "Mindstoria";
export const APP_LANGUAGE_KEY = "appLanguage";
export const THEME_STORAGE_KEY = "appTheme";
export const BACKDOOR_STORAGE_KEY = "backdoorKey";

export const MAX_FREE_TRACKERS = 3;
export const TAB_BAR_LOG_BUTTON_PRESS = "tabBarLogButtonPress";
export const TAB_BAR_CBT_LOG_BUTTON_PRESS = "tabBarCbtLogButtonPress";

export const CHECK_IN_MIN_LEVEL = 1;
export const CHECK_IN_MAX_LEVEL = 10;

export const RANGE_MIN_LEVEL = 1;
export const RANGE_MAX_LEVEL = 5;

export const ENTITLEMENT_ID = "Mindstoria Pro";

export const MAX_FREE_CUSTOM_SENTIMENT_DEFINITIONS = 5;

export const BACKDOOR_CODE = "MINDSTORIA_K8X9";

export const PRIVACY_POLICY_URL =
  "https://denyspavlenko.github.io/mindstoria-policy";
export const EULA_URL =
  "https://www.apple.com/legal/internet-services/itunes/dev/stdeula/";

export const NOTIFICATION_SETTINGS: TNotificationSettings = {
  enabled: true,
  selectedDays: [0, 1, 2, 3, 4, 5, 6], // Monday to Sunday by default
  times: ["09:00", "21:00"], // Default times
};
