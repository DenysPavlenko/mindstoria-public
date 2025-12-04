import { importDataToDb } from "@/db";
import { AppDispatch } from "@/store/store";
import { TBackUpData } from "@/types";
import { cbtLogsSlice } from "../cbtLogs/cbtLogsSlice";
import { importEmotionDefinitions } from "../emotionDefinitions/emotionDefinitionsSlice";
import { importImpactDefinitions } from "../impactDefinitions/impactDefinitionsSlice";
import { logsSlice } from "../logs/logsSlice";
import { importMedications } from "../medications/medicationsSlice";
import { medLogsSlice } from "../medLogs/medLogsSlice";
import { sleepSliceLogs } from "../sleepLogs/sleepLogsSlice";

const { importSleepLogs } = sleepSliceLogs.actions;
const { importMedLogs } = medLogsSlice.actions;
const { importLogs } = logsSlice.actions;
const { importCBTLogs } = cbtLogsSlice.actions;

const getImportableData = (data: TBackUpData): Partial<TBackUpData> => {
  const result: Partial<TBackUpData> = {};
  if (Object.keys(data.emotionDefinitions).length > 0) {
    result.emotionDefinitions = data.emotionDefinitions;
  }
  if (Object.keys(data.impactDefinitions).length > 0) {
    result.impactDefinitions = data.impactDefinitions;
  }
  if (Object.keys(data.medications).length > 0) {
    result.medications = data.medications;
  }
  if (Object.keys(data.sleepLogs).length > 0) {
    result.sleepLogs = data.sleepLogs;
  }
  if (Object.keys(data.medLogs).length > 0) {
    result.medLogs = data.medLogs;
  }
  if (Object.keys(data.logs).length > 0) {
    result.logs = data.logs;
  }
  if (Object.keys(data.cbtLogs).length > 0) {
    result.cbtLogs = data.cbtLogs;
  }
  return result;
};

export const importDataThunk = (data: TBackUpData) => {
  return async (dispatch: AppDispatch) => {
    try {
      const validData = getImportableData(data);
      await importDataToDb(validData);

      // Use validData consistently for both checking and dispatching
      if (validData.emotionDefinitions) {
        dispatch(importEmotionDefinitions(validData.emotionDefinitions));
      }
      if (validData.impactDefinitions) {
        dispatch(importImpactDefinitions(validData.impactDefinitions));
      }
      if (validData.medications) {
        dispatch(importMedications(validData.medications));
      }
      if (validData.sleepLogs) {
        dispatch(importSleepLogs(validData.sleepLogs));
      }
      if (validData.medLogs) {
        dispatch(importMedLogs(validData.medLogs));
      }
      if (validData.logs) {
        dispatch(importLogs(validData.logs));
      }
      if (validData.cbtLogs) {
        dispatch(importCBTLogs(validData.cbtLogs));
      }
    } catch (error) {
      // Re-throw to let the calling component handle the error
      throw error;
    }
  };
};
