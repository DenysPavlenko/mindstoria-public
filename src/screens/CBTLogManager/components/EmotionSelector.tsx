import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { SentimentSelector, Typography } from "@/components";
import { useTheme } from "@/providers";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  archiveEmotionDefinition,
  selectAllEmotionSections,
} from "@/store/slices";
import { TTheme } from "@/theme";
import { TEmotionDefinition, TSentimentLog } from "@/types";
import { generateUniqueId, trackEvent } from "@/utils";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface EmotionSelectorProps {
  emotionLogItems: TSentimentLog[];
  onChange: (items: TSentimentLog[]) => void;
}

export const EmotionSelector = ({
  emotionLogItems,
  onChange,
}: EmotionSelectorProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const emotionSections = useAppSelector(selectAllEmotionSections);
  const [selectedDefinition, setSelectedDefinition] =
    useState<TEmotionDefinition | null>(null);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const emotionLogsMap = useMemo(() => {
    return emotionLogItems.reduce(
      (acc, item) => {
        acc[item.definitionId] = item;
        return acc;
      },
      {} as Record<string, TSentimentLog>,
    );
  }, [emotionLogItems]);

  // Filter out archived emotions that are not logged
  const filteredSections = useMemo(() => {
    return emotionSections.map((section) => {
      return {
        ...section,
        data: section.data.filter((definition) => {
          if (definition.isArchived && emotionLogsMap[definition.id]) {
            return true;
          }
          return !definition.isArchived;
        }),
      };
    });
  }, [emotionSections, emotionLogsMap]);

  const handleRemove = (defId: string) => {
    const filteredItems = emotionLogItems.filter((emotion) => {
      return emotion.definitionId !== defId;
    });
    onChange(filteredItems);
  };

  const handleAdd = (defId: string) => {
    const newLog: TSentimentLog = {
      id: generateUniqueId(),
      definitionId: defId,
    };
    onChange([...emotionLogItems, newLog]);
  };

  const handleArchive = () => {
    if (!selectedDefinition) return;
    // Remove emotion if it was logged
    handleRemove(selectedDefinition.id);
    // Archive the emotion definition
    dispatch(archiveEmotionDefinition(selectedDefinition.id));

    setSelectedDefinition(null);
    trackEvent(ANALYTICS_EVENTS.EMOTION_DELETE_CONFIRMED, {
      name: selectedDefinition.name,
    });
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Typography variant="h3" align="center">
          {t("emotions.what_are_you_feeling")}
        </Typography>
        <Typography
          variant="small"
          color="outline"
          align="center"
          style={styles.headerSubtitle}
        >
          {t("emotions.select_the_emotions")}
        </Typography>
      </View>
    );
  };

  return (
    <>
      {renderHeader()}
      <SentimentSelector
        sentimentType="emotion"
        sections={filteredSections}
        selectedLogs={emotionLogItems}
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
        safeView={false}
      />
    </>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.layout.spacing.lg,
    },
    listContent: {
      paddingBottom: theme.layout.spacing.lg,
    },
    header: {
      marginBottom: theme.layout.spacing.xl,
      alignItems: "center",
      gap: theme.layout.spacing.sm,
    },
    headerSubtitle: {
      maxWidth: 250,
    },
    menuTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.layout.spacing.sm,
    },
    menuButtons: {
      flexDirection: "row",
      gap: theme.layout.spacing.md,
      paddingHorizontal: theme.layout.spacing.lg,
    },
    menuButton: {
      flex: 1,
    },
  });
