import { TMedLog } from "@/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { medLogs } from "../schema";

export const addMedLogToDb = async (log: TMedLog) => {
  await db.insert(medLogs).values(log);
};

export const updateMedLogInDb = async (log: TMedLog) => {
  await db.update(medLogs).set(log).where(eq(medLogs.id, log.id));
};

export const removeMedLogFromDb = async (id: string) => {
  await db.delete(medLogs).where(eq(medLogs.id, id));
};
