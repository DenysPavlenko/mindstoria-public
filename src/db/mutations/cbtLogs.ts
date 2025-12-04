import { TCBTLog } from "@/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { cbtLogs } from "../schema";

export const addCBTLogToDb = async (log: TCBTLog) => {
  await db.insert(cbtLogs).values(log);
};

export const updateCBTLogInDb = async (log: TCBTLog) => {
  await db.update(cbtLogs).set(log).where(eq(cbtLogs.id, log.id));
};

export const removeCBTLogFromDb = async (id: string) => {
  await db.delete(cbtLogs).where(eq(cbtLogs.id, id));
};
