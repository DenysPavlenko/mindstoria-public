import { TTheme, useTheme } from "@/theme";
import { useCallback } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Slider as RNSlider } from "react-native-awesome-slider";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";

interface SliderProps {
  value: number;
  onChange: (value: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const Slider: React.FC<SliderProps> = ({
  value,
  onChange,
  min,
  max,
  disabled = false,
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
    <RNSlider
      progress={progress}
      disable={disabled}
      minimumValue={minVal}
      maximumValue={maxVal}
      containerStyle={[style, styles.container]}
      isScrubbing={isScrubbing}
      theme={{
        disableMinTrackTintColor: theme.colors.primaryContainer,
        maximumTrackTintColor: theme.colors.primaryContainer,
        minimumTrackTintColor: theme.colors.primary,
      }}
      steps={max - min}
      renderBubble={() => null}
      renderMark={() => null}
      forceSnapToStep
      onValueChange={handleValueChange}
      sliderHeight={theme.layout.size.xxs}
      thumbWidth={theme.layout.size.sm}
    />
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.layout.borderRadius.sm,
    },
  });

export default Slider;
