import { TOUCHABLE_ACTIVE_OPACITY } from "@/theme";
import React, { useEffect } from "react";
import { TouchableOpacity, View, ViewStyle } from "react-native";
import Animated, {
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

interface AnimatedStepProps {
  isActive: boolean;
  stepColor: string;
  height: number;
  radius: number;
  bgColor: string;
  onPress?: () => void;
  animationDuration?: number;
}

export const AnimatedStep = ({
  isActive,
  stepColor,
  height,
  radius,
  bgColor,
  onPress,
  animationDuration = 100,
}: AnimatedStepProps) => {
  const progressValue = useSharedValue(isActive ? 1 : 0);

  // Animate when isActive changes
  useEffect(() => {
    const targetValue = isActive ? 1 : 0;
    progressValue.value = withTiming(targetValue, {
      duration: animationDuration,
    });
  }, [isActive, animationDuration, progressValue]);
  const animatedStyle = useAnimatedStyle(() => {
    const width = interpolate(progressValue.value, [0, 1], [0, 100]);
    return {
      width: `${width}%`,
    };
  });

  const containerStyle: ViewStyle = {
    height: height,
    borderRadius: radius,
    backgroundColor: bgColor,
    overflow: "hidden",
    flex: 1,
    minWidth: 8,
  };

  const animatedStepStyle: ViewStyle = {
    backgroundColor: stepColor,
    height: "100%",
  };

  if (onPress) {
    return (
      <TouchableOpacity
        style={containerStyle}
        onPress={onPress}
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      >
        <Animated.View style={[animatedStepStyle, animatedStyle]} />
      </TouchableOpacity>
    );
  }

  return (
    <View style={containerStyle}>
      <Animated.View style={[animatedStepStyle, animatedStyle]} />
    </View>
  );
};
