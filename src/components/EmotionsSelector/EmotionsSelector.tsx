import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { useTranslatedEmotionDefinitions } from "@/hooks";
import { useTheme } from "@/providers";
import { useAppDispatch } from "@/store";
import { archiveEmotionDefinition } from "@/store/slices";
import { TTheme } from "@/theme";
import {
  RatingLevel,
  TEmotionDefinition,
  TEmotionLog,
  TSentimentType,
} from "@/types";
import { generateUniqueId, trackEvent } from "@/utils";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Button } from "../Button/Button";
import { ConfirmationDialog } from "../ConfirmationDialog/ConfirmationDialog";
import { IconBox } from "../IconBox/IconBox";
import { SentimentFilter } from "../SentimentFilter/SentimentFilter";
import { SentimentIconButton } from "../SentimentIconButton/SentimentIconButton";
import { SentimentList } from "../SentimentList/SentimentList";
import { SlideInModal } from "../SlideInModal/SlideInModal";
import { Typography } from "../Typography/Typography";

interface EmotionsSelectorProps {
  emotionLogItems: TEmotionLog[];
  onChange: (items: TEmotionLog[]) => void;
  wellbeing: RatingLevel | null;
}

export const EmotionsSelector = ({
  emotionLogItems,
  onChange,
  wellbeing,
}: EmotionsSelectorProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const emotionDefinitions = useTranslatedEmotionDefinitions({ sorted: true });
  const [selectedType, setSelectedType] = useState<TSentimentType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDefinition, setSelectedDefinition] =
    useState<TEmotionDefinition | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (wellbeing) {
      if (wellbeing > 3) {
        setSelectedType("positive");
      } else if (wellbeing < 3) {
        setSelectedType("negative");
      } else {
        setSelectedType(null);
      }
    }
  }, [wellbeing]);

  const emotionLogsMap = useMemo(() => {
    return emotionLogItems.reduce(
      (acc, item) => {
        acc[item.definitionId] = item;
        return acc;
      },
      {} as Record<string, TEmotionLog>,
    );
  }, [emotionLogItems]);

  // Filter emotion definitions based on search and type
  const filteredDefinitions = useMemo(() => {
    return emotionDefinitions
      .filter((def) => {
        if (selectedType === null) return true;
        return def.type === selectedType;
      })
      .filter((def) => {
        if (searchQuery.trim() === "") return true;
        return def.name.toLowerCase().includes(searchQuery.toLowerCase());
      })
      .filter((def) => {
        // Keep archived items if they are currently selected
        if (def.isArchived && emotionLogsMap[def.id]) return true;
        // Otherwise filter out archived items
        return !def.isArchived;
      });
  }, [emotionDefinitions, selectedType, searchQuery, emotionLogsMap]);

  const removeEmotionLog = (defId: string) => {
    const filteredItems = emotionLogItems.filter((emotion) => {
      return emotion.definitionId !== defId;
    });
    onChange(filteredItems);
  };

  const addEmotionLog = (defId: string) => {
    const newLog: TEmotionLog = { id: generateUniqueId(), definitionId: defId };
    onChange([...emotionLogItems, newLog]);
  };

  const handleEmotionPress = (
    item: TEmotionDefinition,
    isSelected: boolean,
  ) => {
    if (isSelected) {
      removeEmotionLog(item.id);
    } else {
      addEmotionLog(item.id);
    }
  };

  const handleEmotionEdit = (definitionId: string) => {
    router.navigate({
      pathname: "/emotion-definition-form",
      params: { definitionId },
    });
    setSelectedDefinition(null);
    trackEvent(ANALYTICS_EVENTS.EMOTION_EDIT_STARTED, {
      source: "addButton",
    });
  };

  const handleEmotionDelete = () => {
    if (!selectedDefinition) return;
    // Remove emotion if it was logged
    removeEmotionLog(selectedDefinition.id);
    // Archive the emotion definition
    dispatch(archiveEmotionDefinition(selectedDefinition.id));
    setShowConfirmDelete(false);
    setSelectedDefinition(null);
    trackEvent(ANALYTICS_EVENTS.EMOTION_DELETE_CONFIRMED, {
      name: selectedDefinition.name,
    });
  };

  const renderFilter = () => {
    return (
      <SentimentFilter
        query={searchQuery}
        onSearch={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={setSelectedType}
        onPlusPress={() => {
          router.navigate({
            pathname: "/emotion-definition-form",
            params: { type: selectedType || undefined },
          });
          trackEvent(ANALYTICS_EVENTS.EMOTION_CREATE_STARTED, {
            source: "addButton",
          });
        }}
        style={{ marginBottom: theme.layout.spacing.lg }}
        searchPlaceholder={t("emotions.search_emotion")}
      />
    );
  };

  const renderItem = ({ item }: { item: TEmotionDefinition }) => {
    const emotionLog = emotionLogsMap[item.id];
    const isSelected = Boolean(emotionLog);
    return (
      <SentimentIconButton
        title={item.name}
        icon={item.icon}
        category="emotion"
        type={item.type}
        isSelected={isSelected}
        isArchived={item.isArchived}
        onPress={() => handleEmotionPress(item, isSelected)}
        onLongPress={() => {
          setSelectedDefinition(item);
          setShowMenu(true);
        }}
      />
    );
  };

  const renderList = () => {
    return (
      <SentimentList
        data={filteredDefinitions}
        renderItem={renderItem}
        searchQuery={searchQuery}
        keyExtractor={(item) => item.id}
        onAddPress={() => {
          router.navigate({
            pathname: "/emotion-definition-form",
            params: {
              prefillName: searchQuery,
              type: selectedType || undefined,
            },
          });
          trackEvent(ANALYTICS_EVENTS.EMOTION_CREATE_STARTED, {
            source: "emotionSearch",
          });
        }}
        style={styles.listContent}
      />
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Typography variant="h3" align="center">
          {t("emotions.what_emotions_are_you_feeling")}
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

  const renderEmotionMenu = () => {
    if (!showMenu || !selectedDefinition) return null;
    return (
      <SlideInModal
        visible
        onClose={() => {
          setShowMenu(false);
          setSelectedDefinition(null);
        }}
        hideCloseButton
        title={
          <View style={styles.menuTitle}>
            <IconBox
              customContent={<Typography>{selectedDefinition.icon}</Typography>}
              size="md"
            />
            <Typography variant="h3">{t(selectedDefinition.name)}</Typography>
          </View>
        }
      >
        <View style={styles.menuButtons}>
          <Button
            style={styles.menuButton}
            onPress={() => handleEmotionEdit(selectedDefinition.id)}
          >
            {t("common.edit")}
          </Button>
          <Button
            buttonColor="error"
            style={styles.menuButton}
            textColor="onError"
            onPress={() => {
              setShowConfirmDelete(true);
              setShowMenu(false);
            }}
          >
            {t("common.delete")}
          </Button>
        </View>
      </SlideInModal>
    );
  };

  const renderConfirmDelete = () => {
    if (!showConfirmDelete || !selectedDefinition) return null;
    return (
      <ConfirmationDialog
        visible
        onConfirm={handleEmotionDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          setSelectedDefinition(null);
        }}
        title={t("common.confirm_delete")}
        content={t("emotions.confirm_delete")}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilter()}
      {renderList()}
      {renderEmotionMenu()}
      {renderConfirmDelete()}
    </View>
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
