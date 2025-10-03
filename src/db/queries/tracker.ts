import { TEntry, TEntryValue, TTracker, TTrackersData } from "@/types";
import { db } from "../db";
import {
  entries,
  entryValues,
  metrics,
  TMetricTableRow,
  trackers,
} from "../schema";

// Fetch trackers along with their metrics and entries with values;
// Not optimized for large datasets but is ok for MVP
export const getTrackersDataFromDb = async (): Promise<TTrackersData> => {
  const trackerList = await db.select().from(trackers);
  const metricList = await db.select().from(metrics);
  const entriesList = await db.select().from(entries);
  const entryValuesList = await db.select().from(entryValues);

  const trackersData: TTrackersData = {
    trackers: {},
    entries: {},
  };

  // Group entry values by entryId
  const valuesByEntryId: Record<string, Record<string, TEntryValue>> = {};
  entryValuesList.forEach((ev) => {
    if (!valuesByEntryId[ev.entryId]) {
      valuesByEntryId[ev.entryId] = {};
    }
    // Determine the actual value based on which column is populated
    let value: TEntryValue = null;
    if (ev.valueString !== null) value = ev.valueString;
    else if (ev.valueNumber !== null) value = ev.valueNumber;
    else if (ev.valueBoolean !== null) value = ev.valueBoolean;
    valuesByEntryId[ev.entryId]![ev.metricId] = value;
  });

  // Group entries by trackerId
  const entriesByTrackerId: Record<string, TEntry[]> = {};
  entriesList.forEach((entry) => {
    if (!entriesByTrackerId[entry.trackerId]) {
      entriesByTrackerId[entry.trackerId] = [];
    }
    entriesByTrackerId[entry.trackerId]!.push({
      ...entry,
      values: valuesByEntryId[entry.id] || {},
    });
  });

  // Build trackers with metrics
  trackerList.forEach((tracker) => {
    const trackerMetrics: TMetricTableRow[] = [];
    metricList.forEach((metric) => {
      if (metric.trackerId === tracker.id) {
        trackerMetrics.push({
          ...metric,
          config: metric.config,
        });
      }
    });

    const sortedMetricList = trackerMetrics.sort((a, b) => a.order - b.order);
    trackersData.trackers[tracker.id] = {
      ...tracker,
      iconName: tracker.iconName as TTracker["iconName"],
      metrics: sortedMetricList,
    };

    // Add entries for this tracker
    trackersData.entries[tracker.id] = entriesByTrackerId[tracker.id] || [];
  });

  return trackersData;
};
