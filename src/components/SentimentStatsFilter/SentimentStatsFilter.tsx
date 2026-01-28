import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TSentimentType } from "@/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { SearchInput } from "../SearchInput/SearchInput";
import { SwitchSelector } from "../SwitchSelector/SwitchSelector";

interface SentimentStatsFilterProps {
  query?: string;
  onSearch?: (query: string) => void;
  searchPlaceholder?: string;
  type: TSentimentType | null;
  onTypeChange: (type: TSentimentType | null) => void;
  style?: StyleProp<ViewStyle>;
  hideSearch?: boolean;
}

export const SentimentStatsFilter = ({
  type,
  onTypeChange,
  searchPlaceholder,
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
      {renderSwitch()}
    </View>
  );
};

const createStyles = (theme: TTheme) => {
  return StyleSheet.create({
    filters: {
      gap: theme.layout.spacing.sm,
    },
  });
};
