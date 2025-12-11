import { useTheme } from "@/theme";
import { TColorKeys } from "@/types/common";
import React, { useEffect, useRef } from "react";
import { Animated, StyleProp, StyleSheet, View, ViewStyle } from "react-native";

export interface ProgressProps {
  progress: number;
  height?: number;
  color?: TColorKeys;
  backgroundColor?: TColorKeys;
  borderRadius?: number;
  animationDuration?: number;
  style?: StyleProp<ViewStyle>;
  progressStyle?: StyleProp<ViewStyle>;
  animated?: boolean;
}

export const ProgressBar = ({
  progress,
  height = 8,
  color,
  backgroundColor,
  borderRadius,
  animationDuration = 300,
  style,
  progressStyle,
  animated = true,
}: ProgressProps) => {
  const { theme } = useTheme();
  const animatedWidth = useRef(new Animated.Value(0)).current;

  // Clamp progress between 0 and 1
  const clampedProgress = Math.max(0, Math.min(1, progress));

  // Default colors from theme
  const progressColor = color ? theme.colors[color] : theme.colors.primary;
  const bgColor = backgroundColor
    ? theme.colors[backgroundColor]
    : theme.colors.primaryContainer;
  const radius = borderRadius ?? height / 2;

  useEffect(() => {
    if (animated) {
      Animated.timing(animatedWidth, {
        toValue: clampedProgress,
        duration: animationDuration,
        useNativeDriver: false,
      }).start();
    } else {
      animatedWidth.setValue(clampedProgress);
    }
  }, [clampedProgress, animationDuration, animated, animatedWidth]);

  const containerStyle = [
    styles.container,
    {
      height: height,
      backgroundColor: bgColor,
      borderRadius: radius,
    },
    style,
  ];

  const barStyle = [
    styles.progress,
    {
      height: height,
      backgroundColor: progressColor,
      borderRadius: radius,
    },
    progressStyle,
  ];

  return (
    <View style={containerStyle}>
      <Animated.View
        style={[
          barStyle,
          {
            width: animatedWidth.interpolate({
              inputRange: [0, 1],
              outputRange: ["0%", "100%"],
              extrapolate: "clamp",
            }),
          },
        ]}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    overflow: "hidden",
  },
  progress: {
    position: "absolute",
    left: 0,
    top: 0,
  },
});
