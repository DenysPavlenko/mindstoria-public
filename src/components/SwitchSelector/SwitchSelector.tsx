import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TColorKey } from "@/types/common";
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
  bgColor?: TColorKey;
  selectedBgColor?: TColorKey;
}

export function SwitchSelector<T extends string | number>({
  options,
  selectedValue,
  onChange,
  bgColor = "surfaceContainer",
  selectedBgColor = "secondaryContainer",
  style,
}: SwitchSelectorProps<T>) {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderLabel = (label: ReactNode) => {
    if (typeof label === "string" || typeof label === "number") {
      return <Typography variant="smallBold">{label}</Typography>;
    }
    return label;
  };

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
          >
            {renderLabel(option.label)}
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
    },
  });
