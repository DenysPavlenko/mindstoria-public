import { RootState } from "@/store";
import { TLog } from "@/types";
import { CALENDAR_DATE_FORMAT } from "@/utils";
import { createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";

// Helper selectors
const selectLogsItems = (state: RootState) => state.logs.items;

export const selectLogs = createSelector([selectLogsItems], (logs): TLog[] => {
  return Object.values(logs);
});

export const selectLogDateAvailability = createSelector(selectLogs, (logs) => {
  const map: Record<string, boolean> = {};
  logs.forEach((log) => {
    const date = dayjs(log.timestamp).format(CALENDAR_DATE_FORMAT);
    map[date] = true;
  });
  return map;
});
