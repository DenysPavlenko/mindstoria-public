import { useTranslatedEmotionDefinitions } from "@/hooks";
import { useAppDispatch } from "@/store";
import { archiveEmotionDefinition } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import {
  RatingLevel,
  TEmotionDefinition,
  TEmotionLog,
  TSentimentLevel,
  TSentimentType,
} from "@/types";
import { generateUniqueId, getSentimentColor } from "@/utils";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { Button } from "../Button/Button";
import { ConfirmationDialog } from "../ConfirmationDialog/ConfirmationDialog";
import { IconBox } from "../IconBox/IconBox";
import { SelectableIconButton } from "../SelectableIconButton/SelectableIconButton";
import { SentimentFilter } from "../SentimentFilter/SentimentFilter";
import { SentimentSlider } from "../SentimentSlider/SentimentSlider";
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
  const [selectedEmotion, setSelectedEmotion] =
    useState<TEmotionDefinition | null>(null);
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
    return emotionLogItems.reduce((acc, item) => {
      acc[item.definitionId] = item;
      return acc;
    }, {} as Record<string, TEmotionLog>);
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

  const handleEmotionPress = (
    item: TEmotionDefinition,
    isSelected: boolean
  ) => {
    if (isSelected) {
      removeEmotionLog(item.id);
      setSelectedEmotion(null);
    } else {
      setSelectedEmotion(item);
    }
  };

  const handleSave = (level: TSentimentLevel) => {
    if (selectedEmotion === null) return;
    onChange([
      ...emotionLogItems,
      {
        id: generateUniqueId(),
        definitionId: selectedEmotion.id,
        level,
      },
    ]);
    setSelectedEmotion(null);
  };

  const handleEmotionEdit = (definitionId: string) => {
    router.push({
      pathname: "/emotion-definition-form",
      params: { definitionId },
    });
    setSelectedDefinition(null);
  };

  const handleEmotionDelete = () => {
    if (!selectedDefinition) return;
    // Remove emotion if it was logged
    removeEmotionLog(selectedDefinition.id);
    // Archive the emotion definition
    dispatch(archiveEmotionDefinition(selectedDefinition.id));
    setShowConfirmDelete(false);
    setSelectedDefinition(null);
  };

  const renderFilter = () => {
    return (
      <SentimentFilter
        query={searchQuery}
        onSearch={setSearchQuery}
        selectedType={selectedType}
        onTypeChange={(type) => {
          setSelectedType(type);
        }}
        onPlusPress={() => {
          router.push({
            pathname: "/emotion-definition-form",
            params: { type: selectedType || undefined },
          });
        }}
        style={{ marginBottom: theme.layout.spacing.lg }}
        searchPlaceholder={t("emotions.search_emotion")}
      />
    );
  };

  const renderEmotionItem = ({ item }: { item: TEmotionDefinition }) => {
    const emotionLog = emotionLogsMap[item.id];
    const isSelected = Boolean(emotionLog);
    const color = emotionLog
      ? getSentimentColor(item.type, emotionLog.level, theme)
      : undefined;
    return (
      <SelectableIconButton
        title={item.name}
        customContent={
          <Typography style={{ fontSize: 24, lineHeight: 30 }}>
            {item.icon}
          </Typography>
        }
        isSelected={isSelected}
        level={emotionLog?.level}
        isArchived={item.isArchived}
        levelColor={color}
        onPress={() => handleEmotionPress(item, isSelected)}
        onLongPress={() => {
          setSelectedDefinition(item);
          setShowMenu(true);
        }}
        style={styles.emotionItem}
      />
    );
  };

  const renderList = () => {
    return (
      <FlatList
        numColumns={3}
        data={filteredDefinitions}
        contentContainerStyle={[styles.listContent]}
        ListEmptyComponent={
          <SelectableIconButton
            title={`${t("common:add")} "${searchQuery}"`}
            icon="plus"
            style={styles.emotionItem}
            onPress={() => {
              router.push({
                pathname: "/emotion-definition-form",
                params: {
                  prefillName: searchQuery,
                  type: selectedType || undefined,
                },
              });
            }}
          />
        }
        showsVerticalScrollIndicator={false}
        renderItem={renderEmotionItem}
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

  const renderSentimentSlider = () => {
    if (!selectedEmotion) return null;
    return (
      <SentimentSlider
        type={selectedEmotion.type}
        name={selectedEmotion.name}
        onClose={() => {
          setSelectedEmotion(null);
        }}
        onSave={handleSave}
      />
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
      {renderSentimentSlider()}
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
    emotionItem: {
      width: `${100 / 3}%`,
      paddingHorizontal: theme.layout.spacing.xs,
      paddingTop: theme.layout.spacing.md,
      paddingBottom: theme.layout.spacing.sm,
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
