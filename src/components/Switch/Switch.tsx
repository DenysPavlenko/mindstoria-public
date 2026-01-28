import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import React, { useEffect, useMemo } from "react";
import { StyleSheet } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { CustomPressable } from "../CustomPressable/CustomPressable";

interface SwitchProps {
  value: boolean;
  onChange: () => void;
}

export const Switch = ({ value, onChange }: SwitchProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // value for Switch Animation
  const switchTranslate = useSharedValue(0);
  const progress = useSharedValue(0);

  // useEffect for change the switchTranslate Value
  useEffect(() => {
    if (value) {
      switchTranslate.value = 22;
      progress.value = 1;
    } else {
      switchTranslate.value = 4;
      progress.value = 0;
    }
  }, [value, switchTranslate, progress]);

  // Circle Animation
  const customSpringStyles = useAnimatedStyle(() => {
    return {
      transform: [
        {
          translateX: withSpring(switchTranslate.value, {
            damping: 70,
            stiffness: 900,
          }),
        },
      ],
    };
  });

  return (
    <CustomPressable onPress={onChange}>
      <Animated.View
        style={[
          styles.container,
          {
            backgroundColor: value
              ? theme.colors.primary
              : theme.colors.surfaceVariant,
          },
        ]}
      >
        <Animated.View style={[styles.circle, customSpringStyles]} />
      </Animated.View>
    </CustomPressable>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      width: 50,
      height: 28,
      borderRadius: 28 / 2,
      justifyContent: "center",
    },
    circle: {
      width: 24,
      height: 24,
      borderRadius: 24 / 2,
      shadowColor: "black",
      backgroundColor: theme.colors.surface,
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 4,
    },
  });
