import { getSleepLogsFromDb } from "@/db/queries/sleepLogs";
import { TSleepLog, TSleepLogs } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SleepLogsState {
  items: TSleepLogs;
  fetchError: string | undefined;
}

const initialState: SleepLogsState = {
  items: {},
  fetchError: undefined,
};

export const fetchSleepLogsThunk = createAsyncThunk("sleep/fetch", async () => {
  try {
    return await getSleepLogsFromDb();
  } catch (err) {
    throw err;
  }
});

export const sleepSliceLogs = createSlice({
  name: "sleepLogs",
  initialState,
  reducers: {
    addSleepLog: (state, action: PayloadAction<TSleepLog>) => {
      state.items[action.payload.id] = action.payload;
    },
    updateSleepLog: (state, action: PayloadAction<TSleepLog>) => {
      state.items[action.payload.id] = {
        ...state.items[action.payload.id],
        ...action.payload,
      };
    },
    removeSleepLog: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    importSleepLogs: (state, action: PayloadAction<TSleepLogs>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch data
    builder.addCase(fetchSleepLogsThunk.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(fetchSleepLogsThunk.rejected, (state, action) => {
      state.fetchError = action.error.message;
    });
  },
});

export default sleepSliceLogs.reducer;
