import {
  addEntryToDb,
  addTrackerToDb,
  deleteEntryFromDb,
  deleteTrackerFromDb,
  importTrackersDataToDb,
  reorderTrackersInDb,
  updateEntryInDb,
  updateTrackerInDb,
} from "@/db";
import { TEntry, TEntryValues, TTracker, TTrackersData } from "@/types";
import { generateRandomId } from "@/utils";
import { AppDispatch, RootState } from "../../store";
import { trackersDataSlice } from "./trackersDataSlice";

const {
  addTracker,
  removeTracker,
  restoreTracker,
  reorderTrackers,
  addEntry,
  removeEntry,
  updateTracker,
  updateEntry,
  importTrackersData,
} = trackersDataSlice.actions;

export const createTrackerThunk = (
  tracker: Omit<TTracker, "id" | "createdAt" | "order">
) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    const trackerId = generateRandomId();
    const { trackers } = getState().trackersData;
    const maxOrder = Object.values(trackers).reduce(
      (max, t) => (t.order > max ? t.order : max),
      0
    );
    const order = maxOrder + 1;
    const newTracker: TTracker = {
      ...tracker,
      id: trackerId,
      createdAt: new Date().toISOString(),
      order,
    };
    dispatch(addTracker(newTracker));
    try {
      await addTrackerToDb(newTracker);
    } catch {
      dispatch(removeTracker(trackerId));
    }
  };
};

export const updateTrackerThunk = (
  tracker: Omit<TTracker, "createdAt" | "order">
) => {
  return async (dispatch: AppDispatch) => {
    // Pessimistic update by default to avoid complex rollback logic
    try {
      await updateTrackerInDb(tracker);
      dispatch(updateTracker(tracker));
    } catch {
      // Intentionally ignored
    }
  };
};

export const updateTrackersOrderThunk = (fromId: string, toId: string) => {
  return async (dispatch: AppDispatch) => {
    dispatch(reorderTrackers({ fromId, toId }));
    try {
      await reorderTrackersInDb(fromId, toId);
    } catch {
      // Ignored for MVP
    }
  };
};

export const deleteTrackerThunk = (tracker: TTracker) => {
  return async (dispatch: AppDispatch) => {
    dispatch(removeTracker(tracker.id));
    try {
      await deleteTrackerFromDb(tracker.id);
    } catch {
      dispatch(restoreTracker(tracker));
    }
  };
};

export const createEntryThunk = ({
  trackerId,
  values,
  date,
}: {
  trackerId: string;
  values: TEntryValues;
  date?: string;
}) => {
  return async (dispatch: AppDispatch) => {
    const entryDate = date || new Date().toISOString();
    const newEntry: TEntry = {
      id: generateRandomId(),
      trackerId,
      date: entryDate,
      values: values,
      createdAt: entryDate,
    };
    dispatch(addEntry(newEntry));
    try {
      await addEntryToDb(newEntry);
    } catch {
      // Rollback in case of error
      dispatch(removeEntry({ trackerId, entryId: newEntry.id }));
    }
  };
};

export const updateEntryThunk = ({
  trackerId,
  entryId,
  values,
}: {
  trackerId: string;
  entryId: string;
  values: TEntryValues;
}) => {
  return async (dispatch: AppDispatch) => {
    dispatch(updateEntry({ trackerId, entryId, values }));
    try {
      await updateEntryInDb(entryId, values);
    } catch {
      // Intentionally ignored
    }
  };
};

export const deleteEntryThunk = (entry: TEntry) => {
  return async (dispatch: AppDispatch) => {
    const { id, trackerId } = entry;
    dispatch(removeEntry({ trackerId, entryId: id }));
    try {
      await deleteEntryFromDb(id);
    } catch {
      // Rollback in case of error
      dispatch(addEntry(entry));
    }
  };
};

export const importTrackersDataThunk = (data: TTrackersData) => {
  return async (dispatch: AppDispatch) => {
    dispatch(importTrackersData(data));
    try {
      await importTrackersDataToDb(data);
    } catch {
      // Ignored for MVP
    }
  };
};
