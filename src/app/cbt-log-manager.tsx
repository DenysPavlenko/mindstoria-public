import { CBTLogManager } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function CBTLogManagerScreen() {
  const { date, logId, metricId, wellbeingLogId } = useLocalSearchParams<{
    date?: string;
    logId?: string;
    metricId?: string;
    wellbeingLogId?: string;
  }>();

  return (
    <CBTLogManager
      date={date}
      logId={logId}
      metricId={metricId}
      wellbeingLogId={wellbeingLogId}
    />
  );
}
