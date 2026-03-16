import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import React, { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface DividerProps {
  style?: StyleProp<ViewStyle>;
}

export const Divider = ({ style }: DividerProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  return <View style={[styles.divider, style]} />;
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    divider: {
      width: "100%",
      height: 1,
      backgroundColor: theme.colors.surfaceVariant,
    },
  });
