import { TTheme, useTheme } from "@/theme";
import React, { useEffect, useMemo } from "react";
import { StyleSheet, TouchableWithoutFeedback, View } from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

interface SwitchProps {
  value: boolean;
  onChange: () => void;
}

export const Switch = ({ value, onChange }: SwitchProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  // value for Switch Animation
  const switchTranslate = useSharedValue(0);

  // useEffect for change the switchTranslate Value
  useEffect(() => {
    if (value) {
      switchTranslate.value = 22;
    } else {
      switchTranslate.value = 4;
    }
  }, [value, switchTranslate]);

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
    <TouchableWithoutFeedback onPress={onChange}>
      <View style={[styles.container]}>
        <Animated.View style={[styles.circle, customSpringStyles]} />
      </View>
    </TouchableWithoutFeedback>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      width: 50,
      height: 28,
      borderRadius: 28 / 2,
      justifyContent: "center",
      backgroundColor: theme.colors.primaryContainer,
    },
    circle: {
      width: 24,
      height: 24,
      borderRadius: 24 / 2,
      backgroundColor: theme.colors.onPrimaryContainer,
      shadowColor: "black",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.2,
      shadowRadius: 2.5,
      elevation: 4,
    },
  });
