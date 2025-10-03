import { createSlice } from "@reduxjs/toolkit";

interface TDataState {
  calendar: "month" | "week";
}

const initialState: TDataState = {
  calendar: "week",
};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {
    toggleCalendarWeekMonth: (state) => {
      state.calendar = state.calendar === "week" ? "month" : "week";
    },
  },
});

export const { toggleCalendarWeekMonth } = uiSlice.actions;

export default uiSlice.reducer;
