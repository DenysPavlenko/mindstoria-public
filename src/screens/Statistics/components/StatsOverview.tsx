import { StatCard } from "@/components";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface StatsOverviewProps {
  wellbeingCount: number;
  sleepCount: number;
  impactsCount: number;
  emotionsCount: number;
}

export const StatsOverview = ({
  wellbeingCount,
  sleepCount,
  impactsCount,
  emotionsCount,
}: StatsOverviewProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View style={styles.container}>
      <View style={styles.row}>
        <StatCard label={t("mood.title")} count={wellbeingCount} />
        <StatCard label={t("sleep.title")} count={sleepCount} />
      </View>
      <View style={styles.row}>
        <StatCard label={t("impacts.impact")} count={impactsCount} />
        <StatCard label={t("emotions.emotion")} count={emotionsCount} />
      </View>
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.layout.spacing.sm,
    },
    row: {
      width: "100%",
      flexWrap: "wrap",
      flexDirection: "row",
      gap: theme.layout.spacing.sm,
    },
  });
