import { useTheme } from "@/providers";
import { DISABLED_ALPHA, TOUCHABLE_ACTIVE_OPACITY, TTheme } from "@/theme";
import { TColorKey, TTypographyVariant } from "@/types/common";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import {
  CustomPressable,
  CustomPressableProps,
} from "../CustomPressable/CustomPressable";
import { Typography } from "../Typography/Typography";

type TButtonSize = "xs" | "sm" | "md" | "lg";

export interface ButtonProps extends CustomPressableProps {
  variant?: "contained" | "text" | "outlined";
  size?: TButtonSize;
  fullWidth?: boolean;
  color?: TColorKey;
  textColor?: TColorKey;
  autoSize?: boolean;
  isLoading?: boolean;
}

type TSizeConfig = {
  textVariant: TTypographyVariant;
  paddingHorizontal: number;
  minHeight: number;
};

const getSizeConfig = (theme: TTheme, size: TButtonSize): TSizeConfig => {
  const textVariants: Record<TButtonSize, TTypographyVariant> = {
    xs: "tinyBold",
    sm: "smallBold",
    md: "bodyBold",
    lg: "bodyBold",
  };
  return {
    textVariant: textVariants[size],
    paddingHorizontal: theme.layout.spacing[size],
    minHeight: theme.layout.size[size],
  };
};

export const Button = ({
  onPress,
  children,
  variant = "contained",
  fullWidth = false,
  disabled = false,
  color,
  textColor,
  autoSize,
  style,
  isLoading,
  size = "lg",
  ...restProps
}: ButtonProps) => {
  const { theme } = useTheme();

  // Create theme-aware styles (memoized for performance)
  const styles = useMemo(() => createStyles(theme), [theme]);

  let buttonTextColor: keyof TTheme["colors"] = textColor || "primary";
  let backgroundColor: string = "transparent";
  let borderColor: string = "transparent";

  switch (variant) {
    case "contained":
      buttonTextColor = textColor || "onPrimary";
      backgroundColor = theme.colors[color || "primary"];
      borderColor = "transparent";
      break;
    case "outlined":
      buttonTextColor = textColor || color || "primary";
      backgroundColor = "transparent";
      borderColor = theme.colors[color || "primary"];
      break;
    case "text":
      buttonTextColor = textColor || "onSurface";
      backgroundColor = "transparent";
      borderColor = "transparent";
      break;
    default:
      break;
  }

  // Get size config, fallback to lg
  const sizeConfig = getSizeConfig(theme, size);

  const buttonStyle: ViewStyle = {
    ...styles.button,
    backgroundColor,
    borderColor,
    borderWidth: 1,
    width: fullWidth ? "100%" : "auto",
    minHeight: sizeConfig.minHeight,
    paddingHorizontal: autoSize ? 0 : sizeConfig.paddingHorizontal,
    ...(disabled && { opacity: DISABLED_ALPHA }),
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <ActivityIndicator color={theme.colors[buttonTextColor]} size="small" />
      );
    }
    return (
      <Typography
        variant={sizeConfig.textVariant}
        numberOfLines={1}
        color={buttonTextColor}
      >
        {children}
      </Typography>
    );
  };

  return (
    <CustomPressable
      onPress={onPress}
      disabled={disabled}
      style={[buttonStyle, style]}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      {...restProps}
    >
      {renderContent()}
    </CustomPressable>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    button: {
      borderRadius: theme.layout.borderRadius.xl,
      alignItems: "center",
      justifyContent: "center",
    },
  });
