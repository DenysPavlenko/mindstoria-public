import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TBorderRadiusKey, TColorKey, TSizeKey } from "@/types";
import { Feather, FeatherIconName } from "@react-native-vector-icons/feather";
import React, { ReactNode } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export interface IconBoxProps {
  icon?: FeatherIconName;
  customIcon?: ReactNode;
  size?: TSizeKey | number;
  radius?: TBorderRadiusKey | number;
  variant?: "contained" | "text" | "outlined";
  edge?: ("start" | "end" | "top" | "bottom" | "vertical" | "horizontal")[];
  iconColor?: TColorKey;
  color?: TColorKey;
  iconScale?: number;
  accessibilityLabel?: string;
  autoSize?: boolean;
  style?: StyleProp<ViewStyle>;
}

const getColor = (theme: TTheme, color?: TColorKey) => {
  return color ? theme.colors[color] : undefined;
};

export const IconBox: React.FC<IconBoxProps> = ({
  icon,
  customIcon,
  size = "lg",
  variant = "contained",
  radius = "xxl",
  color = "surfaceVariant",
  iconColor,
  edge = [],
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
          iconColor: getColor(theme, iconColor || "onSurfaceVariant"),
          backgroundColor: getColor(theme, color),
          borderColor: "transparent",
        };
      case "outlined":
        return {
          iconColor: getColor(theme, iconColor || color),
          backgroundColor: "transparent",
          borderColor: getColor(theme, color),
        };
      case "text":
      default:
        return {
          iconColor: getColor(theme, iconColor || "onSurface"),
          backgroundColor: "transparent",
          borderColor: "transparent",
        };
    }
  };

  const colors = getColors();

  const edgeMargin = -(buttonSize - iconSize) / 2;
  // Expand 'vertical' and 'horizontal' into their respective directions
  const expandedEdges = edge.flatMap((e) => {
    if (e === "vertical") return ["top", "bottom"];
    if (e === "horizontal") return ["start", "end"];
    return [e];
  });
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
    marginLeft: expandedEdges.includes("start") ? edgeMargin : 0,
    marginRight: expandedEdges.includes("end") ? edgeMargin : 0,
    marginTop: expandedEdges.includes("top") ? edgeMargin : 0,
    marginBottom: expandedEdges.includes("bottom") ? edgeMargin : 0,
    borderWidth: 1,
  };

  const renderIcon = () => {
    if (customIcon) return customIcon;
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
