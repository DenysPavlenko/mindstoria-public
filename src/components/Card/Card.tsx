import { TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";

interface CardProps extends Omit<ViewProps, "style"> {
  children: React.ReactNode;
  cardStyle?: StyleProp<ViewStyle>;
  containerStyle?: StyleProp<ViewStyle>;
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
  cardStyle,
  containerStyle,
  noPadding = false,
  noHorizontalPadding = false,
  noVerticalPadding = false,
}: CardProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const getPaddingStyle = () => {
    if (noPadding) {
      return { padding: 0 };
    }
    const basePadding = theme.layout.spacing.lg;
    const paddingHorizontal = noHorizontalPadding ? 0 : basePadding;
    const paddingVertical = noVerticalPadding ? 0 : basePadding;
    return {
      paddingHorizontal,
      paddingVertical,
    };
  };

  const cardContent = (
    <View style={[styles.card, getPaddingStyle(), cardStyle]}>{children}</View>
  );

  if (!onPress && !onLongPress) {
    return cardContent;
  }

  return (
    <Pressable
      style={[styles.container, containerStyle]}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      {cardContent}
    </Pressable>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      overflow: "hidden",
    },
    card: {
      backgroundColor: theme.colors.surfaceContainer,
      borderRadius: theme.layout.borderRadius.xl,
    },
  });

export default Card;
