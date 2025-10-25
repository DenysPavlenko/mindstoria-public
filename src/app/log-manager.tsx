import { LogManager } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function LogManagerScreen() {
  const { date, logId, metricId } = useLocalSearchParams<{
    date?: string;
    logId?: string;
    metricId?: string;
  }>();

  return <LogManager date={date} logId={logId} metricId={metricId} />;
}
