import { TTheme, useTheme } from "@/theme";
import { TColorKeys } from "@/types/common";
import { useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewStyle,
} from "react-native";

interface CardProps extends TouchableOpacityProps {
  children: React.ReactNode;
  style?: StyleProp<ViewStyle>;
  bgColor?: TColorKeys;
  padding?: keyof TTheme["layout"]["spacing"];
  onPress?: () => void;
  onLongPress?: () => void;
  noPadding?: boolean;
  noHorizontalPadding?: boolean;
  noVerticalPadding?: boolean;
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

  const Component = onPress || onLongPress ? TouchableOpacity : View;

  return (
    <Component
      style={StyleSheet.compose(
        [
          styles.card,
          getPaddingStyle(),
          { backgroundColor: theme.colors[bgColor] },
        ],
        style
      )}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={1}
      {...restProps}
    >
      {children}
    </Component>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      overflow: "hidden",
    },
    card: {
      borderRadius: theme.layout.borderRadius.xl,
    },
  });
