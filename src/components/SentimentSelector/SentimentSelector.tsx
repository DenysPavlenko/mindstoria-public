import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import {
  TSentimentDefinition,
  TSentimentLog,
  TSentimentSection,
  TSentimentType,
} from "@/types";
import { trackEvent } from "@/utils";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { Href, useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { Button } from "../Button/Button";
import { ConfirmationDialog } from "../ConfirmationDialog/ConfirmationDialog";
import { IconBox } from "../IconBox/IconBox";
import { SafeView } from "../SafeView/SafeView";
import { SearchInput } from "../SearchInput/SearchInput";
import { SelectionGridCard } from "../SelectionGridCard/SelectionGridCard";
import { SlideInModal } from "../SlideInModal/SlideInModal";
import { Typography } from "../Typography/Typography";

interface SentimentSelectorConfig {
  sentimentType: TSentimentType;
  sections: TSentimentSection[];
  selectedLogs: TSentimentLog[];
  onAdd: (id: string) => void;
  onRemove: (id: string) => void;
  onArchive: (id: string) => void;
  routes: {
    definitionForm: Href;
  };
  translations: {
    searchPlaceholder: string;
    confirmDeleteContent: string;
  };
  analytics: {
    editStarted: string;
    createStarted: string;
    deleteConfirmed: string;
  };
  footer?: React.ReactNode;
  safeView?: boolean;
}

export function SentimentSelector({
  sentimentType,
  sections,
  selectedLogs,
  onAdd,
  onRemove,
  onArchive,
  routes,
  translations,
  analytics,
  footer,
  safeView = true,
}: SentimentSelectorConfig) {
  const { t, i18n } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedDefinition, setSelectedDefinition] =
    useState<TSentimentDefinition | null>(null);
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmDelete, setShowConfirmDelete] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const collator = useMemo(() => {
    return new Intl.Collator(i18n.language, { sensitivity: "base" });
  }, [i18n.language]);

  const selectedMap = useMemo(() => {
    const map: Record<string, boolean> = {};
    selectedLogs.forEach((item) => {
      map[item.definitionId] = true;
    });
    return map;
  }, [selectedLogs]);

  const translatedSections = useMemo((): TSentimentSection[] => {
    return sections.map((section) => {
      const translatedData = section.data
        .map((definition) => {
          return { ...definition, name: t(definition.name) };
        })
        .sort((a, b) => collator.compare(a.name, b.name));
      return {
        ...section,
        title: t(section.title),
        data: translatedData,
      };
    });
  }, [sections, t, collator]);

  const filteredSections = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    if (query === "") return translatedSections;
    return translatedSections
      .map((section) => {
        return {
          ...section,
          data: section.data.filter((def) =>
            def.name.toLowerCase().includes(query),
          ),
        };
      })
      .filter((section) => section.data.length > 0);
  }, [translatedSections, searchQuery]);

  const handlePress = (item: TSentimentDefinition, isSelected: boolean) => {
    if (isSelected) {
      onRemove(item.id);
    } else {
      onAdd(item.id);
    }
  };

  const handleEdit = (definitionId: string) => {
    router.navigate({
      pathname: routes.definitionForm,
      params: { definitionId },
    } as Href);
    setSelectedDefinition(null);
    trackEvent(analytics.editStarted);
  };

  const handleDelete = () => {
    if (!selectedDefinition) return;
    onRemove(selectedDefinition.id);
    onArchive(selectedDefinition.id);
    setShowConfirmDelete(false);
    setSelectedDefinition(null);
    trackEvent(analytics.deleteConfirmed, {
      name: selectedDefinition.name,
    });
  };

  const renderMenuModal = () => {
    if (!showMenu || !selectedDefinition) return null;
    const iconProp =
      sentimentType === "emotion"
        ? {
            customIcon: (
              <Typography style={{ fontSize: 16, lineHeight: 24 }}>
                {selectedDefinition.icon}
              </Typography>
            ),
          }
        : { icon: selectedDefinition.icon as FeatherIconName };
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
            <IconBox {...iconProp} size="md" />
            <Typography variant="h3">{selectedDefinition.name}</Typography>
          </View>
        }
      >
        <View style={styles.menuButtons}>
          <Button
            style={styles.menuButton}
            onPress={() => handleEdit(selectedDefinition.id)}
          >
            {t("common.edit")}
          </Button>
          <Button
            color="error"
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

  const renderGroup = ({ item }: { item: TSentimentSection }) => {
    return (
      <SelectionGridCard
        sentimentType={sentimentType}
        items={item.data}
        showAddButton
        onAddPress={() => {
          router.navigate({
            pathname: routes.definitionForm,
            params: { categoryId: item.id },
          } as Href);
          trackEvent(analytics.createStarted, { source: "cardAdd" });
        }}
        selectedMap={selectedMap}
        onItemPress={handlePress}
        onItemLongPress={(definition) => {
          setSelectedDefinition(definition);
          setShowMenu(true);
        }}
        header={<Typography variant="h5">{item.title}</Typography>}
      />
    );
  };

  return (
    <SafeView direction={safeView ? "bottom" : "none"}>
      <View style={styles.container}>
        <SearchInput
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.filterContainer}
          placeholder={translations.searchPlaceholder}
        />
        <FlatList
          data={filteredSections}
          keyExtractor={(item) => item.id}
          renderItem={renderGroup}
          contentContainerStyle={styles.listContent}
          showsVerticalScrollIndicator={false}
        />
        {renderMenuModal()}
        {showConfirmDelete && selectedDefinition && (
          <ConfirmationDialog
            visible
            onConfirm={handleDelete}
            onClose={() => {
              setShowConfirmDelete(false);
              setSelectedDefinition(null);
            }}
            title={t("common.confirm_delete")}
            content={translations.confirmDeleteContent}
          />
        )}
      </View>
      {footer && <View style={styles.footer}>{footer}</View>}
    </SafeView>
  );
}

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.layout.spacing.lg,
      paddingTop: theme.layout.spacing.xs,
    },
    filterContainer: {
      marginBottom: theme.layout.spacing.lg,
    },
    listContent: {
      paddingBottom: theme.layout.spacing.lg,
      gap: theme.layout.spacing.lg,
    },
    emptyContainer: {
      paddingHorizontal: theme.layout.spacing.xs,
    },
    emptyButton: {
      width: "25%",
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
    footer: {
      padding: theme.layout.spacing.lg,
    },
  });
