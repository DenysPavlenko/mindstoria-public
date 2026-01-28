import { APP_IDENTIFIER, SUPPORT_EMAIL } from "@/appConstants";
import { TTheme } from "@/theme";
import { RatingLevel, TTimePeriod } from "@/types";
import dayjs from "dayjs";
import * as Application from "expo-application";
import Constants from "expo-constants";
import * as Crypto from "expo-crypto";
import * as Device from "expo-device";
import { TFunction } from "i18next";
import { Linking, Platform } from "react-native";
import Purchases from "react-native-purchases";
import { getPeriodStartDate } from "./time";

const IS_IOS = Platform.OS === "ios";

export const getAppVariant = (): "development" | "preview" | "production" => {
  return Constants.expoConfig?.extra?.APP_VARIANT ?? "development";
};

export const generateUniqueId = (maxLength?: number): string => {
  return Crypto.randomUUID().slice(0, maxLength);
};

export const getRatingLevelLabel = (level: RatingLevel, t: TFunction) => {
  return t(`rating.${RatingLevel[level].toLowerCase()}`);
};

export const getRatingLevelColor = (
  level: RatingLevel,
  theme: TTheme,
): string => {
  const scaleMap = { 1: "50", 2: "100", 3: "200", 4: "300", 5: "400" } as const;
  return theme.colors.rating[scaleMap[level]];
};

export function filterDataByTimePeriod<T>(
  data: T[],
  parameter: keyof T,
  period: TTimePeriod,
  date = dayjs(),
): T[] {
  const startDate = getPeriodStartDate(period, date);
  return data.filter((item) => {
    const value = item[parameter];
    if (!value || typeof value !== "string") return false;
    const itemDate = dayjs(value);
    return (
      itemDate.isSameOrAfter(startDate, "day") &&
      itemDate.isSameOrBefore(date, "day")
    );
  });
}

export const getErrorMessage = (
  error: unknown,
  fallback: string = "Something went wrong",
) => {
  const message = error instanceof Error ? error.message : fallback;
  return !message || !message.trim() ? fallback : message;
};

export const openLink = async (url: string) => {
  const supported = await Linking.canOpenURL(url);
  if (!supported) {
    throw new Error(`Can't handle url: ${url}`);
  }
  if (supported) {
    await Linking.openURL(url);
  }
};

export const buildFeedbackUrl = async (t: TFunction) => {
  const subject = t("settings.feedback_subject");
  const customerInfo = await Purchases.getCustomerInfo();
  // Gather device and app info
  const deviceInfo = [
    `Device: ${Device.modelName || "Unknown"}`,
    `OS: ${Device.osName || "Unknown"} ${Device.osVersion || ""}`,
    `App Version: ${Application.nativeApplicationVersion || "Unknown"}`,
    `Build: ${Application.nativeBuildVersion || "Unknown"}`,
    `${customerInfo.originalAppUserId || "Unknown"}`,
  ].join("\n");
  const mailtoUrl = `mailto:${SUPPORT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(deviceInfo)}`;
  return mailtoUrl;
};

export const buildRateAppUrl = () => {
  const appId = IS_IOS ? Application.applicationId : APP_IDENTIFIER;
  const url = IS_IOS
    ? `itms-apps://apps.apple.com/app/id${appId}?action=write-review`
    : `market://details?id=${appId}`;
  return url;
};

export const isStringEmpty = (str?: string | null): boolean => {
  if (typeof str !== "string" || !str) return true;
  return str.trim().length === 0;
};
