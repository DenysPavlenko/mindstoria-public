import { ImpactDefinitionForm } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function ImpactDefinitionFormScreen() {
  const { prefillName, definitionId, categoryId } = useLocalSearchParams<{
    prefillName?: string;
    categoryId?: string;
    definitionId?: string;
  }>();

  return (
    <ImpactDefinitionForm
      prefillName={prefillName}
      prefillCategoryId={categoryId}
      definitionId={definitionId}
    />
  );
}
