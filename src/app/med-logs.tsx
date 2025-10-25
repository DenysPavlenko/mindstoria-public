import { MedLogs } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function MedLogsScreen() {
  const { date } = useLocalSearchParams<{
    date: string;
  }>();

  return <MedLogs date={date} />;
}
