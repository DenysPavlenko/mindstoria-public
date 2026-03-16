import { CBTLogManager, CBTLogManagerProps } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function CBTLogManagerScreen() {
  const { date, logId, metricId, wellbeingLogId } =
    useLocalSearchParams<CBTLogManagerProps>();

  return (
    <CBTLogManager
      date={date}
      logId={logId}
      metricId={metricId}
      wellbeingLogId={wellbeingLogId}
    />
  );
}
