import { integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

export const sleepLogs = sqliteTable("sleep_logs", {
  id: text().primaryKey(),
  quality: integer().notNull(),
  timestamp: text().notNull(),
});

export const medLogs = sqliteTable("med_logs", {
  id: text().primaryKey(),
  medId: text().notNull(),
  dosage: integer().notNull(),
  timestamp: text().notNull(),
});

export const logs = sqliteTable("logs", {
  id: text().primaryKey(),
  timestamp: text().notNull(),
  values: text("values", { mode: "json" }).notNull(),
});

export const cbtLogs = sqliteTable("cbt_logs", {
  id: text().primaryKey(),
  timestamp: text().notNull(),
  values: text("values", { mode: "json" }).notNull(),
  wellbeingLogId: text(),
});

export type TSleepLogTableRow = typeof sleepLogs.$inferSelect;
export type TMedLogTableRow = typeof medLogs.$inferSelect;
export type TLogTableRow = typeof logs.$inferSelect;
