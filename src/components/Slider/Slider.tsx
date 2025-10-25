import { TTheme, useTheme } from "@/theme";
import { TColorKeys } from "@/types/common";
import { useCallback } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Slider as RNSlider } from "react-native-awesome-slider";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";

export interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  bgColor?: TColorKeys;
  customBgColor?: string;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  disabled = false,
  bgColor = "primary",
  customBgColor,
  style,
}) => {
  const { theme } = useTheme();

  const styles = createStyles(theme);

  const progress = useSharedValue(0);
  const minVal = useSharedValue(min);
  const maxVal = useSharedValue(max);
  const isScrubbing = useSharedValue(false);

  useAnimatedReaction(
    () => {
      return value;
    },
    (data) => {
      if (data !== undefined && !isNaN(data) && !isScrubbing.value) {
        progress.value = data;
      }
    },
    [value]
  );

  const handleValueChange = useCallback(
    (val: number) => {
      onChange(Math.round(val));
    },
    [onChange]
  );

  return (
    <View style={[styles.wrapper, style]}>
      <RNSlider
        progress={progress}
        disable={disabled}
        minimumValue={minVal}
        maximumValue={maxVal}
        containerStyle={styles.container}
        isScrubbing={isScrubbing}
        theme={{
          disableMinTrackTintColor: theme.colors.primaryContainer,
          maximumTrackTintColor: theme.colors.primaryContainer,
          minimumTrackTintColor: customBgColor || theme.colors[bgColor],
        }}
        steps={max - min}
        renderThumb={() => {
          return (
            <View
              style={{
                width: theme.layout.size.sm,
                height: theme.layout.size.sm,
                borderRadius: theme.layout.size.sm / 2,
                backgroundColor:
                  theme.mode === "dark"
                    ? theme.colors.primary
                    : theme.colors.surface,
                shadowColor: theme.colors.shadow, // Black shadow color
                shadowOffset: { width: 0, height: 0 }, // 2pt vertical offset
                shadowOpacity: 0.25, // 25% opaque
                shadowRadius: 6, // 6pt blur radius
                elevation: 2, // Android shadow
              }}
            />
          );
        }}
        renderBubble={() => null}
        hapticMode="both"
        renderMark={() => null}
        forceSnapToStep
        onValueChange={handleValueChange}
        sliderHeight={theme.layout.size.xxs}
        thumbWidth={theme.layout.size.sm}
      />
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    wrapper: {
      height: theme.layout.size.sm,
    },
    container: {
      borderRadius: theme.layout.borderRadius.sm,
    },
  });

export default Slider;
