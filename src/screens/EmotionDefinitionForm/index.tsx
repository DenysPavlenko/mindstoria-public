import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { SentimentDefinitionForm } from "@/components/SentimentDefinitionForm/SentimentDefinitionForm";
import { emojiList } from "@/data";
import { useTranslatedEmotionDefinitions } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addEmotionDefinition,
  selectEmotionDefinitionCategories,
  selectEmotionDefinitionCategoryOrder,
  updateEmotionDefinition,
} from "@/store/slices";
import { TSentimentCategoryDefinition } from "@/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface EmotionDefinitionFormProps {
  prefillName?: string;
  prefillCategoryId?: string;
  definitionId?: string;
}

export const EmotionDefinitionForm = ({
  prefillName,
  prefillCategoryId,
  definitionId,
}: EmotionDefinitionFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const definitions = useTranslatedEmotionDefinitions({ activeOnly: true });
  const categoryOrder = useAppSelector(selectEmotionDefinitionCategoryOrder);
  const categoriesMap = useAppSelector(selectEmotionDefinitionCategories);
  const categories = useMemo(() => {
    return categoryOrder
      .map((id) => categoriesMap[id])
      .filter((category): category is TSentimentCategoryDefinition =>
        Boolean(category),
      );
  }, [categoryOrder, categoriesMap]);

  return (
    <SentimentDefinitionForm
      prefillName={prefillName}
      prefillCategoryId={prefillCategoryId}
      definitionId={definitionId}
      definitions={definitions}
      iconList={emojiList}
      categories={categories}
      sentimentType="emotion"
      translations={{
        headerTitle: t("emotions.add_own_emotion"),
        inputLabel: t("emotions.emotion_name"),
        inputPlaceholder: t("emotions.add_emotion_placeholder"),
        duplicateError: t("emotions.duplicate_emotion_name"),
      }}
      analytics={{
        editCompleted: ANALYTICS_EVENTS.EMOTION_EDIT_COMPLETED,
        createCompleted: ANALYTICS_EVENTS.EMOTION_CREATE_COMPLETED,
      }}
      onAdd={(def) => dispatch(addEmotionDefinition(def))}
      onEdit={(def) => dispatch(updateEmotionDefinition(def))}
    />
  );
};
