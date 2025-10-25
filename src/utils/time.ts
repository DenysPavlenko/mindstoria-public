import { TTimePeriod } from "@/types";
import { Dayjs } from "dayjs";
import {
  CALENDAR_DATE_FORMAT,
  MONTH_DAY_FORMAT,
  YEAR_MONTH_FORMAT,
} from "./dateConstants";

/**
 * Calculate the start date for a given time period
 * @param period - The time period type
 * @param endDate - The end date of the period (defaults to today)
 * @returns The start date of the period
 */
export function getPeriodStartDate(period: TTimePeriod, endDate: Dayjs): Dayjs {
  switch (period) {
    case "week":
      return endDate.subtract(6, "day"); // last 7 days including end date
    case "month":
      return endDate.subtract(1, "month");
    case "year":
      return endDate.subtract(1, "year");
  }
}

/**
 * Format a time period as a date range string
 * @param period - The time period type
 * @param endDate - The end date of the period
 * @returns Formatted date range string
 */
export function formatPeriodRange(period: TTimePeriod, endDate: Dayjs): string {
  const startDate = getPeriodStartDate(period, endDate);

  switch (period) {
    case "week":
    case "month": {
      const start = startDate.format(MONTH_DAY_FORMAT);
      const end = endDate.format(MONTH_DAY_FORMAT);
      return `${start} - ${end}`;
    }
    case "year": {
      const start = startDate.format("MMM YYYY");
      const end = endDate.format("MMM YYYY");
      return `${start} - ${end}`;
    }
  }
}

/**
 * Generate an array of dates for a time period
 * @param period - The time period type
 * @param endDate - The end date of the period
 * @param format - Date format string (defaults to YYYY-MM-DD)
 * @returns Array of formatted date strings
 */
export function generatePeriodDates(
  period: TTimePeriod,
  endDate: Dayjs,
  format?: string
): string[] {
  const startDate = getPeriodStartDate(period, endDate);
  const dates: string[] = [];
  let current = startDate;
  while (current.isSameOrBefore(endDate, "day")) {
    if (format) {
      dates.push(current.format(format));
    } else {
      dates.push(current.toISOString());
    }
    current = current.add(1, "day");
  }
  return dates;
}

/**
 * Generate an array of dates for charts based on time period
 * @param period - The time period type
 * @param endDate - The end date of the period
 * @returns Array of formatted date strings
 */
export function generatePeriodDatesForCharts(
  period: TTimePeriod,
  endDate: Dayjs
): string[] {
  if (period === "week") {
    return generatePeriodDates("week", endDate, CALENDAR_DATE_FORMAT);
  } else if (period === "month") {
    return generatePeriodDates("month", endDate, CALENDAR_DATE_FORMAT);
  } else if (period === "year") {
    // For year period, generate 12 months
    const months: string[] = [];
    let current = endDate;
    for (let i = 0; i < 12; i++) {
      months.unshift(current.format(YEAR_MONTH_FORMAT));
      current = current.subtract(1, "month");
    }
    return months;
  }
  return [];
}

/**
 * Generate all days in the month of the given date
 * @param date - A date within the target month
 * @returns Array of formatted date strings for each day in the month
 */
export const generateDaysForMonth = (date: Dayjs) => {
  const startOfMonth = date.startOf("month");
  const endOfMonth = date.endOf("month");
  const days = [];
  for (
    let day = startOfMonth;
    day.isBefore(endOfMonth) || day.isSame(endOfMonth);
    day = day.add(1, "day")
  ) {
    days.push(day.format(CALENDAR_DATE_FORMAT));
  }
  return days;
};
