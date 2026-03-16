import { EmotionDefinitionForm } from "@/screens";
import { useLocalSearchParams } from "expo-router";

export default function EmotionDefinitionFormScreen() {
  const { prefillName, definitionId, categoryId } = useLocalSearchParams<{
    prefillName?: string;
    categoryId?: string;
    definitionId?: string;
  }>();

  return (
    <EmotionDefinitionForm
      prefillName={prefillName}
      prefillCategoryId={categoryId}
      definitionId={definitionId}
    />
  );
}
