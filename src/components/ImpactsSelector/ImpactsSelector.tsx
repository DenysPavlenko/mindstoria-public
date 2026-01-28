import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { useTranslatedImpactDefinitions } from "@/hooks";
import { useTheme } from "@/providers";
import { useAppDispatch } from "@/store";
import { archiveImpactDefinition } from "@/store/slices";
import { TTheme } from "@/theme";
import {
  RatingLevel,
  TImpactDefinition,
  TImpactLog,
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

interface ImpactsSelectorProps {
  impactLogItems: TImpactLog[];
  onChange: (items: TImpactLog[]) => void;
  wellbeing: RatingLevel | null;
}

export const ImpactsSelector = ({
  impactLogItems,
  onChange,
  wellbeing,
}: ImpactsSelectorProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const impactDefinitions = useTranslatedImpactDefinitions({ sorted: true });
  const [selectedType, setSelectedType] = useState<TSentimentType | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDefinition, setSelectedDefinition] =
    useState<TImpactDefinition | null>(null);
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

  const impactLogsMap = useMemo(() => {
    return impactLogItems.reduce(
      (acc, item) => {
        acc[item.definitionId] = item;
        return acc;
      },
      {} as Record<string, TImpactLog>,
    );
  }, [impactLogItems]);

  // Filter impact definitions based on search and type
  const filteredDefinitions = useMemo(() => {
    return impactDefinitions
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
        if (def.isArchived && impactLogsMap[def.id]) return true;
        // Otherwise filter out archived items
        return !def.isArchived;
      });
  }, [impactDefinitions, selectedType, searchQuery, impactLogsMap]);

  const removeImpactLog = (defId: string) => {
    onChange(impactLogItems.filter((impact) => impact.definitionId !== defId));
  };

  const addImpactLog = (defId: string) => {
    const newLog: TImpactLog = { id: generateUniqueId(), definitionId: defId };
    onChange([...impactLogItems, newLog]);
  };

  const handleImpactPress = (item: TImpactDefinition, isSelected: boolean) => {
    if (isSelected) {
      removeImpactLog(item.id);
    } else {
      addImpactLog(item.id);
    }
  };

  const handleImpactEdit = (definitionId: string) => {
    router.navigate({
      pathname: "/impact-definition-form",
      params: { definitionId },
    });
    setSelectedDefinition(null);
    trackEvent(ANALYTICS_EVENTS.IMPACT_EDIT_STARTED);
  };

  const handleImpactDelete = () => {
    if (!selectedDefinition) return;
    // Remove impact log if it was logged
    removeImpactLog(selectedDefinition.id);
    // Archive the impact definition
    dispatch(archiveImpactDefinition(selectedDefinition.id));
    setShowConfirmDelete(false);
    setSelectedDefinition(null);
    trackEvent(ANALYTICS_EVENTS.IMPACT_DELETE_CONFIRMED, {
      name: selectedDefinition.name,
    });
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
          router.navigate({
            pathname: "/impact-definition-form",
            params: { type: selectedType || undefined },
          });
          trackEvent(ANALYTICS_EVENTS.IMPACT_CREATE_STARTED, {
            source: "addButton",
          });
        }}
        style={styles.filterContainer}
        searchPlaceholder={t("impacts.search_impact")}
      />
    );
  };

  const renderItem = ({ item }: { item: TImpactDefinition }) => {
    const impactLog = impactLogsMap[item.id];
    const isSelected = Boolean(impactLog);
    return (
      <SentimentIconButton
        title={item.name}
        icon={item.icon}
        category="impact"
        isSelected={isSelected}
        isArchived={item.isArchived}
        onPress={() => handleImpactPress(item, isSelected)}
        onLongPress={() => {
          setSelectedDefinition(item);
          setShowMenu(true);
        }}
        type={item.type}
      />
    );
  };

  const renderList = () => {
    return (
      <SentimentList
        data={filteredDefinitions}
        renderItem={renderItem}
        searchQuery={searchQuery}
        onAddPress={() => {
          router.navigate({
            pathname: "/impact-definition-form",
            params: {
              prefillName: searchQuery,
              type: selectedType || undefined,
            },
          });
          trackEvent(ANALYTICS_EVENTS.IMPACT_CREATE_STARTED, {
            source: "impactSearch",
          });
        }}
        keyExtractor={(item) => item.id}
        style={styles.listContent}
      />
    );
  };

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Typography variant="h3" align="center">
          {t("impacts.whats_impacting_you")}
        </Typography>
        <Typography
          variant="small"
          color="outline"
          align="center"
          style={styles.headerSubtitle}
        >
          {t("impacts.select_one_or_more_impacts")}
        </Typography>
      </View>
    );
  };

  const renderImpactMenu = () => {
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
            <IconBox icon={selectedDefinition.icon} size="md" />
            <Typography variant="h3">{selectedDefinition.name}</Typography>
          </View>
        }
      >
        <View style={styles.menuButtons}>
          <Button
            style={styles.menuButton}
            onPress={() => handleImpactEdit(selectedDefinition.id)}
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
        onConfirm={handleImpactDelete}
        onClose={() => {
          setShowConfirmDelete(false);
          setSelectedDefinition(null);
        }}
        title={t("common.confirm_delete")}
        content={t("impacts.confirm_delete")}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      {renderFilter()}
      {renderList()}
      {renderImpactMenu()}
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
    filterContainer: {
      marginBottom: theme.layout.spacing.lg,
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
