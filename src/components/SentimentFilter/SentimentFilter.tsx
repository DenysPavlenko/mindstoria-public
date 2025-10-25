import { TTheme, useTheme } from "@/theme";
import { TSentimentType } from "@/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { IconButton } from "../IconButton/IconButton";
import { SearchInput } from "../SearchInput/SearchInput";
import { SwitchSelector } from "../SwitchSelector/SwitchSelector";

interface SentimentFilterProps {
  query: string;
  selectedType: TSentimentType | null;
  onSearch: (query: string) => void;
  onTypeChange: (type: TSentimentType | null) => void;
  onPlusPress: () => void;
  style?: StyleProp<ViewStyle>;
  searchPlaceholder?: string;
}

export const SentimentFilter = ({
  query,
  selectedType,
  onSearch,
  onTypeChange,
  onPlusPress,
  style,
  searchPlaceholder,
}: SentimentFilterProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={style}>
      <View style={styles.filterInputContainer}>
        <SearchInput
          placeholder={searchPlaceholder}
          value={query}
          onChangeText={onSearch}
          style={styles.searchInput}
        />
        <IconButton
          icon="plus"
          backgroundColor="surfaceVariant"
          iconColor="onSurfaceVariant"
          size="md"
          onPress={onPlusPress}
        />
      </View>
      <SwitchSelector
        selectedValue={selectedType ?? "all"}
        options={[
          { value: "all", label: t("sentiments.all") },
          { value: "positive", label: t("sentiments.positive") },
          { value: "negative", label: t("sentiments.negative") },
        ]}
        onChange={(value) => {
          onTypeChange(value === "all" ? null : value);
        }}
      />
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    filterInputContainer: {
      flexDirection: "row",
      gap: theme.layout.spacing.sm,
      alignItems: "center",
      marginBottom: theme.layout.spacing.md,
    },
    searchInput: {
      flex: 1,
    },
  });
