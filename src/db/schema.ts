import { TTrackerMetric, TrackerMetricType } from "@/types";
import {
  integer,
  primaryKey,
  sqliteTable,
  text,
} from "drizzle-orm/sqlite-core";

// Trackers table
export const trackers = sqliteTable("trackers", {
  id: text().primaryKey(),
  name: text().notNull(),
  iconName: text().notNull(),
  description: text(),
  createdAt: text().notNull(),
  order: integer().notNull().default(0),
});

// Metrics table
export const metrics = sqliteTable("metrics", {
  id: text().primaryKey(),
  trackerId: text()
    .notNull()
    .references(() => trackers.id, { onDelete: "cascade" }),
  label: text().notNull(),
  type: integer().notNull().$type<TrackerMetricType>(),
  config: text({
    mode: "json",
  }).$type<TTrackerMetric["config"] | null>(),
  order: integer().notNull().default(0),
});

// Entries table
export const entries = sqliteTable("entries", {
  id: text().primaryKey(),
  trackerId: text()
    .notNull()
    .references(() => trackers.id, { onDelete: "cascade" }),
  date: text().notNull(),
  createdAt: text().notNull(),
});

// EntryValues table (metric values per entry)
export const entryValues = sqliteTable(
  "entry_values",
  {
    entryId: text()
      .notNull()
      .references(() => entries.id, { onDelete: "cascade" }),
    metricId: text()
      .notNull()
      .references(() => metrics.id, { onDelete: "cascade" }),
    // since values can be string | number | boolean | null, we need to normalize
    valueString: text(),
    valueNumber: integer(),
    valueBoolean: integer({ mode: "boolean" }),
  },
  (table) => [primaryKey({ columns: [table.entryId, table.metricId] })]
);

export type TMetricTableRow = typeof metrics.$inferSelect;
export type TTrackerTableRow = typeof trackers.$inferSelect;
export type TEntryTableRow = typeof entries.$inferSelect;
export type TEntryValueTableRow = typeof entryValues.$inferSelect;
