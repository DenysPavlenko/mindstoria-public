import { TCBTLog, TCBTLogs } from "@/types";
import { db } from "../db";
import { cbtLogs } from "../schema";

export const getCBTLogsFromDb = async () => {
  const data = await db.select().from(cbtLogs);
  const items: TCBTLogs = {};
  data.forEach((item) => {
    items[item.id] = {
      ...item,
      values: item.values as TCBTLog["values"],
    };
  });
  return items;
};
