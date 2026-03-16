import { TTimePeriod } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface UIState {
  statsPreferences: {
    period: TTimePeriod;
  };
  statsSession: {
    dateIso: string;
  };
}

const initialState: UIState = {
  statsPreferences: {
    period: "week",
  },
  statsSession: {
    dateIso: "",
  },
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    setStatsPeriod: (state, action: PayloadAction<TTimePeriod>) => {
      state.statsPreferences.period = action.payload;
    },
    setStatsDateIso: (state, action: PayloadAction<string>) => {
      state.statsSession.dateIso = action.payload;
    },
  },
});

export const { setStatsPeriod, setStatsDateIso } = uiSlice.actions;

export default uiSlice.reducer;
