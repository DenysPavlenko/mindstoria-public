import {
  DISABLED_ALPHA,
  TOUCHABLE_ACTIVE_OPACITY,
  TTheme,
  useTheme,
} from "@/theme";
import { Feather, FeatherIconName } from "@react-native-vector-icons/feather";
import React from "react";
import {
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  ViewStyle,
} from "react-native";

export interface IconButtonProps extends TouchableOpacityProps {
  icon: FeatherIconName;
  size?: keyof TTheme["layout"]["size"] | number;
  variant?: "contained" | "outlined" | "text";
  iconColor?: keyof TTheme["colors"];
  backgroundColor?: keyof TTheme["colors"];
  borderColor?: keyof TTheme["colors"];
  disabled?: boolean;
  accessibilityLabel?: string;
  circular?: boolean;
  autoSize?: boolean;
}

const getColor = (theme: TTheme, color?: keyof TTheme["colors"]) => {
  return color ? theme.colors[color] : undefined;
};

export const IconButton: React.FC<IconButtonProps> = ({
  icon,
  size = "xl",
  variant = "contained",
  iconColor,
  backgroundColor,
  borderColor,
  disabled = false,
  style,
  accessibilityLabel,
  onPress,
  circular = true,
  autoSize = false,
  ...touchableProps
}) => {
  const { theme } = useTheme();

  const buttonSize = typeof size === "number" ? size : theme.layout.size[size];
  const iconSize = buttonSize * 0.5;

  // Handle colors based on variant
  const getColors = () => {
    switch (variant) {
      case "contained":
        return {
          iconColor: getColor(theme, iconColor || "onPrimary"),
          backgroundColor: getColor(theme, backgroundColor || "primary"),
          borderColor: "transparent",
        };
      case "outlined":
        return {
          iconColor: getColor(theme, iconColor || "primary"),
          borderColor: getColor(theme, borderColor || "primary"),
          backgroundColor: "transparent",
        };
      case "text":
      default:
        return {
          iconColor: getColor(theme, iconColor || "primary"),
          backgroundColor: "transparent",
          borderColor: "transparent",
        };
    }
  };

  const colors = getColors();

  const buttonStyle: ViewStyle = {
    ...styles.button,
    ...(autoSize
      ? {}
      : {
          width: buttonSize,
          height: buttonSize,
        }),
    borderRadius: circular ? buttonSize / 2 : theme.layout.borderRadius.lg,
    backgroundColor: colors.backgroundColor,
    borderColor: colors.borderColor,
    borderWidth: variant === "outlined" ? 2 : 0,
    opacity: disabled ? DISABLED_ALPHA : 1,
  };

  return (
    <TouchableOpacity
      style={[buttonStyle, style]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : TOUCHABLE_ACTIVE_OPACITY}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel || `${icon} button`}
      accessibilityState={{ disabled }}
      {...touchableProps}
    >
      <Feather name={icon} size={iconSize} color={colors.iconColor} />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export default IconButton;
