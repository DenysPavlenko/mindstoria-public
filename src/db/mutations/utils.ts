import { TEntry, TEntryValue, TTracker, TTrackerMetric } from "@/types";
import {
  TEntryTableRow,
  TEntryValueTableRow,
  TMetricTableRow,
  TTrackerTableRow,
} from "../schema";

export const sanitizeTrackerForDb = (tracker: TTracker): TTrackerTableRow => {
  return {
    id: tracker.id,
    name: tracker.name,
    description: tracker.description,
    createdAt: tracker.createdAt,
    iconName: tracker.iconName,
    order: tracker.order,
  };
};

export const sanitizeMetricForDb = (
  metric: TTrackerMetric,
  trackerId: string,
  order: number
): TMetricTableRow => {
  return {
    id: metric.id,
    label: metric.label,
    type: metric.type,
    config: metric.config,
    trackerId: trackerId,
    order,
  };
};

export const sanitizeEntryForDb = (entry: TEntry): TEntryTableRow => {
  return {
    id: entry.id,
    trackerId: entry.trackerId,
    date: entry.date,
    createdAt: entry.createdAt,
  };
};

export const sanitizeEntryValueForDb = (
  entryId: string,
  metricId: string,
  value: TEntryValue
): TEntryValueTableRow => {
  const entryValue: TEntryValueTableRow = {
    entryId,
    metricId,
    valueBoolean: null,
    valueNumber: null,
    valueString: null,
  };
  if (typeof value === "string") {
    entryValue.valueString = value;
  } else if (typeof value === "number") {
    entryValue.valueNumber = value;
  } else if (typeof value === "boolean") {
    entryValue.valueBoolean = value;
  }
  return entryValue;
};
