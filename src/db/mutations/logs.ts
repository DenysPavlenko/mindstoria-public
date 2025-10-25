import { TLog } from "@/types";
import { eq } from "drizzle-orm";
import { db } from "../db";
import { logs } from "../schema";

export const addLogToDb = async (log: TLog) => {
  await db.insert(logs).values(log);
};

export const updateLogInDb = async (log: TLog) => {
  await db.update(logs).set(log).where(eq(logs.id, log.id));
};

export const removeLogFromDb = async (id: string) => {
  await db.delete(logs).where(eq(logs.id, id));
};
