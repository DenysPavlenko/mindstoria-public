import { createSelector } from "@reduxjs/toolkit";
import dayjs from "dayjs";
import { RootState } from "../../store";

const selectTrackers = (state: RootState) => state.trackersData.trackers;
const selectEntries = (state: RootState) => state.trackersData.entries;

export const selectSortedTrackers = createSelector(
  selectTrackers,
  (trackers) => {
    return Object.values(trackers).sort((a, b) => a.order - b.order);
  }
);

export const selectEntriesByTrackerId = createSelector(
  [selectEntries, (state: RootState, trackerId: string) => trackerId],
  (entries, trackerId) => {
    return entries[trackerId] || [];
  }
);

export const selectMetricsByTrackerId = (
  state: RootState,
  trackerId: string
) => {
  return state.trackersData.trackers[trackerId]?.metrics || [];
};

const selectEntryId = (_: RootState, __: string, entryId: string) => entryId;
const selectEntryDate = (_: RootState, __: string, date: string) => date;

export const selectEntryById = createSelector(
  [selectEntriesByTrackerId, selectEntryId],
  (entries, entryId) => {
    return entries.find((entry) => entry.id === entryId);
  }
);

export const selectEntryByDate = createSelector(
  [selectEntriesByTrackerId, selectEntryDate],
  (entries, date) => {
    return entries.find((entry) =>
      dayjs(entry.date).isSame(dayjs(date), "day")
    );
  }
);
