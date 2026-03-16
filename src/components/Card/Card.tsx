import { useTheme } from "@/providers";
import { DISABLED_ALPHA, TTheme } from "@/theme";
import { TColorKey } from "@/types/common";
import { useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";
import { CustomPressable } from "../CustomPressable/CustomPressable";

export interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bgColor?: TColorKey;
  borderColor?: TColorKey;
  padding?: keyof TTheme["layout"]["spacing"];
  variant?: "contained" | "outlined";
  onPress?: () => void;
  onLongPress?: () => void;
  noPadding?: boolean;
  noHorizontalPadding?: boolean;
  noVerticalPadding?: boolean;
  withHaptics?: boolean;
}

export const Card = ({
  children,
  onPress,
  onLongPress,
  style,
  padding = "lg",
  noPadding = false,
  noHorizontalPadding = false,
  noVerticalPadding = false,
  bgColor = "surfaceContainer",
  borderColor = "surfaceContainer",
  withHaptics = false,
  variant = "contained",
  disabled,
  ...restProps
}: CardProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const getPaddingStyle = () => {
    if (noPadding) {
      return { padding: 0 };
    }
    const basePadding = theme.layout.spacing[padding];
    const paddingHorizontal = noHorizontalPadding ? 0 : basePadding;
    const paddingVertical = noVerticalPadding ? 0 : basePadding;
    return {
      paddingHorizontal,
      paddingVertical,
    };
  };

  const getColorStyle = () => {
    switch (variant) {
      case "outlined":
        return {
          backgroundColor: "transparent",
          borderColor: theme.colors[borderColor],
          borderWidth: 1,
        };
      case "contained":
      default:
        return {
          backgroundColor: theme.colors[bgColor],
        };
    }
  };

  const Component = onPress || onLongPress ? CustomPressable : View;

  return (
    <Component
      style={[
        styles.card,
        getPaddingStyle(),
        getColorStyle(),
        { opacity: disabled ? DISABLED_ALPHA : 1 },
        style,
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={1}
      withHaptics={withHaptics}
      {...restProps}
    >
      {children}
    </Component>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    card: {
      borderRadius: theme.layout.borderRadius.xl,
    },
  });
