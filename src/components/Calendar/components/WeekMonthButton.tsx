import { TOUCHABLE_ACTIVE_OPACITY, TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Typography } from "../../Typography/Typography";

interface WeekMonthButtonProps {
  isWeekView: boolean;
  onPress: () => void;
}

export const WeekMonthButton = ({
  isWeekView,
  onPress,
}: WeekMonthButtonProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      onPress={onPress}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
    >
      <View style={styles.button}>
        <Typography variant="tinyBold">
          {isWeekView ? t("date.week") : t("date.month")}
        </Typography>
      </View>
    </TouchableOpacity>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    button: {
      alignItems: "center",
      paddingVertical: theme.layout.spacing.sm,
      paddingHorizontal: theme.layout.spacing.md,
      borderWidth: 1,
      borderColor: theme.colors.onBackground,
      borderRadius: theme.layout.borderRadius.xxl,
    },
  });
