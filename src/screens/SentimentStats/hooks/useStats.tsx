import { useAppSelector } from "@/store";
import { selectLogItems } from "@/store/slices";
import { RatingLevel, TLog, TSentimentType, TTimePeriod } from "@/types";
import {
  filterDataByTimePeriod,
  getEmotionStatsByMood,
  getImpactStatsByMood,
} from "@/utils";
import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import { useMemo, useRef } from "react";

interface UseStatsOptions {
  sentimentType: TSentimentType;
  period: TTimePeriod;
  date: dayjs.Dayjs;
  mood: RatingLevel | null;
}

export const useStats = ({
  sentimentType,
  period,
  date,
  mood,
}: UseStatsOptions) => {
  const isFocused = useIsFocused();
  const logItems = useAppSelector(selectLogItems);
  const impactDefs = useAppSelector((state) => state.impactDefinitions.items);
  const emotionDefs = useAppSelector((state) => state.emotionDefinitions.items);

  const cachedLogs = useRef<TLog[] | null>(null);

  const filteredLogItems = useMemo(() => {
    const cachedData = cachedLogs.current;
    if (!isFocused && cachedData) return cachedData;
    const logs = Object.values(logItems);
    const filtered = filterDataByTimePeriod(logs, "timestamp", period, date);
    cachedLogs.current = filtered;
    return filtered;
  }, [logItems, isFocused, period, date]);

  const statsData = useMemo(() => {
    if (sentimentType === "impact") {
      return getImpactStatsByMood(filteredLogItems, impactDefs, mood);
    }
    return getEmotionStatsByMood(filteredLogItems, emotionDefs, mood);
  }, [filteredLogItems, impactDefs, emotionDefs, mood, sentimentType]);

  return { statsData };
};
