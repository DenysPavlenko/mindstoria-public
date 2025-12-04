import { TBackUpData } from "@/types";
import { db } from "../db";
import { cbtLogs, logs, medLogs, sleepLogs } from "../schema";

export const importDataToDb = async (data: Partial<TBackUpData>) => {
  await db.transaction(async (tx) => {
    if (data.logs) {
      await tx.delete(logs);
      const logsData = Object.values(data.logs);
      await tx.insert(logs).values(logsData);
    }
    if (data.sleepLogs) {
      await tx.delete(sleepLogs);
      const sleepLogsData = Object.values(data.sleepLogs);
      await tx.insert(sleepLogs).values(sleepLogsData);
    }
    if (data.medLogs) {
      await tx.delete(medLogs);
      const medLogsData = Object.values(data.medLogs);
      await tx.insert(medLogs).values(medLogsData);
    }
    if (data.cbtLogs) {
      await tx.delete(cbtLogs);
      const cbtLogsData = Object.values(data.cbtLogs);
      await tx.insert(cbtLogs).values(cbtLogsData);
    }
  });
};
