import { Placeholder, SentimentIconButton, SentimentList } from "@/components";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import {
  TSentimentSearchResult,
  useSentimentSearch,
} from "../hooks/useSentimentSearch";

interface SearchResultsProps {
  query: string;
  selectedMap: Record<string, boolean>;
  onPress: (item: TSentimentSearchResult) => void;
  paddingBottom: number;
}

export const SearchResults = ({
  query,
  selectedMap,
  onPress,
  paddingBottom,
}: SearchResultsProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const results = useSentimentSearch(query);

  return (
    <View
      style={[
        styles.container,
        { paddingBottom: paddingBottom + theme.layout.spacing.lg },
      ]}
    >
      <SentimentList
        data={results}
        ListEmptyComponent={
          <View style={styles.placeholder}>
            <Placeholder hideIcon content={t("common.no_data")} />
          </View>
        }
        renderItem={({ item }) => {
          const typedItem = item as TSentimentSearchResult;
          return (
            <SentimentIconButton
              key={typedItem.id}
              sentimentType={typedItem.sentimentType}
              icon={typedItem.icon}
              isArchived={typedItem.isArchived}
              title={typedItem.name}
              onPress={() => onPress(typedItem)}
              isSelected={!!selectedMap[typedItem.id]}
            />
          );
        }}
        keyboardShouldPersistTaps="handled"
      />
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      top: 85,
      bottom: 0,
      left: 0,
      right: 0,
      zIndex: 10,
      backgroundColor: theme.colors.surface,
    },
    placeholder: {
      paddingVertical: theme.layout.spacing.lg,
    },
  });
