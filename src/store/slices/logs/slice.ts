import { getLogsFromDb } from "@/db";
import { TLog, TLogs } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface LogsState {
  items: TLogs;
  fetchError: string | undefined;
}

const initialState: LogsState = {
  items: {},
  fetchError: undefined,
};

export const fetchLogsThunk = createAsyncThunk("logs/fetch", async () => {
  try {
    return await getLogsFromDb();
  } catch (err) {
    throw err;
  }
});

export const logsSlice = createSlice({
  name: "logs",
  initialState,
  reducers: {
    addLog: (state, action: PayloadAction<TLog>) => {
      state.items[action.payload.id] = action.payload;
    },
    updateLog: (state, action: PayloadAction<TLog>) => {
      state.items[action.payload.id] = {
        ...state.items[action.payload.id],
        ...action.payload,
      };
    },
    removeLog: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    importLogs: (state, action: PayloadAction<TLogs>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch data
    builder.addCase(fetchLogsThunk.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(fetchLogsThunk.rejected, (state, action) => {
      state.fetchError = action.error.message;
    });
  },
});

export default logsSlice.reducer;
