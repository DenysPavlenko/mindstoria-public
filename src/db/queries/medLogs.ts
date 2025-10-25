import { TMedLogs } from "@/types";
import { db } from "../db";
import { medLogs } from "../schema";

export const getMedLogsFromDb = async () => {
  const data = await db.select().from(medLogs);
  const logs: TMedLogs = {};
  data.forEach((item) => {
    logs[item.id] = {
      id: item.id,
      medId: item.medId,
      dosage: item.dosage,
      timestamp: item.timestamp,
    };
  });
  return logs;
};
