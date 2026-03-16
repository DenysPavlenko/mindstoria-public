import { LogManager, LogManagerProps } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function LogManagerScreen() {
  const { date, logId } = useLocalSearchParams<LogManagerProps>();

  return <LogManager date={date} logId={logId} />;
}
