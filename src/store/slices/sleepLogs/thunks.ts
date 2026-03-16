import {
  addSleepLogToDb,
  removeSleepLogFromDb,
  updateSleepLogInDb,
} from "@/db";
import { TSleepLog } from "@/types";
import { AppDispatch } from "../../store";
import { sleepSliceLogs } from "./slice";

const { addSleepLog, updateSleepLog, removeSleepLog } = sleepSliceLogs.actions;

export const addSleepLogThunk = (log: TSleepLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await addSleepLogToDb(log);
      dispatch(addSleepLog(log));
    } catch {
      // Rollback in case of error
      dispatch(removeSleepLog(log.id));
    }
  };
};

export const updateSleepLogThunk = (log: TSleepLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await updateSleepLogInDb(log);
      dispatch(updateSleepLog(log));
    } catch {
      // Ignore for MVP
    }
  };
};

export const removeSleepThunk = (log: TSleepLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await removeSleepLogFromDb(log.id);
      dispatch(removeSleepLog(log.id));
    } catch {
      dispatch(addSleepLog(log));
    }
  };
};
