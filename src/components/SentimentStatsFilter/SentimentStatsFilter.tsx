import { TTheme, useTheme } from "@/theme";
import { TSentimentType, TSortBy } from "@/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { IconButton } from "../IconButton/IconButton";
import { SearchInput } from "../SearchInput/SearchInput";
import { SwitchSelector } from "../SwitchSelector/SwitchSelector";

interface SentimentStatsFilterProps {
  query?: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  type: TSentimentType | null;
  onTypeChange: (type: TSentimentType | null) => void;
  sortBy: TSortBy;
  onSortPress?: () => void;
  style?: StyleProp<ViewStyle>;
  hideSearch?: boolean;
}

export const SentimentStatsFilter = ({
  type,
  onTypeChange,
  searchPlaceholder,
  sortBy,
  onSortPress,
  style,
  hideSearch = false,
  query,
  onSearch,
}: SentimentStatsFilterProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Create theme-aware styles (memoized for performance)
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderSearch = () => {
    if (hideSearch) return null;
    return (
      <SearchInput
        placeholder={searchPlaceholder}
        value={query}
        onChangeText={onSearch}
      />
    );
  };

  const renderSwitch = () => {
    return (
      <SwitchSelector
        selectedValue={type ?? "all"}
        options={[
          { value: "all", label: t("sentiments.all") },
          { value: "positive", label: t("sentiments.positive") },
          { value: "negative", label: t("sentiments.negative") },
        ]}
        onChange={(value) => {
          onTypeChange(value === "all" ? null : value);
        }}
      />
    );
  };

  return (
    <View style={[styles.filters, style]}>
      {renderSearch()}
      <View style={styles.bottomRow}>
        {renderSwitch()}
        <IconButton
          icon={sortBy === "count" ? "arrow-down" : "arrow-up"}
          size="md"
          backgroundColor="surface"
          iconColor="onSurface"
          onPress={onSortPress}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: TTheme) => {
  return StyleSheet.create({
    filters: {
      gap: theme.layout.spacing.sm,
    },
    bottomRow: {
      gap: theme.layout.spacing.sm,
      alignItems: "center",
      flexDirection: "row",
    },
    switchLabelContainer: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: theme.layout.spacing.xs,
    },
    switchIndicator: {
      height: 8,
      width: 8,
      borderRadius: 4,
    },
  });
};
