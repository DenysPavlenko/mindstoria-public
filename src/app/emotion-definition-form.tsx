import { EmotionDefinitionForm } from "@/screens";
import { TSentimentType } from "@/types";
import { useLocalSearchParams } from "expo-router";

export default function EmotionDefinitionFormScreen() {
  const { prefillName, type, definitionId } = useLocalSearchParams<{
    prefillName?: string;
    definitionId?: string;
    type?: TSentimentType;
  }>();

  return (
    <EmotionDefinitionForm
      prefillName={prefillName}
      type={type}
      definitionId={definitionId}
    />
  );
}
