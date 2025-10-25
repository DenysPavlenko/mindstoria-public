import { ImpactDefinitionForm } from "@/screens";
import { TSentimentType } from "@/types";
import { useLocalSearchParams } from "expo-router";

export default function ImpactDefinitionFormScreen() {
  const { prefillName, type, definitionId } = useLocalSearchParams<{
    prefillName?: string;
    definitionId?: string;
    type?: TSentimentType;
  }>();

  return (
    <ImpactDefinitionForm
      prefillName={prefillName}
      type={type}
      definitionId={definitionId}
    />
  );
}
