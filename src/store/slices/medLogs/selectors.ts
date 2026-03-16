import { RootState } from "@/store/store";
import { TMedLog } from "@/types/medications";
import { CALENDAR_DATE_FORMAT } from "@/utils";
import { createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const selectMedLogsItems = (state: RootState) => state.medLogs.items;

export const selectMedLogs = createSelector(
  selectMedLogsItems,
  (medLogsItems) => {
    return Object.values(medLogsItems);
  }
);

export const selectMedLogDateAvailability = createSelector(
  selectMedLogs,
  (medLogs) => {
    const map: Record<string, boolean> = {};
    medLogs.forEach((log) => {
      const date = dayjs(log.timestamp).format(CALENDAR_DATE_FORMAT);
      map[date] = true;
    });
    return map;
  }
);

export const selectMedLogsMap = createSelector(selectMedLogs, (medLogs) => {
  const map: Record<string, TMedLog[]> = {};
  for (const log of medLogs) {
    if (!map[log.medId]) map[log.medId] = [];
    map[log.medId]!.push(log);
  }
  return map;
});

export const selectMedLogsMapByDate = createSelector(
  selectMedLogs,
  (medLogs) => {
    const sortedLogs = [...medLogs].sort(
      (a, b) => dayjs(a.timestamp).valueOf() - dayjs(b.timestamp).valueOf()
    );
    const map: Record<string, Record<string, TMedLog[]>> = {};
    for (const log of sortedLogs) {
      const date = dayjs(log.timestamp).format(CALENDAR_DATE_FORMAT);
      if (!map[date]) map[date] = {};
      if (!map[date]![log.medId]) map[date][log.medId] = [];
      map[date][log.medId]!.push(log);
    }
    return map;
  }
);
