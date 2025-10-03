import { Statistics } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function StatisticsScreen() {
  const { trackerId } = useLocalSearchParams<{ trackerId: string }>();

  return <Statistics trackerId={trackerId} />;
}
