import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TBorderRadiusKeys, TColorKeys, TSizeKeys } from "@/types";
import { Feather, FeatherIconName } from "@react-native-vector-icons/feather";
import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export interface IconBoxProps {
  icon?: FeatherIconName;
  customContent?: ReactNode;
  size?: TSizeKeys | number;
  radius?: TBorderRadiusKeys | number;
  variant?: "contained" | "text";
  iconColor?: TColorKeys;
  backgroundColor?: TColorKeys;
  iconScale?: number;
  accessibilityLabel?: string;
  autoSize?: boolean;
  style?: StyleProp<ViewStyle>;
}

const getColor = (theme: TTheme, color?: TColorKeys) => {
  return color ? theme.colors[color] : undefined;
};

export const IconBox: React.FC<IconBoxProps> = ({
  icon,
  customContent,
  size = "lg",
  variant = "contained",
  radius = "xxl",
  backgroundColor = "surfaceVariant",
  iconColor = "onSurfaceVariant",
  iconScale = 0.45,
  style,
  autoSize = false,
}) => {
  const { theme } = useTheme();

  const buttonSize = typeof size === "number" ? size : theme.layout.size[size];
  const iconSize = buttonSize * iconScale;

  // Handle colors based on variant
  const getColors = () => {
    switch (variant) {
      case "contained":
        return {
          iconColor: getColor(theme, iconColor),
          backgroundColor: getColor(theme, backgroundColor),
          borderColor: "transparent",
        };
      case "text":
      default:
        return {
          iconColor: getColor(theme, iconColor),
          backgroundColor: "transparent",
          borderColor: "transparent",
        };
    }
  };

  const colors = getColors();

  const containerStyles: ViewStyle = {
    ...styles.button,
    ...(autoSize
      ? {}
      : {
          width: buttonSize,
          height: buttonSize,
        }),
    borderRadius:
      typeof radius === "number" ? radius : theme.layout.borderRadius[radius],
    backgroundColor: colors.backgroundColor,
    borderColor: colors.borderColor,
  };

  const renderIcon = () => {
    if (customContent) return customContent;
    if (icon) {
      return <Feather name={icon} size={iconSize} color={colors.iconColor} />;
    }
    return null;
  };

  return <View style={[containerStyles, style]}>{renderIcon()}</View>;
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});
