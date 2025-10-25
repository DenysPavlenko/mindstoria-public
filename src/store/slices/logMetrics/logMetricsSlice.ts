import { TLogMetric } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface LogMetricsState {
  items: TLogMetric[];
}

const initialState: LogMetricsState = {
  items: [
    {
      id: "wellbeing",
      type: "wellbeing",
      min: 1,
      max: 5,
      isMandatory: true,
      isVisible: true,
    },
    {
      id: "impacts",
      type: "impacts",
      isMandatory: false,
      isVisible: true,
    },
    {
      id: "emotions",
      type: "emotions",
      isMandatory: false,
      isVisible: true,
    },
    {
      id: "notes",
      type: "notes",
      isMandatory: false,
      isVisible: true,
    },
  ],
};

const logMetricsSlice = createSlice({
  name: "logMetrics",
  initialState,
  reducers: {
    removeLogMetric(state, action: PayloadAction<string>) {},
  },
});

export const { removeLogMetric } = logMetricsSlice.actions;
export default logMetricsSlice.reducer;
