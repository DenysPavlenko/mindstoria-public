import { mockData } from "@/data";
import { db } from "../db";
import { entries, entryValues, metrics, trackers } from "../schema";

export async function clearDatabase() {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(entryValues);
      await tx.delete(entries);
      await tx.delete(metrics);
      await tx.delete(trackers);
    });
  } catch {}
}

export async function seedDatabase() {
  try {
    await db.transaction(async (tx) => {
      // Insert all trackers
      const trackersList = Object.values(mockData.trackers);
      if (trackersList.length > 0) {
        await tx.insert(trackers).values(trackersList);
      }
      // Insert all metrics
      const allMetrics = trackersList.flatMap((tracker, trackerIndex) =>
        tracker.metrics.map((metric, metricIndex) => ({
          ...metric,
          trackerId: tracker.id,
          order: metricIndex,
        }))
      );
      if (allMetrics.length > 0) {
        await tx.insert(metrics).values(allMetrics);
      }
      // Insert all entries and their values
      for (const [trackerId, entriesList] of Object.entries(mockData.entries)) {
        for (const entry of entriesList) {
          // Insert entry
          await tx.insert(entries).values({
            id: entry.id,
            trackerId,
            date: entry.date,
            createdAt: entry.createdAt,
          });
        }
      }
      // Insert all entries and their values
      for (const [trackerId, entriesList] of Object.entries(mockData.entries)) {
        for (const entry of entriesList) {
          // Insert entry values (only for valid metrics)
          const entryValuesData = Object.entries(entry.values)
            .map(([metricId, value]) => ({
              entryId: entry.id,
              metricId,
              valueString: typeof value === "string" ? value : null,
              valueNumber: typeof value === "number" ? value : null,
              valueBoolean: typeof value === "boolean" ? value : null,
            }))
            .filter(
              (item) =>
                item.valueString !== null ||
                item.valueNumber !== null ||
                item.valueBoolean !== null
            );
          if (entryValuesData.length > 0) {
            await tx.insert(entryValues).values(entryValuesData);
          }
        }
      }
    });
  } catch {}
}

export const clearAndSeedDatabase = async () => {
  await clearDatabase();
  await seedDatabase();
};
