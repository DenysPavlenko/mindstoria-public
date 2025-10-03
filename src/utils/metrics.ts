import {
  TEntry,
  TEntryValue,
  TMetricDataItem,
  TrackerMetricType,
  TTrackerMetric,
} from "@/types";
import dayjs from "dayjs";
import { TFunction } from "i18next";
import { CALENDAR_DATE_FORMAT } from "./dateConstants";
import { formatDuration, formatTime } from "./time";

/** Returns a human-readable label for a given TrackerMetricType.
 * @param type TrackerMetricType enum value
 * @returns string label
 */
export const getMetricTypeLabel = (type: TrackerMetricType, t: TFunction) => {
  switch (type) {
    case TrackerMetricType.Notes:
      return t("metrics.notes");
    case TrackerMetricType.Number:
      return t("metrics.number");
    case TrackerMetricType.Duration:
      return t("metrics.duration");
    case TrackerMetricType.Time:
      return t("metrics.time");
    case TrackerMetricType.Boolean:
      return t("metrics.boolean");
    case TrackerMetricType.Range:
      return t("metrics.range");
    default:
      return t("metrics.unknown_type");
  }
};

/** Returns a display value for a given entry value and metric type.
 * @param value The value to be displayed (can be of various types)
 * @param metric The metric definition containing type information
 * @returns string | null The formatted display value or null if not applicable
 */
export const getDisplayValue = (
  value: TEntryValue,
  metric: TTrackerMetric,
  t: TFunction
) => {
  if (value === undefined || value === null) return null;
  switch (metric.type) {
    case TrackerMetricType.Range:
    case TrackerMetricType.Number:
    case TrackerMetricType.Notes:
      return value.toString();
    case TrackerMetricType.Boolean:
      return value === true
        ? t("common.yes")
        : value === false
        ? t("common.no")
        : null;
    case TrackerMetricType.Duration:
      return typeof value === "number" ? formatDuration(value, t) : null;
    case TrackerMetricType.Time:
      return typeof value === "number" ? formatTime(value) : null;
    default:
      return null;
  }
};

/** Builds a new metric object based on provided parameters.
 * @param id Optional metric ID. If not provided, a random ID will be generated.
 * @param label Metric label (required).
 * @param type Metric type (required).
 * @param rangeMin Minimum value for Range type metrics (optional).
 * @param rangeMax Maximum value for Range type metrics (optional).
 * @returns TTrackerMetric object
 */
export function buildMetric({
  id,
  label,
  type,
  rangeMin,
  rangeMax,
}: {
  id?: string;
  label: string;
  type: TrackerMetricType;
  rangeMin?: string | number;
  rangeMax?: string | number;
}): TTrackerMetric {
  const base = {
    id: id || Math.random().toString(36).substr(2, 9),
    label: label.trim(),
    config: null,
    type,
  };
  if (type === TrackerMetricType.Range) {
    return {
      ...base,
      config: {
        range: [Number(rangeMin), Number(rangeMax)],
      },
    };
  }
  return base;
}

/** * Transforms entries into chart data for a specific metric.
 * @param entries Array of TEntry objects
 * @param metric TTrackerMetric object
 * @returns Array of TMetricDataItem objects
 */
export const getMetricChartData = (
  entries: TEntry[],
  metric: TTrackerMetric
): TMetricDataItem[] => {
  return entries.map((entry) => {
    const rawValue = entry.values[metric.id];
    // Handle missing values
    if (rawValue === undefined || rawValue === null) {
      return {
        date: entry.date,
        value: null,
      };
    }
    // Handle boolean values
    if (metric.type === TrackerMetricType.Boolean) {
      return {
        date: entry.date,
        value: rawValue ? 1 : 0.1,
      };
    }
    // Handle numeric values
    const numericValue = Number(rawValue);
    return {
      date: entry.date,
      value: isNaN(numericValue) ? null : numericValue,
    };
  });
};

/**
 * Gets the date of the first entry.
 * @param entries Array of TEntry objects
 * @returns firstEntryDate: string | null
 */
export const getFirstEntryDate = (entries: TEntry[]): string | null => {
  if (entries.length === 0) return null;
  const { date } = entries.reduce((earliest, entry) => {
    return new Date(entry.date) < new Date(earliest.date) ? entry : earliest;
  });
  return date;
};

/**
 * Gets the date of the most recent entry.
 * @param entries Array of TEntry objects
 * @returns lastEntryDate: string | null
 */
export const getLastEntryDate = (entries: TEntry[]): string | null => {
  if (entries.length === 0) return null;
  const { date } = entries.reduce((latest, entry) => {
    return new Date(entry.date) > new Date(latest.date) ? entry : latest;
  });
  return date;
};

/** Calculates the number of days missed since the first entry date.
 * @param entries Array of TEntry objects
 * @returns missedDays: number
 */
export const getMissedDays = (entries: TEntry[]): number => {
  if (entries.length === 0) return 0;
  const datesSet = new Set(
    entries.map((e) => dayjs(e.date).format(CALENDAR_DATE_FORMAT))
  );
  const firstDate = dayjs(getFirstEntryDate(entries));
  const today = dayjs().startOf("day");
  let missedDays = 0;
  for (let date = firstDate; date.isBefore(today); date = date.add(1, "day")) {
    if (!datesSet.has(date.format(CALENDAR_DATE_FORMAT))) {
      missedDays += 1;
    }
  }
  return missedDays;
};
