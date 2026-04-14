import { MIXPANEL_SERVER_URL } from "@/appConstants";
import { TCBTScreenView, TUnknownObject } from "@/types";
import Constants from "expo-constants";
import { Mixpanel } from "mixpanel-react-native";
import { Platform } from "react-native";
import { getOrCreateUserId } from "./user";

// Dev-only flags — edit these to control analytics behavior in development
const DEV_ANALYTICS_ENABLED = true; // set false to disable all tracking in dev
const DEV_SEND_TO_SERVER = false; // set false to console.log only, no Mixpanel calls
const SET_LOGGING = false;

const getMixpanelToken = () => {
  return (
    process.env.EXPO_PUBLIC_MIXPANEL_PROJECT_TOKEN ||
    Constants.expoConfig?.extra?.mixpanelToken ||
    null
  );
};

const isAnalyticsEnabled = () => {
  if (__DEV__) return DEV_ANALYTICS_ENABLED;
  return true;
};

const shouldSendToServer = () => {
  if (__DEV__) return DEV_SEND_TO_SERVER;
  return true;
};

let mixpanel: Mixpanel | null = null;
const getMixpanel = () => {
  if (mixpanel) return mixpanel;

  const token = getMixpanelToken();
  if (!token) return null;

  const trackAutomaticEvents = false;
  mixpanel = new Mixpanel(token, trackAutomaticEvents);
  return mixpanel;
};

let initPromise: Promise<void> | null = null;
export const initAnalytics = async () => {
  if (!isAnalyticsEnabled()) return;

  const instance = getMixpanel();
  if (!instance) {
    console.warn("Mixpanel: missing project token");
    return;
  }

  if (!initPromise) {
    const serverURL = MIXPANEL_SERVER_URL;
    const superProperties = {
      app_variant: process.env.APP_VARIANT || "unknown",
      app_version: Constants.expoConfig?.version,
      platform: Platform.OS,
    };

    initPromise = instance.init(false, superProperties, serverURL);
  }

  try {
    await initPromise;
    if (SET_LOGGING) {
      instance.setLoggingEnabled(true);
    }
  } catch (error) {
    initPromise = null;
    console.warn("Mixpanel: init failed", error);
  }
};

export const initAnalyticsUser = async () => {
  if (!isAnalyticsEnabled()) return;
  const userId = await getOrCreateUserId();
  await initAnalytics();
  await getMixpanel()?.identify(userId);
};

export const trackEvent = (name: string, data?: TUnknownObject) => {
  if (!isAnalyticsEnabled()) return;
  if (!shouldSendToServer()) {
    console.log("[analytics]", name, data);
    return;
  }
  initAnalytics().then(() => {
    getMixpanel()?.track(name, data);
  });
};

export const trackUserProfile = async (data: {
  locale: string;
  subscriptionActive: boolean;
  theme: "light" | "dark" | "system";
  notificationsEnabled: boolean;
  appVersion: string | undefined;
  cbtView: TCBTScreenView;
}) => {
  if (!isAnalyticsEnabled()) return;
  if (!shouldSendToServer()) {
    console.log("[analytics:profile]", data);
    return;
  }
  await initAnalytics();
  getMixpanel()?.getPeople().set(data);
};
