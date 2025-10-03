import {
  DISABLED_ALPHA,
  TOUCHABLE_ACTIVE_OPACITY,
  TTheme,
  useTheme,
} from "@/theme";
import { useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  ViewStyle,
} from "react-native";
import { Typography } from "../Typography/Typography";

interface ButtonProps {
  children: React.ReactNode;
  onPress?: () => void;
  variant?: "contained" | "text" | "outlined";
  disabled?: boolean;
  fullWidth?: boolean;
  buttonColor?: keyof TTheme["colors"];
  textColor?: keyof TTheme["colors"];
  style?: StyleProp<ViewStyle>;
}

export const Button = ({
  onPress,
  children,
  variant = "contained",
  fullWidth = false,
  disabled = false,
  buttonColor,
  textColor,
  style,
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
      borderColor = theme.colors[buttonColor || "primary"];
      break;
    case "outlined":
      buttonTextColor = textColor || "onPrimary";
      borderColor = theme.colors[buttonColor || "primary"];
      break;
    case "text":
    default:
      break;
  }

  const buttonStyle: ViewStyle = {
    ...styles.button,
    backgroundColor,
    borderColor,
    width: fullWidth ? "100%" : "auto",
    ...(disabled && { opacity: DISABLED_ALPHA }),
  };

  return (
    <TouchableOpacity
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      style={[buttonStyle, style]}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
    >
      <Typography
        variant="buttonText"
        numberOfLines={1}
        color={buttonTextColor}
      >
        {children}
      </Typography>
    </TouchableOpacity>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    button: {
      borderWidth: 1,
      minHeight: theme.layout.size.md,
      borderRadius: theme.layout.borderRadius.xl,
      paddingVertical: theme.layout.spacing.sm,
      alignItems: "center",
      justifyContent: "center",
      paddingHorizontal: theme.layout.spacing.lg,
    },
  });

export default Button;
