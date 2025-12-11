import { TOUCHABLE_ACTIVE_OPACITY, useTheme } from "@/theme";
import { TColorKeys } from "@/types/common";
import React from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";

export interface StepIndicatorProps {
  currentStep: number;
  totalSteps: number;
  color?: TColorKeys;
  backgroundColor?: TColorKeys;
  height?: number;
  stepSpacing?: number;
  borderRadius?: number;
  onStepPress?: (step: number) => void;
  style?: StyleProp<ViewStyle>;
}

export const StepIndicator = ({
  currentStep,
  totalSteps,
  color,
  backgroundColor,
  height = 8,
  stepSpacing = 4,
  borderRadius,
  onStepPress,
  style,
}: StepIndicatorProps) => {
  const { theme } = useTheme();

  // Default colors from theme - same as ProgressBar
  const stepColor = color ? theme.colors[color] : theme.colors.primary;
  const bgColor = backgroundColor
    ? theme.colors[backgroundColor]
    : theme.colors.primaryContainer;
  const radius = borderRadius ?? height / 2;

  // Generate array of steps
  const steps = Array.from({ length: totalSteps }, (_, index) => index + 1);

  return (
    <View style={[styles.container, style]}>
      {steps.map((step, index) => {
        const isActive = step <= currentStep;
        const isLastStep = index === totalSteps - 1;

        const stepStyle = [
          styles.step,
          {
            height: height,
            backgroundColor: isActive ? stepColor : bgColor,
            borderRadius: radius,
            marginRight: isLastStep ? 0 : stepSpacing,
          },
        ];

        if (onStepPress) {
          return (
            <TouchableOpacity
              key={step}
              style={stepStyle}
              onPress={() => onStepPress(step)}
              activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
            />
          );
        }

        return <View key={step} style={stepStyle} />;
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
  step: {
    flex: 1,
    minWidth: 8,
  },
});
