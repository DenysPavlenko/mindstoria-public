import { useTheme } from "@/providers";
import { TOUCHABLE_ACTIVE_OPACITY, TTheme } from "@/theme";
import { TColorKeys, TSizeKeys } from "@/types";
import Feather, { FeatherIconName } from "@react-native-vector-icons/feather";
import React, { ReactNode, useMemo } from "react";
import { StyleProp, StyleSheet, TextStyle, ViewStyle } from "react-native";
import { CustomPressable } from "../CustomPressable/CustomPressable";
import { Typography } from "../Typography/Typography";

interface ChipProps {
  label: string | ReactNode;
  minHeight?: TSizeKeys | number;
  icon?: FeatherIconName;
  customContent?: ReactNode;
  onPress?: () => void;
  selected?: boolean;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  textStyle?: StyleProp<TextStyle>;
  iconStyle?: StyleProp<TextStyle>;
  bgColor?: TColorKeys;
  textColor?: TColorKeys;
  iconColor?: TColorKeys;
  selectedBgColor?: TColorKeys;
  testID?: string;
}

export const Chip = ({
  label,
  icon,
  customContent,
  onPress,
  selected = false,
  disabled = false,
  style,
  textStyle,
  testID,
  bgColor = "surfaceVariant",
  selectedBgColor = "primary",
  textColor = "onSurfaceVariant",
  iconColor = "primary",
  iconStyle,
  minHeight = "sm",
}: ChipProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const getVariantStyle = () => {
    const colorStyle: ViewStyle = {
      backgroundColor: theme.colors[bgColor],
    };
    if (selected) {
      colorStyle.backgroundColor = theme.colors[selectedBgColor];
    }
    if (disabled) {
      colorStyle.opacity = 0.6;
    }
    return colorStyle;
  };

  const chipMinHeight =
    typeof minHeight === "number" ? minHeight : theme.layout.size[minHeight];

  const renderLabel = () => {
    if (typeof label === "string") {
      return (
        <Typography
          color={selected ? "onPrimary" : textColor}
          variant="smallBold"
          style={textStyle}
        >
          {label}
        </Typography>
      );
    }
    return label;
  };

  const renderIcon = () => {
    if (customContent) return customContent;
    const color = selected ? theme.colors.onPrimary : theme.colors[iconColor];
    if (icon) {
      return (
        <Feather
          name={icon}
          size={theme.layout.size.xxs}
          color={color}
          style={iconStyle}
        />
      );
    }
    return null;
  };

  return (
    <CustomPressable
      style={[
        styles.chip,
        getVariantStyle(),
        { minHeight: chipMinHeight },
        style,
      ]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      testID={testID}
    >
      {renderIcon()}
      {renderLabel()}
    </CustomPressable>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    chip: {
      paddingHorizontal: theme.layout.spacing.md,
      borderRadius: theme.layout.borderRadius.xl,
      minWidth: theme.layout.size.xxl,
      justifyContent: "center",
      flexDirection: "row",
      alignItems: "center",
      gap: theme.layout.spacing.sm,
    },
  });
