import { createSlice } from "@reduxjs/toolkit";

interface TUIState {}

const initialState: TUIState = {};

export const uiSlice = createSlice({
  name: "ui",
  initialState,
  reducers: {},
});

export default uiSlice.reducer;
