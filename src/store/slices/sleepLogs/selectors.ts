import { RootState } from "@/store/store";
import { TSleepLog } from "@/types";
import { CALENDAR_DATE_FORMAT } from "@/utils";
import { createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const selectSleepLogs = (state: RootState) => state.sleepLogs.items;

export const selectSleepLogsGroupedByDate = createSelector(
  [selectSleepLogs],
  (sleepLogs) => {
    const map: Record<string, TSleepLog> = {};
    Object.values(sleepLogs).forEach((log) => {
      const date = dayjs(log.timestamp).format(CALENDAR_DATE_FORMAT);
      map[date] = log;
    });
    return map;
  }
);
