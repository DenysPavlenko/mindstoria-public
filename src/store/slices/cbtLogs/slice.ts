import { getCBTLogsFromDb } from "@/db";
import { TCBTLog, TCBTLogs } from "@/types";
import { createAsyncThunk, createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface CBTLogsState {
  items: TCBTLogs;
  fetchError: string | undefined;
}

const initialState: CBTLogsState = {
  items: {},
  fetchError: undefined,
};

export const fetchCBTLogsThunk = createAsyncThunk("cbtLogs/fetch", async () => {
  try {
    return await getCBTLogsFromDb();
  } catch (err) {
    throw err;
  }
});

export const cbtLogsSlice = createSlice({
  name: "cbtLogs",
  initialState,
  reducers: {
    addCBTLog: (state, action: PayloadAction<TCBTLog>) => {
      state.items[action.payload.id] = action.payload;
    },
    updateCBTLog: (state, action: PayloadAction<TCBTLog>) => {
      state.items[action.payload.id] = {
        ...state.items[action.payload.id],
        ...action.payload,
      };
    },
    removeCBTLog: (state, action: PayloadAction<string>) => {
      delete state.items[action.payload];
    },
    importCBTLogs: (state, action: PayloadAction<TCBTLogs>) => {
      state.items = action.payload;
    },
  },
  extraReducers: (builder) => {
    // Fetch data
    builder.addCase(fetchCBTLogsThunk.fulfilled, (state, action) => {
      state.items = action.payload;
    });
    builder.addCase(fetchCBTLogsThunk.rejected, (state, action) => {
      state.fetchError = action.error.message;
    });
  },
});

export default cbtLogsSlice.reducer;
