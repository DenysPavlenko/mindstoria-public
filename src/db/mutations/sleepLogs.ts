import { TSleepLog } from "@/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { sleepLogs } from "../schema";

export const addSleepLogToDb = async (log: TSleepLog) => {
  await db.insert(sleepLogs).values(log);
};

export const updateSleepLogInDb = async (log: TSleepLog) => {
  await db.update(sleepLogs).set(log).where(eq(sleepLogs.id, log.id));
};

export const removeSleepLogFromDb = async (id: string) => {
  await db.delete(sleepLogs).where(eq(sleepLogs.id, id));
};
