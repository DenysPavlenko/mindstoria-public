import { getTrackersDataFromDb } from "@/db";
import { TEntry, TEntryValues, TTracker, TTrackersData } from "@/types";
import type { PayloadAction } from "@reduxjs/toolkit";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

// Thunks
export const fetchTrackersDataThunk = createAsyncThunk(
  "trackers/fetch",
  async () => {
    try {
      return getTrackersDataFromDb();
    } catch (err) {
      throw err;
    }
  }
);

type TDataState = TTrackersData & {
  trackersFetchError?: string;
  deleteTrackerError?: string;
};

const initialState: TDataState = {
  trackers: {},
  entries: {},
  trackersFetchError: undefined,
  deleteTrackerError: undefined,
};

export const trackersDataSlice = createSlice({
  name: "data",
  initialState,
  reducers: {
    // Trackers
    addTracker: (state, action: PayloadAction<TTracker>) => {
      const tracker = action.payload;
      state.trackers[tracker.id] = tracker;
    },
    removeTracker: (state, action: PayloadAction<string>) => {
      const trackerId = action.payload;
      delete state.trackers[trackerId];
      delete state.entries[trackerId];
    },
    restoreTracker: (state, action: PayloadAction<TTracker>) => {
      const tracker = action.payload;
      state.trackers[tracker.id] = tracker;
    },
    updateTracker: (
      state,
      action: PayloadAction<Omit<TTracker, "createdAt" | "order">>
    ) => {
      const { id, name, description, iconName, metrics } = action.payload;
      const existingTracker = state.trackers[id];
      if (!existingTracker) return;
      // Auto-detect deleted metrics by comparing old vs new
      const oldMetricIds = new Set(existingTracker.metrics.map((m) => m.id));
      const newMetricIds = new Set(metrics.map((m) => m.id));
      const deletedMetricIds = [...oldMetricIds].filter(
        (metricId) => !newMetricIds.has(metricId)
      );
      // Update tracker
      const updatedTracker: TTracker = {
        ...existingTracker,
        name,
        description,
        iconName,
        metrics,
      };
      state.trackers[id] = updatedTracker;
      // Clean up entry values for deleted metrics
      if (deletedMetricIds.length > 0) {
        const entries = state.entries[id] || [];
        const metricIdsToDelete = new Set(deletedMetricIds);
        state.entries[id] = entries.map((entry) => {
          const updatedValues = { ...entry.values };
          for (const metricId of metricIdsToDelete) {
            if (metricId in updatedValues) {
              delete updatedValues[metricId];
            }
          }
          return { ...entry, values: updatedValues };
        });
      }
    },

    // Entries
    addEntry: (state, action: PayloadAction<TEntry>) => {
      const newEntry = action.payload;
      const { trackerId } = newEntry;
      const existingEntries = state.entries[trackerId] || [];
      state.entries[trackerId] = [...existingEntries, newEntry];
    },
    removeEntry: (
      state,
      action: PayloadAction<{ trackerId: string; entryId: string }>
    ) => {
      const { trackerId, entryId } = action.payload;
      const entries = state.entries[trackerId];
      if (!entries) return;
      const filteredEntries = entries.filter((entry) => entry.id !== entryId);
      if (filteredEntries.length !== entries.length) {
        state.entries[trackerId] = filteredEntries;
      }
    },
    updateEntry: (
      state,
      action: PayloadAction<{
        trackerId: string;
        entryId: string;
        values: TEntryValues;
      }>
    ) => {
      const { trackerId, entryId, values } = action.payload;
      const prevEntries = state.entries[trackerId] || [];
      const updatedEntries = prevEntries.map((entry) =>
        entry.id === entryId ? { ...entry, values } : entry
      );
      state.entries[trackerId] = updatedEntries;
    },

    // Order
    reorderTrackers: (
      state,
      action: PayloadAction<{
        fromId: string;
        toId: string;
      }>
    ) => {
      const { fromId, toId } = action.payload;
      const fromTracker = state.trackers[fromId];
      const toTracker = state.trackers[toId];
      if (fromTracker && toTracker) {
        const tempOrder = fromTracker.order;
        fromTracker.order = toTracker.order;
        toTracker.order = tempOrder;
      }
    },
    // Import tracker with entries
    importTrackersData: (state, action: PayloadAction<TTrackersData>) => {
      state.trackers = action.payload.trackers;
      state.entries = action.payload.entries;
      state.trackersFetchError = undefined;
      state.deleteTrackerError = undefined;
    },
  },
  extraReducers: (builder) => {
    builder.addCase(fetchTrackersDataThunk.rejected, (state, action) => {
      state.trackersFetchError = action.error.message;
    });
    builder
      // Fetch trackers data
      .addCase(fetchTrackersDataThunk.fulfilled, (state, action) => {
        state.trackers = action.payload.trackers;
        state.entries = action.payload.entries;
      });
  },
});

export default trackersDataSlice.reducer;
