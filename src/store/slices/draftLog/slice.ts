import { DraftLogState, DraftLogStateField, TSentimentLog } from "@/types";
import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import dayjs from "dayjs";

const initialState: DraftLogState = {
  wellbeing: null,
  impacts: [],
  emotions: [],
  notes: null,
  timestamp: dayjs().toISOString(),
};

type SetDraftFieldPayload<K extends DraftLogStateField> = {
  field: K;
  value: DraftLogState[K];
};

export const draftLogSlice = createSlice({
  name: "draftLog",
  initialState,
  reducers: {
    setDraftLog: (state, action: PayloadAction<DraftLogState>) => {
      return action.payload;
    },
    setDraftField: <K extends DraftLogStateField>(
      state: DraftLogState,
      action: PayloadAction<SetDraftFieldPayload<K>>,
    ) => {
      const { field, value } = action.payload;
      state[field] = value;
    },
    addDraftImpact: (state, action: PayloadAction<TSentimentLog>) => {
      state.impacts.push(action.payload);
    },
    removeDraftImpact: (state, action: PayloadAction<string>) => {
      state.impacts = state.impacts.filter(
        (impact) => impact.definitionId !== action.payload,
      );
    },
    addDraftEmotion: (state, action: PayloadAction<TSentimentLog>) => {
      state.emotions.push(action.payload);
    },
    removeDraftEmotion: (state, action: PayloadAction<string>) => {
      state.emotions = state.emotions.filter(
        (emotion) => emotion.definitionId !== action.payload,
      );
    },
    resetDraftLog() {
      return initialState;
    },
  },
});

export const {
  setDraftLog,
  resetDraftLog,
  addDraftEmotion,
  removeDraftEmotion,
  addDraftImpact,
  removeDraftImpact,
} = draftLogSlice.actions;

export const setDraftField = <K extends DraftLogStateField>(
  payload: SetDraftFieldPayload<K>,
) => draftLogSlice.actions.setDraftField(payload);

export default draftLogSlice.reducer;
