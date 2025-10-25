import { TLog, TLogs } from "@/types";
import { db } from "../db";
import { logs } from "../schema";

export const getLogsFromDb = async () => {
  const data = await db.select().from(logs);
  const items: TLogs = {};
  data.forEach((item) => {
    items[item.id] = {
      ...item,
      values: item.values as TLog["values"],
    };
  });
  return items;
};
