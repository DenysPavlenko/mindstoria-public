import { RootState } from "@/store";
import { TLog } from "@/types";
import { CALENDAR_DATE_FORMAT } from "@/utils";
import { createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";

// Helper selectors
export const selectLogItems = (state: RootState) => state.logs.items;

export const selectLogsList = createSelector(
  [selectLogItems],
  (logs): TLog[] => {
    return Object.values(logs);
  },
);

export const selectLogDateAvailability = createSelector(
  selectLogsList,
  (logs) => {
    const map: Record<string, boolean> = {};
    logs.forEach((log) => {
      const date = dayjs(log.timestamp).format(CALENDAR_DATE_FORMAT);
      map[date] = true;
    });
    return map;
  },
);

export const selectLogsAvarageMap = createSelector(selectLogsList, (logs) => {
  const map = new Map<string, { sum: number; cnt: number }>();
  logs.forEach((log) => {
    const day = dayjs(log.timestamp).format(CALENDAR_DATE_FORMAT);
    const current = map.get(day) ?? { sum: 0, cnt: 0 };
    current.sum += log.values.wellbeing;
    current.cnt += 1;
    map.set(day, current);
  });

  const result: Record<string, number> = {};
  for (const [day, { sum, cnt }] of map) {
    result[day] = Math.round(sum / cnt);
  }

  return result;
});
