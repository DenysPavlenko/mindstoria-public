import { SentimentSelectionCard } from "@/components";
import { useAppSelector } from "@/store";
import { selectImpactDefinitions, selectTopImpactDefs } from "@/store/slices";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface ImpactsCardProps {
  onButtonPress: (itemId: string) => void;
  selectedMap: Record<string, boolean>;
}

export const ImpactsCard = ({
  onButtonPress,
  selectedMap,
}: ImpactsCardProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const topImpactDefs = useAppSelector(selectTopImpactDefs);
  const impactDefs = useAppSelector(selectImpactDefinitions);
  const selectedImpacts = useMemo(() => {
    return impactDefs.filter((def) => selectedMap[def.id]);
  }, [selectedMap, impactDefs]);

  const handleAddPress = () => {
    router.navigate("/impact-selector");
  };

  const filteredTopImpactDefs = useMemo(() => {
    return topImpactDefs.filter((def) => !selectedMap[def.id]);
  }, [selectedMap, topImpactDefs]);

  return (
    <SentimentSelectionCard
      sentimentType="impact"
      title={t("impacts.what_affected_your_mood")}
      items={selectedImpacts}
      topItems={filteredTopImpactDefs}
      selectedMap={selectedMap}
      onButtonPress={onButtonPress}
      onAddPress={handleAddPress}
    />
  );
};
