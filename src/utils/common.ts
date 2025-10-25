import { TTheme } from "@/theme";
import {
  RatingLevel,
  TSentimentLevel,
  TSentimentType,
  TTimePeriod,
} from "@/types";
import dayjs from "dayjs";
import Constants from "expo-constants";
import * as Crypto from "expo-crypto";
import { TFunction } from "i18next";
import { getPeriodStartDate } from "./time";

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
  theme: TTheme
): string => {
  const scaleMap = { 1: "50", 2: "100", 3: "200", 4: "300", 5: "400" } as const;
  return theme.colors.rating[scaleMap[level]];
};

export function filterDataByTimePeriod<T>(
  data: T[],
  parameter: keyof T,
  period: TTimePeriod,
  date = dayjs()
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

export const getSentimentColor = (
  type: TSentimentType,
  level: TSentimentLevel,
  theme: TTheme
): string => {
  const scaleMap = { 1: "50", 2: "100", 3: "200", 4: "300", 5: "400" } as const;
  return theme.colors.sentiment[type][scaleMap[level]];
};

export const getErrorMessage = (
  error: unknown,
  fallback: string = "Something went wrong"
) => {
  const message = error instanceof Error ? error.message : fallback;
  return !message || !message.trim() ? fallback : message;
};
