import { TOUCHABLE_ACTIVE_OPACITY, TTheme, useTheme } from "@/theme";
import { TColorKeys } from "@/types/common";
import { Feather, FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import {
  Platform,
  StyleProp,
  StyleSheet,
  UIManager,
  ViewStyle,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";
import { useSwipeableItemParams } from "react-native-swipeable-item";
import { CustomPressable } from "../CustomPressable/CustomPressable";

if (Platform.OS === "android") {
  UIManager.setLayoutAnimationEnabledExperimental &&
    UIManager.setLayoutAnimationEnabledExperimental(true);
}

interface UnderlayButtonProps {
  onPress?: () => void;
  backgroundColor: TColorKeys;
  iconColor: TColorKeys;
  position: "left" | "right";
  iconName: FeatherIconName;
  width: number;
  style?: StyleProp<ViewStyle>;
}

export const UnderlayButton = ({
  onPress,
  position,
  backgroundColor,
  iconColor,
  width,
  iconName,
  style,
}: UnderlayButtonProps) => {
  const { theme } = useTheme();
  const { percentOpen } = useSwipeableItemParams();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const animStyle = useAnimatedStyle(
    () => ({
      opacity: percentOpen.value,
    }),
    [percentOpen]
  );

  return (
    <Animated.View
      style={[
        animStyle,
        styles.animatedView,
        position === "left" ? styles.left : styles.right,
        { backgroundColor: theme.colors[backgroundColor] },
        style,
      ]}
    >
      <CustomPressable
        style={[styles.actionButton, { width }]}
        onPress={onPress}
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      >
        <Feather name={iconName} size={24} color={theme.colors[iconColor]} />
      </CustomPressable>
    </Animated.View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    animatedView: {
      flexDirection: "row",
      flex: 1,
      alignItems: "center",
      borderRadius: theme.layout.borderRadius.xl,
    },
    left: {
      justifyContent: "flex-start",
    },
    right: {
      justifyContent: "flex-end",
    },
    actionButton: {
      height: "100%",
      justifyContent: "center",
      alignItems: "center",
    },
  });

export default UnderlayButton;
