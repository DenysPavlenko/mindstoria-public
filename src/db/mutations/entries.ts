import { TEntry, TEntryValues } from "@/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { entries, entryValues } from "../schema";

export const addEntryToDb = async (entry: TEntry) => {
  await db.transaction(async (tx) => {
    // Insert entry
    await tx.insert(entries).values({
      id: entry.id,
      trackerId: entry.trackerId,
      date: entry.date,
      createdAt: entry.createdAt,
    });
    // Prepare all entry values
    const entryValuesData = Object.entries(entry.values)
      .map(([metricId, value]) => {
        const baseValues = {
          entryId: entry.id,
          metricId,
        };

        if (value === null) return baseValues;
        if (typeof value === "string")
          return { ...baseValues, valueString: value };
        if (typeof value === "number")
          return { ...baseValues, valueNumber: value };
        if (typeof value === "boolean")
          return { ...baseValues, valueBoolean: value };

        return null;
      })
      .filter((item): item is NonNullable<typeof item> => item !== null);

    // Single batch insert
    if (entryValuesData.length > 0) {
      await tx.insert(entryValues).values(entryValuesData);
    }
  });
};

export const updateEntryInDb = async (
  entryId: string,
  values: TEntryValues
) => {
  await db.transaction(async (tx) => {
    // Prepare all entry values for upsert
    const entryValuesData = Object.entries(values).map(([metricId, value]) => ({
      entryId,
      metricId,
      valueString: typeof value === "string" ? value : null,
      valueNumber: typeof value === "number" ? value : null,
      valueBoolean: typeof value === "boolean" ? value : null,
    }));

    // Use INSERT OR REPLACE to upsert all values
    if (entryValuesData.length > 0) {
      for (const data of entryValuesData) {
        await tx
          .insert(entryValues)
          .values(data)
          .onConflictDoUpdate({
            target: [entryValues.entryId, entryValues.metricId],
            set: {
              valueString: data.valueString,
              valueNumber: data.valueNumber,
              valueBoolean: data.valueBoolean,
            },
          });
      }
    }
  });
};

export const deleteEntryFromDb = async (entryId: string) => {
  await db.delete(entries).where(eq(entries.id, entryId));
};
