import { TTheme, useTheme } from "@/theme";
import { TColorKeys } from "@/types/common";
import React, { ReactNode, useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { CustomPressable } from "../CustomPressable/CustomPressable";
import { Typography } from "../Typography/Typography";

interface Option<T extends string | number> {
  value: T;
  label: ReactNode;
}
interface SwitchSelectorProps<T extends string | number> {
  options: Option<T>[];
  selectedValue: T | null;
  onChange: (value: T) => void;
  style?: StyleProp<ViewStyle>;
  bgColor?: TColorKeys;
  selectedBgColor?: TColorKeys;
}

export function SwitchSelector<T extends string | number>({
  options,
  selectedValue,
  onChange,
  bgColor = "surfaceVariant",
  selectedBgColor = "surface",
  style,
}: SwitchSelectorProps<T>) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors[bgColor] },
        style,
      ]}
    >
      {options.map((option) => {
        const isSelected = option.value === selectedValue;
        return (
          <CustomPressable
            key={option.value}
            onPress={() => onChange(option.value)}
            style={[
              styles.option,
              isSelected && [
                { backgroundColor: theme.colors[selectedBgColor] },
              ],
            ]}
            withHaptics={false}
          >
            <Typography
              variant="smallBold"
              color={isSelected ? "onSurface" : "onSurfaceVariant"}
              numberOfLines={1}
            >
              {option.label}
            </Typography>
          </CustomPressable>
        );
      })}
    </View>
  );
}

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
      flexDirection: "row",
      borderRadius: theme.layout.borderRadius.xl,
      padding: theme.layout.spacing.xs,
      height: theme.layout.size.lg,
    },
    option: {
      flex: 1,
      paddingHorizontal: theme.layout.spacing.md,
      borderRadius: theme.layout.borderRadius.xl,
      justifyContent: "center",
      alignItems: "center",
      minWidth: theme.layout.size.xxl,
    },
  });
