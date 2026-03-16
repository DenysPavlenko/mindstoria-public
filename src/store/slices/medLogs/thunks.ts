import { addMedLogToDb, removeMedLogFromDb, updateMedLogInDb } from "@/db";
import { TMedLog } from "@/types";
import { AppDispatch } from "../../store";
import { medLogsSlice } from "./slice";

const { addMedLog, updateMedLog, removeMedLog } = medLogsSlice.actions;

export const addMedLogThunk = (log: TMedLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await addMedLogToDb(log);
      dispatch(addMedLog(log));
    } catch {
      // Rollback in case of error
      dispatch(removeMedLog(log.id));
    }
  };
};

export const updateMedLogThunk = (log: TMedLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await updateMedLogInDb(log);
      dispatch(updateMedLog(log));
    } catch {
      // Ignore for MVP
    }
  };
};

export const removeMedLogThunk = (log: TMedLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await removeMedLogFromDb(log.id);
      dispatch(removeMedLog(log.id));
    } catch {
      dispatch(addMedLog(log));
    }
  };
};
