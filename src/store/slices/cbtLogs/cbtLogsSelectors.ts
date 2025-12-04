import { RootState } from "@/store";
import { TCBTLog } from "@/types";
import { CALENDAR_DATE_FORMAT } from "@/utils";
import { createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";

// Helper selectors
const selectCBTLogsItems = (state: RootState) => state.cbtLogs.items;

export const selectCBTLogs = createSelector(
  [selectCBTLogsItems],
  (logs): TCBTLog[] => {
    return Object.values(logs);
  }
);

// Selector to get CBT connections map for wellbeing logs
export const selectCBTConnectionsMap = createSelector(
  [selectCBTLogsItems],
  (cbtLogsItems): Record<string, string> => {
    const connectionsMap: Record<string, string> = {};
    Object.values(cbtLogsItems).forEach((cbtLog) => {
      if (cbtLog.wellbeingLogId) {
        connectionsMap[cbtLog.wellbeingLogId] = cbtLog.id;
      }
    });
    return connectionsMap;
  }
);

export const selectCBTLogDateAvailability = createSelector(
  selectCBTLogs,
  (logs) => {
    const map: Record<string, boolean> = {};
    logs.forEach((log) => {
      const date = dayjs(log.timestamp).format(CALENDAR_DATE_FORMAT);
      map[date] = true;
    });
    return map;
  }
);
