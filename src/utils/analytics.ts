import { MIXPANEL_SERVER_URL } from "@/appConstants";
import { TUnknownObject } from "@/types";
import Constants from "expo-constants";
import { Mixpanel } from "mixpanel-react-native";
import { Platform } from "react-native";
import { getOrCreateUserId } from "./user";

const setLogging = false;

const getMixpanelToken = () => {
  return (
    process.env.EXPO_PUBLIC_MIXPANEL_PROJECT_TOKEN ||
    Constants.expoConfig?.extra?.mixpanelToken ||
    null
  );
};

const isAnalyticsEnabled = () => {
  if (__DEV__) return true;
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
    if (setLogging) {
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
  initAnalytics().then(() => {
    getMixpanel()?.track(name, data);
  });
};

export const trackUserProfile = async (data: {
  locale: string;
  subscriptionActive: boolean;
  theme: "light" | "dark" | "system";
  cbtView: "list" | "calendar";
  notificationsEnabled: boolean;
  appVersion: string | undefined;
}) => {
  if (!isAnalyticsEnabled()) return;
  await initAnalytics();
  getMixpanel()?.getPeople().set(data);
};
