import { DISABLED_ALPHA, TTheme, useTheme } from "@/theme";
import { TColorKeys } from "@/types/common";
import { useMemo } from "react";
import { ActivityIndicator, StyleSheet, ViewStyle } from "react-native";
import {
  CustomPressable,
  CustomPressableProps,
} from "../CustomPressable/CustomPressable";
import { Typography } from "../Typography/Typography";

export interface ButtonProps extends CustomPressableProps {
  variant?: "contained" | "text";
  fullWidth?: boolean;
  buttonColor?: TColorKeys;
  textColor?: TColorKeys;
  autoSize?: boolean;
  isLoading?: boolean;
}

export const Button = ({
  onPress,
  children,
  variant = "contained",
  fullWidth = false,
  disabled = false,
  buttonColor,
  textColor,
  autoSize,
  style,
  isLoading,
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
      backgroundColor = theme.colors[buttonColor || "primary"];
      break;
    case "text":
      buttonTextColor = textColor || "onSurface";
    default:
      break;
  }

  const buttonStyle: ViewStyle = {
    ...styles.button,
    backgroundColor,
    borderColor,
    width: fullWidth ? "100%" : "auto",
    minHeight: autoSize ? "auto" : theme.layout.size.lg,
    paddingVertical: autoSize ? 0 : theme.layout.spacing.sm,
    paddingHorizontal: autoSize ? 0 : theme.layout.spacing.lg,
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
        variant="buttonText"
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
