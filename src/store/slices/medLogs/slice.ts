import { getMedLogsFromDb } from "@/db";
import { TMedLog, TMedLogs } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface MedsLogsState {
  items: TMedLogs;
  fetchError: string | undefined;
}

const initialState: MedsLogsState = {
  items: {},
  fetchError: undefined,
};

export const fetchMedLogsThunk = createAsyncThunk("meds/fetch", async () => {
  try {
    return await getMedLogsFromDb();
  } catch (err) {
    throw err;
  }
});

export const medLogsSlice = createSlice({
  name: "medLogs",
  initialState,
  reducers: {
    addMedLog: (state, action: PayloadAction<TMedLog>) => {
      const medLog = action.payload;
      state.items[medLog.id] = medLog;
    },
    updateMedLog: (state, action: PayloadAction<TMedLog>) => {
      const medLog = action.payload;
      state.items[medLog.id] = medLog;
    },
    removeMedLog: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    importMedLogs: (state, action: PayloadAction<TMedLogs>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch data
    builder.addCase(fetchMedLogsThunk.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(fetchMedLogsThunk.rejected, (state, action) => {
      state.fetchError = action.error.message;
    });
  },
});

export default medLogsSlice.reducer;
