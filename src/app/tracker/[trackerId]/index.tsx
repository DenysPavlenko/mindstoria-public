import { Tracker } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function TrackerScreen() {
  const { trackerId } = useLocalSearchParams<{ trackerId: string }>();

  return <Tracker trackerId={trackerId} />;
}
