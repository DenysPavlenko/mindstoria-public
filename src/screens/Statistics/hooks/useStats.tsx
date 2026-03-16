import { useAppSelector } from "@/store";
import { selectLogItems } from "@/store/slices";
import { TTimePeriod } from "@/types";
import {
  filterDataByTimePeriod,
  getEmotions,
  getEmotionStats,
  getImpacts,
  getImpactStats,
  getMedicationsChartData,
  getSleepLogChartDataMap,
  getTakenMedications,
  getWellbeingChartDataMap,
} from "@/utils";
import dayjs from "dayjs";
import { useMemo } from "react";

export const useStats = (period: TTimePeriod, date: dayjs.Dayjs) => {
  const logItems = useAppSelector(selectLogItems);
  const medicationsItems = useAppSelector((state) => state.medications.items);
  const sleepLogItems = useAppSelector((state) => state.sleepLogs.items);
  const medLogItems = useAppSelector((state) => state.medLogs.items);
  const impactDefsItems = useAppSelector(
    (state) => state.impactDefinitions.items,
  );
  const emotionDefsItems = useAppSelector(
    (state) => state.emotionDefinitions.items,
  );
  const { showMedications } = useAppSelector((state) => state.settings);

  const filteredLogs = useMemo(() => {
    return filterDataByTimePeriod(
      Object.values(logItems),
      "timestamp",
      period,
      date,
    );
  }, [logItems, period, date]);

  const wellbeingChartData = useMemo(
    () => getWellbeingChartDataMap(filteredLogs, period),
    [filteredLogs, period],
  );

  const sleepChartData = useMemo(() => {
    const logs = Object.values(sleepLogItems);
    const filtered = filterDataByTimePeriod(logs, "timestamp", period, date);
    return getSleepLogChartDataMap(filtered, period);
  }, [sleepLogItems, period, date]);

  const medsChartData = useMemo(() => {
    if (!showMedications) return null;
    const logs = Object.values(medLogItems);
    const filtered = filterDataByTimePeriod(logs, "timestamp", period, date);
    const takenMeds = getTakenMedications(filtered, medicationsItems);
    return getMedicationsChartData(takenMeds, period);
  }, [showMedications, medLogItems, medicationsItems, period, date]);

  const impactsStats = useMemo(() => {
    const items = filteredLogs.flatMap((log) => log.values.impacts || []);
    const impacts = getImpacts(items, impactDefsItems);
    return getImpactStats(impacts);
  }, [filteredLogs, impactDefsItems]);

  const emotionsStats = useMemo(() => {
    const items = filteredLogs.flatMap((log) => log.values.emotions || []);
    const emotions = getEmotions(items, emotionDefsItems);
    return getEmotionStats(emotions);
  }, [filteredLogs, emotionDefsItems]);

  return {
    wellbeingChartData,
    sleepChartData,
    medsChartData,
    impactsStats,
    emotionsStats,
  };
};
