import { SentimentSelectionCard } from "@/components";
import { useAppSelector } from "@/store";
import { selectEmotionDefinitions, selectTopEmotionDefs } from "@/store/slices";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface EmotionsCardProps {
  onButtonPress: (itemId: string) => void;
  selectedMap: Record<string, boolean>;
}

export const EmotionsCard = ({
  onButtonPress,
  selectedMap,
}: EmotionsCardProps) => {
  const router = useRouter();
  const { t } = useTranslation();

  const topEmotionDefs = useAppSelector(selectTopEmotionDefs);
  const emotionDefs = useAppSelector(selectEmotionDefinitions);
  const selectedEmotions = useMemo(() => {
    return emotionDefs.filter((def) => selectedMap[def.id]);
  }, [selectedMap, emotionDefs]);

  const filteredTopEmotionDefs = useMemo(() => {
    return topEmotionDefs.filter((def) => !selectedMap[def.id]);
  }, [selectedMap, topEmotionDefs]);

  const handleAddPress = () => {
    router.navigate("/emotion-selector");
  };

  return (
    <SentimentSelectionCard
      sentimentType="emotion"
      title={t("emotions.what_are_you_feeling")}
      items={selectedEmotions}
      topItems={filteredTopEmotionDefs}
      selectedMap={selectedMap}
      onButtonPress={onButtonPress}
      onAddPress={handleAddPress}
    />
  );
};
