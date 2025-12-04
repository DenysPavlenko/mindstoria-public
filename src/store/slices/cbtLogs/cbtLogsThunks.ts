import { addCBTLogToDb, removeCBTLogFromDb, updateCBTLogInDb } from "@/db";
import { TCBTLog } from "@/types";
import { AppDispatch } from "../../store";
import { cbtLogsSlice } from "./cbtLogsSlice";

const { addCBTLog, updateCBTLog, removeCBTLog } = cbtLogsSlice.actions;

export const addCBTLogThunk = (log: TCBTLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await addCBTLogToDb(log);
      dispatch(addCBTLog(log));
    } catch {
      // Rollback in case of error
      dispatch(removeCBTLog(log.id));
    }
  };
};

export const updateCBTLogThunk = (log: TCBTLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await updateCBTLogInDb(log);
      dispatch(updateCBTLog(log));
    } catch {
      // Ignore for MVP
    }
  };
};

export const removeCBTLogThunk = (log: TCBTLog) => {
  return async (dispatch: AppDispatch) => {
    try {
      await removeCBTLogFromDb(log.id);
      dispatch(removeCBTLog(log.id));
    } catch {
      dispatch(addCBTLog(log));
    }
  };
};
