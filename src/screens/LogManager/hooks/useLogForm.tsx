import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addLogThunk,
  resetDraftLog,
  selectLogItems,
  selectLogMetrics,
  setDraftField,
  setDraftLog,
  updateLogThunk,
} from "@/store/slices";
import {
  DraftLogState,
  DraftLogStateField,
  RatingLevel,
  TLogValue,
  TLogValues,
  TSentimentLog,
} from "@/types";
import { generateUniqueId, isStringEmpty, trackEvent } from "@/utils";
import dayjs from "dayjs";
import { useCallback, useMemo } from "react";

export type TLogFormValues = {
  wellbeing: RatingLevel | null;
  impacts: TSentimentLog[];
  emotions: TSentimentLog[];
  notes: string | null;
};

export const useLogForm = (logId?: string) => {
  const dispatch = useAppDispatch();
  const fields = useAppSelector((state) => state.draftLog);
  const logs = useAppSelector(selectLogItems);
  const metrics = useAppSelector(selectLogMetrics);

  const currentLog = useMemo(() => logs[logId || ""] || null, [logs, logId]);
  const isEditing = Boolean(logId);

  const isValid = useMemo(() => {
    const mandatoryMetrics = metrics.filter((m) => m.isMandatory);
    return mandatoryMetrics.map((m) => fields[m.type]).every((v) => v !== null);
  }, [fields, metrics]);

  const setField = useCallback(
    (field: DraftLogStateField, value: TLogValue) => {
      dispatch(setDraftField({ field: field, value }));
    },
    [dispatch],
  );

  const setAllFields = useCallback(
    (data: DraftLogState) => {
      dispatch(setDraftLog(data));
    },
    [dispatch],
  );

  const resetForm = useCallback(() => dispatch(resetDraftLog()), [dispatch]);

  const saveLog = useCallback(() => {
    const { wellbeing, impacts, emotions, notes, timestamp } = fields;
    if (!isValid || wellbeing === null) return null;
    const logValues: TLogValues = {
      wellbeing,
      impacts,
      emotions,
      notes: notes?.trim() || null,
    };
    const id = currentLog?.id || generateUniqueId();
    if (currentLog) {
      dispatch(
        updateLogThunk({
          ...currentLog,
          values: logValues,
          timestamp,
        }),
      );
    } else {
      dispatch(addLogThunk({ id, values: logValues, timestamp }));
    }

    trackEvent(ANALYTICS_EVENTS.MOOD_LOG_COMPLETED, {
      mode: isEditing ? "edit" : "create",
      moodLogged: true,
      impactsLogged: logValues.impacts.length > 0,
      emotionsLogged: logValues.emotions.length > 0,
      notesLogged: !isStringEmpty(logValues.notes),
    });

    return id;
  }, [isValid, fields, currentLog, isEditing, dispatch]);

  const formattedTime = useMemo(
    () => dayjs(fields.timestamp).format("HH:mm"),
    [fields.timestamp],
  );

  const initialTime = useMemo(() => {
    const d = dayjs(fields.timestamp);
    return { hours: d.hour(), minutes: d.minute() };
  }, [fields.timestamp]);

  return {
    fields,
    currentLog,
    isEditing,
    isValid,
    formattedTime,
    initialTime,
    setField,
    setAllFields,
    saveLog,
    resetForm,
  };
};
