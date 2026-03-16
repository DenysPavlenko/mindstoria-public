import Smiley1 from "@/assets/icons/smiley-1.svg";
import Smiley2 from "@/assets/icons/smiley-2.svg";
import Smiley3 from "@/assets/icons/smiley-3.svg";
import Smiley4 from "@/assets/icons/smiley-4.svg";
import Smiley5 from "@/assets/icons/smiley-5.svg";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { RatingLevel, TSizeKey } from "@/types";
import { getRatingLevelColor } from "@/utils";
import { FC, useMemo } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  withTiming,
} from "react-native-reanimated";
import { SvgProps } from "react-native-svg";

export const WELLBEING_ICONS: Record<RatingLevel, FC<SvgProps>> = {
  1: Smiley1,
  2: Smiley2,
  3: Smiley3,
  4: Smiley4,
  5: Smiley5,
};

interface MoodIconProps {
  level: RatingLevel;
  size?: TSizeKey | number;
  style?: StyleProp<ViewStyle>;
  isSelected?: boolean;
}

export const MoodIcon = ({
  level,
  size = "lg",
  style,
  isSelected,
}: MoodIconProps) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  let color = getRatingLevelColor(level, theme);
  let iconColor = theme.colors.surface;
  if (isSelected === false) {
    color = theme.colors.surfaceVariant;
    iconColor = theme.colors.onSurfaceVariant;
  }

  const Icon = WELLBEING_ICONS[level];
  const iconSize = typeof size === "number" ? size : theme.layout.size[size];

  const animatedStyle = useAnimatedStyle(() => {
    return {
      backgroundColor: withTiming(color, {
        duration: 200,
        easing: Easing.inOut(Easing.quad),
      }),
    };
  });

  if (!Icon) return null;

  return (
    <Animated.View
      style={[
        animatedStyle,
        {
          width: iconSize,
          height: iconSize,
          borderRadius: iconSize / 2,
        },
        styles.icon,
        style,
      ]}
    >
      <Icon width={iconSize * 0.9} height={iconSize * 0.9} fill={iconColor} />
    </Animated.View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    icon: {
      justifyContent: "center",
      alignItems: "center",
    },
  });
