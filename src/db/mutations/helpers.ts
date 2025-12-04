import { db } from "../db";
import { cbtLogs, logs, medLogs, sleepLogs } from "../schema";

export async function clearDatabase() {
  try {
    await db.transaction(async (tx) => {
      await tx.delete(logs);
      await tx.delete(medLogs);
      await tx.delete(sleepLogs);
      await tx.delete(cbtLogs);
    });
  } catch {}
}
