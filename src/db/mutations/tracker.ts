import { TTracker, TTrackersData } from "@/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import {
  entries,
  entryValues,
  metrics,
  TEntryTableRow,
  TEntryValueTableRow,
  TMetricTableRow,
  trackers,
} from "../schema";
import {
  sanitizeEntryForDb,
  sanitizeEntryValueForDb,
  sanitizeMetricForDb,
  sanitizeTrackerForDb,
} from "./utils";

export const addTrackerToDb = async (tracker: TTracker) => {
  await db.transaction(async (tx) => {
    const trackerData = sanitizeTrackerForDb(tracker);
    await tx.insert(trackers).values(trackerData);
    const metricsData = tracker.metrics.map((metric, idx) => {
      return sanitizeMetricForDb(metric, tracker.id, idx);
    });
    if (metricsData.length > 0) {
      await tx.insert(metrics).values(metricsData);
    }
  });
};

export const deleteTrackerFromDb = async (trackerId: string) => {
  await db.delete(trackers).where(eq(trackers.id, trackerId));
};

export const reorderTrackersInDb = async (
  trackerIdA: string,
  trackerIdB: string
) => {
  // Fetch current orders
  const [trackerA] = await db
    .select({ order: trackers.order })
    .from(trackers)
    .where(eq(trackers.id, trackerIdA));
  const [trackerB] = await db
    .select({ order: trackers.order })
    .from(trackers)
    .where(eq(trackers.id, trackerIdB));

  if (!trackerA || !trackerB) return;

  // Swap orders
  await db.transaction(async (tx) => {
    await tx
      .update(trackers)
      .set({ order: trackerB.order })
      .where(eq(trackers.id, trackerIdA));
    await tx
      .update(trackers)
      .set({ order: trackerA.order })
      .where(eq(trackers.id, trackerIdB));
  });
};

export const updateTrackerInDb = async (
  tracker: Omit<TTracker, "createdAt" | "order">
) => {
  await db.transaction(async (tx) => {
    // Update tracker
    await tx
      .update(trackers)
      .set({
        name: tracker.name,
        description: tracker.description,
        iconName: tracker.iconName,
      })
      .where(eq(trackers.id, tracker.id));

    // Fetch existing metrics for the tracker
    const existingMetrics = await tx
      .select()
      .from(metrics)
      .where(eq(metrics.trackerId, tracker.id));
    const existingMetricIds = new Set(existingMetrics.map((m) => m.id));
    const newMetricIds = new Set(tracker.metrics.map((m) => m.id));

    const metricsOrderMap = new Map<string, number>();
    tracker.metrics.forEach((metric, index) => {
      metricsOrderMap.set(metric.id, index);
    });

    // Determine metrics to add, update, and delete
    const metricsToAdd = tracker.metrics.filter(
      (m) => !existingMetricIds.has(m.id)
    );
    const metricsToUpdate = tracker.metrics.filter((m) =>
      existingMetricIds.has(m.id)
    );
    const metricsToDelete = existingMetrics.filter(
      (m) => !newMetricIds.has(m.id)
    );

    // Add new metrics
    if (metricsToAdd.length > 0) {
      await tx.insert(metrics).values(
        metricsToAdd.map((metric) => {
          return sanitizeMetricForDb(
            metric,
            tracker.id,
            metricsOrderMap.get(metric.id) ?? 0
          );
        })
      );
    }

    // Update existing metrics
    for (const metric of metricsToUpdate) {
      await tx
        .update(metrics)
        .set({
          label: metric.label,
          type: metric.type,
          config: metric.config,
          order: metricsOrderMap.get(metric.id) ?? 0,
        })
        .where(eq(metrics.id, metric.id));
    }

    // Delete removed metrics
    for (const metric of metricsToDelete) {
      await tx.delete(metrics).where(eq(metrics.id, metric.id));
    }
  });
};

export const importTrackersDataToDb = async (data: TTrackersData) => {
  await db.transaction(async (tx) => {
    const trackersValues = Object.values(data.trackers);
    if (trackersValues.length === 0) {
      throw new Error("No trackers to import");
    }

    // Clear all existing data first
    await tx.delete(entryValues);
    await tx.delete(entries);
    await tx.delete(metrics);
    await tx.delete(trackers);

    // Insert trackers
    const trackersData = Object.values(data.trackers).map(sanitizeTrackerForDb);
    await tx.insert(trackers).values(trackersData);

    // Insert metrics
    const metricsData: TMetricTableRow[] = trackersValues.flatMap((tracker) => {
      return tracker.metrics.map((metric, idx) => {
        return sanitizeMetricForDb(metric, tracker.id, idx);
      });
    });
    if (metricsData.length > 0) {
      await tx.insert(metrics).values(metricsData);
    }

    // Insert entries
    const entriesData: TEntryTableRow[] = Object.values(data.entries).flatMap(
      (entries) => entries.map(sanitizeEntryForDb)
    );
    if (entriesData.length > 0) {
      await tx.insert(entries).values(entriesData);
    }

    // Insert entry values
    const entriesValuesData: TEntryValueTableRow[] = Object.values(data.entries)
      .flat()
      .flatMap((entry) => {
        return Object.entries(entry.values).map(([metricId, value]) => {
          return sanitizeEntryValueForDb(entry.id, metricId, value);
        });
      });
    if (entriesValuesData.length > 0) {
      await tx.insert(entryValues).values(entriesValuesData);
    }
  });
};
