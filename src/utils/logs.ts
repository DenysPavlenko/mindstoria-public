import { RatingLevel, TChartDataMap, TLog, TTimePeriod } from "@/types";
import dayjs from "dayjs";
import Smiley1 from "../assets/icons/smiley-1.svg";
import Smiley2 from "../assets/icons/smiley-2.svg";
import Smiley3 from "../assets/icons/smiley-3.svg";
import Smiley4 from "../assets/icons/smiley-4.svg";
import Smiley5 from "../assets/icons/smiley-5.svg";
import { CALENDAR_DATE_FORMAT, YEAR_MONTH_FORMAT } from "./dateConstants";

export const WELLBEING_ICONS = [Smiley1, Smiley2, Smiley3, Smiley4, Smiley5];

export const getWellbeingIcon = (level: RatingLevel) => {
  return WELLBEING_ICONS[level - 1];
};

export const getWellbeingChartDataMap = (
  logs: TLog[],
  period: TTimePeriod
): TChartDataMap => {
  const data: Record<string, RatingLevel | null> = {};
  const dateFormat =
    period === "year" ? YEAR_MONTH_FORMAT : CALENDAR_DATE_FORMAT;

  // Group by date and calculate averages
  const grouped: Record<string, RatingLevel[]> = {};
  logs.forEach((log) => {
    const dateKey = dayjs(log.timestamp).format(dateFormat);
    if (!grouped[dateKey]) {
      grouped[dateKey] = [];
    }
    grouped[dateKey].push(log.values.wellbeing);
  });

  // Calculate average for each date
  Object.entries(grouped).forEach(([date, values]) => {
    const sum = values.reduce((acc, val) => acc + val, 0);
    const avg = Math.round(sum / values.length) as RatingLevel;
    data[date] = avg;
  });

  // Calculate overall average
  const allValues = Object.values(grouped).flat();
  const totalSum = allValues.reduce((acc, val) => acc + val, 0);
  const average = totalSum / allValues.length;

  return { data, average };
};
