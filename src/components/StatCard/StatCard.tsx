import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Card } from "../Card/Card";
import { Typography } from "../Typography/Typography";

export const StatCard = ({
  label,
  count,
  style,
}: {
  label: string;
  count: number;
  style?: StyleProp<ViewStyle>;
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Card style={[styles.card, style]}>
      <Typography variant="h3">{count}</Typography>
      <Typography variant="bodySemibold">
        {label} {t("common.log", { count }).toLowerCase()}
      </Typography>
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    card: {
      flex: 1,
      gap: theme.layout.spacing.sm,
    },
  });
