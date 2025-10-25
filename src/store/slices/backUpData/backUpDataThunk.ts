import { importDataToDb } from "@/db";
import { AppDispatch } from "@/store/store";
import { TBackUpData } from "@/types";
import { importEmotionDefinitions } from "../emotionDefinitions/emotionDefinitionsSlice";
import { importImpactDefinitions } from "../impactDefinitions/impactDefinitionsSlice";
import { logsSlice } from "../logs/logsSlice";
import { importMedications } from "../medications/medicationsSlice";
import { medLogsSlice } from "../medLogs/medLogsSlice";
import { sleepSliceLogs } from "../sleepLogs/sleepLogsSlice";

const { importSleepLogs } = sleepSliceLogs.actions;
const { importMedLogs } = medLogsSlice.actions;
const { importLogs } = logsSlice.actions;

export const importDataThunk = (data: TBackUpData) => {
  return async (dispatch: AppDispatch) => {
    await importDataToDb(data);

    dispatch(importEmotionDefinitions(data.emotionDefinitions));
    dispatch(importImpactDefinitions(data.impactDefinitions));
    dispatch(importMedications(data.medications));

    dispatch(importSleepLogs(data.sleepLogs));
    dispatch(importMedLogs(data.medLogs));
    dispatch(importLogs(data.logs));
  };
};
