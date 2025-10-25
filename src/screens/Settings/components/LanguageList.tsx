import { Typography } from "@/components";
import { TOUCHABLE_ACTIVE_OPACITY, TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

export type TLanguageListItem = {
  code: string;
  label: string;
};

interface LanguageListProps {
  languages: TLanguageListItem[];
  onSelect: (code: string) => void;
}

export const LanguageList = ({ languages, onSelect }: LanguageListProps) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return languages.map((lang, index) => {
    const isLastItem = index === languages.length - 1;
    return (
      <TouchableOpacity
        key={lang.code}
        style={[styles.item, isLastItem && styles.itemLast]}
        onPress={() => onSelect(lang.code)}
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      >
        <Typography variant="body" style={styles.title}>
          {lang.label}
        </Typography>
      </TouchableOpacity>
    );
  });
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    item: {
      paddingHorizontal: theme.layout.spacing.lg,
      paddingVertical: theme.layout.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
    itemLast: {
      borderBottomWidth: 0,
    },
    title: {
      flex: 1,
    },
    icon: {
      width: theme.layout.size.sm,
      height: theme.layout.size.sm,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.layout.size.sm / 2,
      overflow: "hidden",
      marginRight: theme.layout.spacing.md,
    },
  });
