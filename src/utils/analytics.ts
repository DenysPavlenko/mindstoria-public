import { storage } from "@/services";
import { TUnknownObject } from "@/types";
import { Mixpanel } from "mixpanel-react-native";
import { getOrCreateUserId } from "./user";

const MIXPANEL_API_KEY = process.env.EXPO_PUBLIC_MIXPANEL_PROJECT_TOKEN || "";

const trackAutomaticEvents = false; // disable legacy autotrack mobile events
const useNative = false; // use JS implementation
const mixpanel = new Mixpanel(
  MIXPANEL_API_KEY,
  trackAutomaticEvents,
  useNative,
  storage,
);

export const trackEvent = (name: string, data?: TUnknownObject) => {
  if (__DEV__) {
    // console.log("lg:trackEvent", name, data);
  }
  mixpanel.track(name, data);
};

export const resetTracking = async () => {
  mixpanel.reset();
};

export const initAnalytics = async () => {
  await mixpanel.init();
  mixpanel.setServerURL("https://api-eu.mixpanel.com");
  // mixpanel.setLoggingEnabled(__DEV__);
};

export const initAnalyticsUser = async () => {
  const userId = await getOrCreateUserId();
  await mixpanel.identify(userId);
};

export const trackUserProfile = async (data: {
  locale: string;
  subscriptionActive: boolean;
  theme: "light" | "dark" | "system";
  cbtView: "list" | "calendar";
  notificationsEnabled: boolean;
}) => {
  if (__DEV__) {
    console.log("lg:trackUserProfile", data);
  }
  mixpanel.getPeople().set(data);
};
