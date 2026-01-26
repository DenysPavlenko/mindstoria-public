import { TChartDataMap, TSleepLog, TTimePeriod } from "@/types";
import dayjs from "dayjs";
import { CALENDAR_DATE_FORMAT, YEAR_MONTH_FORMAT } from "./date";

export const getSleepLogChartDataMap = (
  sleepLogs: TSleepLog[],
  period: TTimePeriod,
): TChartDataMap => {
  const data: TChartDataMap["data"] = {};

  // Step 1: Determine date format based on period
  const dateFormat =
    period === "year" ? YEAR_MONTH_FORMAT : CALENDAR_DATE_FORMAT;

  // Step 2: Populate data points
  sleepLogs.forEach((log) => {
    const date = dayjs(log.timestamp).format(dateFormat);
    data[date] = log.quality;
  });

  // Step 3: Calculate average quality
  const totalSum = Object.values(data).reduce<number>((sum, value) => {
    return sum + (value || 0);
  }, 0);
  const average = totalSum / Object.values(data).length;
  return { data, average };
};
