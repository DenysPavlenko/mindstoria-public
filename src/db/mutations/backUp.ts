import { TBackUpData } from "@/types";
import { db } from "../db";
import { logs, medLogs, sleepLogs } from "../schema";

export const importDataToDb = async (data: TBackUpData) => {
  await db.transaction(async (tx) => {
    // Clear all existing data first
    await tx.delete(logs);
    await tx.delete(sleepLogs);
    await tx.delete(medLogs);

    // Insert logs
    const logsData = Object.values(data.logs);
    await tx.insert(logs).values(logsData);

    // Insert sleep logs
    const sleepLogsData = Object.values(data.sleepLogs);
    await tx.insert(sleepLogs).values(sleepLogsData);

    // Insert med logs
    const medLogsData = Object.values(data.medLogs);
    await tx.insert(medLogs).values(medLogsData);
  });
};
