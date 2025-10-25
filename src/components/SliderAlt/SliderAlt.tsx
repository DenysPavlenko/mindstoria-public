import { TTheme, useTheme } from "@/theme";
import { TColorKeys } from "@/types/common";
import { useCallback, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Slider as RNSlider } from "react-native-awesome-slider";
import { useAnimatedReaction, useSharedValue } from "react-native-reanimated";
import { Typography } from "../Typography/Typography";

export interface SliderAltProps {
  value: number | null;
  onChange: (value: number) => void;
  min: number;
  max: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
  containerColor?: TColorKeys;
  thumbColor?: TColorKeys;
  customThumbColor?: string;
  activeMarkColor?: TColorKeys;
}

export const SliderAlt: React.FC<SliderAltProps> = ({
  value,
  onChange,
  min,
  max,
  disabled = false,
  containerColor = "surfaceVariant",
  thumbColor = "surface",
  activeMarkColor = "onSurfaceVariant",
  customThumbColor,
  style,
}) => {
  const { theme } = useTheme();
  const [containerWidth, setContainerWidth] = useState(370);

  const styles = createStyles(theme);

  const progress = useSharedValue(0);
  const minVal = useSharedValue(min);
  const maxVal = useSharedValue(max);
  const isScrubbing = useSharedValue(false);

  useAnimatedReaction(
    () => {
      return value;
    },
    (val) => {
      if (val !== null && !isNaN(val) && !isScrubbing.value) {
        progress.value = val;
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

  const numberOfSteps = max - min + 1;
  const stepsArr = Array.from({ length: numberOfSteps }, (_, i) => i + min);
  const containerHeight = theme.layout.size.lg;
  const thumbWidth = containerWidth / numberOfSteps;
  const thumbHeight = containerHeight;
  const thumbRadius = thumbWidth / 2;

  const renderContainer = () => {
    return (
      <View
        onLayout={(event) => {
          setContainerWidth(event.nativeEvent.layout.width);
        }}
        style={[
          styles.container,
          {
            backgroundColor: theme.colors[containerColor],
            height: containerHeight,
          },
        ]}
      >
        {stepsArr.map((step) => {
          const isActive = value === step;
          return (
            <Typography
              color={isActive ? activeMarkColor : "onSurface"}
              variant="smallBold"
              style={{ zIndex: 1 }}
              key={step}
            >
              {step}
            </Typography>
          );
        })}
      </View>
    );
  };

  const renderThumb = () => {
    if (value === null) return null;
    return (
      <View style={[styles.thumb, { width: thumbWidth, height: thumbHeight }]}>
        <View
          style={[
            styles.thumbInner,
            {
              borderRadius: thumbRadius,
              backgroundColor: customThumbColor
                ? customThumbColor
                : theme.colors[thumbColor],
            },
          ]}
        />
      </View>
    );
  };

  return (
    <View style={[style, { height: containerHeight }]}>
      <RNSlider
        progress={progress}
        disable={disabled}
        minimumValue={minVal}
        maximumValue={maxVal}
        isScrubbing={isScrubbing}
        steps={max - min}
        renderContainer={renderContainer}
        renderThumb={renderThumb}
        renderBubble={() => null}
        hapticMode="both"
        renderMark={() => null}
        forceSnapToStep
        onValueChange={handleValueChange}
        sliderHeight={containerHeight}
        thumbWidth={thumbWidth}
      />
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.layout.borderRadius.xxl,
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
    },
    thumb: {
      zIndex: -1,
      padding: theme.layout.spacing.xs,
    },
    thumbInner: {
      width: "100%",
      height: "100%",
    },
  });
