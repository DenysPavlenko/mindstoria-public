import { TTheme, useTheme } from "@/theme";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Slider } from "../Slider/Slider";
import { Typography } from "../Typography/Typography";

interface RangeInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  min: number;
  max: number;
  step?: number;
  disabled?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const RangeInput = ({
  value,
  onChange,
  min,
  max,
  disabled = false,
  style,
}: RangeInputProps) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const handleSliderChange = (newValue: number) => {
    onChange(newValue);
  };

  const currentValue = value !== null ? value : min;

  return (
    <View style={[styles.container, style]}>
      <Typography variant="bodyBold">{min}</Typography>
      <View style={styles.sliderContainer}>
        <Slider
          value={currentValue}
          onChange={handleSliderChange}
          min={min}
          max={max}
          disabled={disabled}
        />
      </View>
      <Typography variant="bodyBold">{max}</Typography>
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: theme.layout.spacing.xs,
    },
    sliderContainer: {
      flex: 1,
      paddingHorizontal: theme.layout.spacing.lg,
    },
  });

export default RangeInput;
