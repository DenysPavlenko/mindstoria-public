import { TrackerForm } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function TrackerFormScreen() {
  const { trackerId } = useLocalSearchParams<{ trackerId: string }>();

  return <TrackerForm trackerId={trackerId} />;
}
