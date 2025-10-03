import { Typography } from "@/components";
import { TOUCHABLE_ACTIVE_OPACITY, TTheme, useTheme } from "@/theme";
import { Feather, FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";

type TBackupListItem = {
  label: string;
  icon: FeatherIconName;
};

interface BackupListProps {}

export const BackupList = ({}: BackupListProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const listData: TBackupListItem[] = [
    { label: t("settings.import_data"), icon: "download" },
    { label: t("settings.export_data"), icon: "upload" },
  ];

  return listData.map((lang, index) => {
    const Icon = lang.icon;
    const isLastItem = index === listData.length - 1;
    return (
      <TouchableOpacity
        key={lang.label}
        style={[styles.item, isLastItem && styles.itemLast]}
        // onPress={() => onSelect(lang.label)}
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      >
        <View style={styles.icon}>
          <Feather name={Icon} size={24} color={theme.colors.onSurface} />
        </View>
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
