import { useTheme } from "@/providers";
import { TColorKeys } from "@/types/common";
import React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { AnimatedStep } from "./components/AnimatedStep";

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
    <View style={[styles.container, { gap: stepSpacing }, style]}>
      {steps.map((step) => {
        const isActive = step <= currentStep;
        return (
          <AnimatedStep
            key={step}
            isActive={isActive}
            stepColor={stepColor}
            height={height}
            radius={radius}
            bgColor={bgColor}
            onPress={onStepPress ? () => onStepPress(step) : undefined}
          />
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
  },
});
