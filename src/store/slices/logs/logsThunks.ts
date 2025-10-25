import { addLogToDb, removeLogFromDb, updateLogInDb } from "@/db";
import { TLog } from "@/types";
import { AppDispatch } from "../../store";
import { logsSlice } from "./logsSlice";

const { addLog, updateLog, removeLog } = logsSlice.actions;

export const addLogThunk = (log: TLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await addLogToDb(log);
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
  return async (dispatch: AppDispatch) => {
    try {
      await removeLogFromDb(log.id);
      dispatch(removeLog(log.id));
    } catch {
      dispatch(addLog(log));
    }
  };
};
