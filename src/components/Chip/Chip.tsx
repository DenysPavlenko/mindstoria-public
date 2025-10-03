import { TOUCHABLE_ACTIVE_OPACITY, TTheme, useTheme } from "@/theme";
import React, { useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Typography } from "../Typography/Typography";

interface ChipProps {
  label: string;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  testID?: string;
}

export const Chip = ({
  label,
  onPress,
  selected = false,
  disabled = false,
  style,
  textStyle,
  testID,
}: ChipProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const getVariantStyle = () => {
    const colorStyle: ViewStyle = {};
    if (selected) {
      colorStyle.backgroundColor = theme.colors.tertiary;
    }
    if (disabled) {
      colorStyle.opacity = 0.6;
    }
    return colorStyle;
  };

  const getTextColor = (): keyof TTheme["colors"] => {
    return selected ? "onTertiary" : "onTertiaryContainer";
  };

  return (
    <TouchableOpacity
      style={[styles.chip, getVariantStyle(), style]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      testID={testID}
    >
      <Typography color={getTextColor()} variant="smallBold" style={textStyle}>
        {label}
      </Typography>
    </TouchableOpacity>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    chip: {
      paddingHorizontal: theme.layout.spacing.lg,
      paddingVertical: theme.layout.spacing.xxs,
      minHeight: theme.layout.size.md,
      backgroundColor: theme.colors.tertiaryContainer,
      borderRadius: theme.layout.borderRadius.xl,
      alignSelf: "flex-start",
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default Chip;
