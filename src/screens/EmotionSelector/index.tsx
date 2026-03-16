import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { Button, Header, SentimentSelector } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addDraftEmotion,
  archiveEmotionDefinition,
  removeDraftEmotion,
  selectEmotionSections,
} from "@/store/slices";
import { generateUniqueId } from "@/utils";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export const EmotionSelector = () => {
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const emotionSections = useAppSelector(selectEmotionSections);
  const selectedEmotions = useAppSelector((state) => state.draftLog.emotions);

  const handleAdd = (definitionId: string) => {
    dispatch(addDraftEmotion({ id: generateUniqueId(), definitionId }));
  };

  const handleRemove = (definitionId: string) => {
    dispatch(removeDraftEmotion(definitionId));
  };

  const handleArchive = (definitionId: string) => {
    dispatch(archiveEmotionDefinition(definitionId));
    handleRemove(definitionId);
  };

  return (
    <>
      <Header title={t("emotions.select_emotions")} />
      <SentimentSelector
        sentimentType="emotion"
        sections={emotionSections}
        selectedLogs={selectedEmotions}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onArchive={handleArchive}
        routes={{ definitionForm: "/emotion-definition-form" }}
        translations={{
          searchPlaceholder: t("emotions.search_emotion"),
          confirmDeleteContent: t("emotions.confirm_delete"),
        }}
        analytics={{
          editStarted: ANALYTICS_EVENTS.EMOTION_EDIT_STARTED,
          createStarted: ANALYTICS_EVENTS.EMOTION_CREATE_STARTED,
          deleteConfirmed: ANALYTICS_EVENTS.EMOTION_DELETE_CONFIRMED,
        }}
        footer={
          <Button onPress={router.back} fullWidth>
            {t("common.done")}
          </Button>
        }
      />
    </>
  );
};
