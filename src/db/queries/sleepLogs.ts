import { TSleepLogs } from "@/types";
import { db } from "../db";
import { sleepLogs } from "../schema";

export const getSleepLogsFromDb = async () => {
  const data = await db.select().from(sleepLogs);
  const logs: TSleepLogs = {};
  data.forEach((item) => {
    logs[item.id] = {
      id: item.id,
      timestamp: item.timestamp,
      quality: item.quality,
    };
  });
  return logs;
};
