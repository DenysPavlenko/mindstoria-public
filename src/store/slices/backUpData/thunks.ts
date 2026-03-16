import {
  LEGACY_EMOTION_TRANSLATION_PREFIXES,
  LEGACY_IMPACT_TRANSLATION_PREFIXES,
} from "@/appConstants";
import { importDataToDb } from "@/db";
import { AppDispatch, RootState } from "@/store/store";
import { TBackUpData } from "@/types";
import { migrateDefinitions } from "@/utils";
import { cbtLogsSlice } from "../cbtLogs/slice";
import { importEmotionDefinitions } from "../emotionDefinitions/slice";
import { importImpactDefinitions } from "../impactDefinitions/slice";
import { logsSlice } from "../logs/slice";
import { importMedications } from "../medications/slice";
import { medLogsSlice } from "../medLogs/slice";
import { sleepSliceLogs } from "../sleepLogs/slice";

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
  return async (dispatch: AppDispatch, getState: () => RootState) => {
    try {
      const validData = getImportableData(data);
      await importDataToDb(validData);
      const state = getState();
      // Use validData consistently for both checking and dispatching
      if (validData.emotionDefinitions) {
        const newDefs = migrateDefinitions(
          validData.emotionDefinitions,
          Object.values(state.emotionDefinitions.items),
          LEGACY_EMOTION_TRANSLATION_PREFIXES,
        );
        dispatch(importEmotionDefinitions(newDefs));
      }
      if (validData.impactDefinitions) {
        const newDefs = migrateDefinitions(
          validData.impactDefinitions,
          Object.values(state.impactDefinitions.items),
          LEGACY_IMPACT_TRANSLATION_PREFIXES,
        );
        dispatch(importImpactDefinitions(newDefs));
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
