import { TSentimentLog } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

export interface SentimentFrequencyState {
  impacts: Record<string, number>; // impactId → count
  emotions: Record<string, number>; // emotionId → count
}

const initialState: SentimentFrequencyState = {
  impacts: {},
  emotions: {},
};

const sentimentFrequencySlice = createSlice({
  name: "sentimentFrequency",
  initialState,
  reducers: {
    incrementSentimentFrequency(
      state,
      action: PayloadAction<{
        impacts: TSentimentLog[];
        emotions: TSentimentLog[];
      }>,
    ) {
      const { impacts, emotions } = action.payload;
      for (const impact of impacts) {
        const id = impact.definitionId;
        state.impacts[id] = (state.impacts[id] ?? 0) + 1;
      }
      for (const emotion of emotions) {
        const id = emotion.definitionId;
        state.emotions[id] = (state.emotions[id] ?? 0) + 1;
      }
    },
    resetFrequencies(state) {
      state.impacts = {};
      state.emotions = {};
    },
  },
});

export const { incrementSentimentFrequency, resetFrequencies } =
  sentimentFrequencySlice.actions;

export default sentimentFrequencySlice.reducer;
