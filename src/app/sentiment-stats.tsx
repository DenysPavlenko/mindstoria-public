import { SentimentStats, SentimentStatsProps } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function SentimentStatsScreen() {
  const { sentimentType } = useLocalSearchParams<SentimentStatsProps>();

  return <SentimentStats sentimentType={sentimentType} />;
}
