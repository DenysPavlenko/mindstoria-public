import { addLogToDb, removeLogFromDb, updateLogInDb } from "@/db";
import { TLog } from "@/types";
import { AppDispatch, RootState } from "../../store";
import { updateCBTLogThunk } from "../cbtLogs/thunks";
import { incrementSentimentFrequency } from "../sentimentFrequency/slice";
import { logsSlice } from "./slice";

const { addLog, updateLog, removeLog } = logsSlice.actions;

export const addLogThunk = (log: TLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await addLogToDb(log);

      dispatch(
        incrementSentimentFrequency({
          impacts: log.values.impacts,
          emotions: log.values.emotions,
        }),
      );

      dispatch(addLog(log));
    } catch {
      // Rollback in case of error
      dispatch(removeLog(log.id));
    }
  };
};

export const updateLogThunk = (log: TLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await updateLogInDb(log);
      dispatch(updateLog(log));
    } catch {
      // Ignore for MVP
    }
  };
};

export const removeLogThunk = (log: TLog) => {
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      // First, find and orphan the connected CBT entry (if any)
      const state = getState();
      const cbtLogs = Object.values(state.cbtLogs.items);
      const connectedCBTEntry = cbtLogs.find(
        (cbtLog) => cbtLog.wellbeingLogId === log.id,
      );

      // Orphan the connected CBT entry (remove wellbeingLogId reference)
      if (connectedCBTEntry) {
        const updatedCBTEntry = {
          ...connectedCBTEntry,
          wellbeingLogId: undefined,
        };
        await dispatch(updateCBTLogThunk(updatedCBTEntry));
      }

      // Then remove the log
      await removeLogFromDb(log.id);
      dispatch(removeLog(log.id));
    } catch {
      dispatch(addLog(log));
    }
  };
};
