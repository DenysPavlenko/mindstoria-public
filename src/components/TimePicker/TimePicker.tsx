import { useTheme } from "@/providers";
import { fonts, TTheme, typography, withAlpha } from "@/theme";
import { useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { TimerPicker as RNTimerPicker } from "react-native-timer-picker";
import { Typography } from "../Typography/Typography";

export interface TimerPickerProps {
  onChange: (hours: number, minutes: number) => void;
  hours: number;
  minutes: number;
  outerWidth?: number;
}

export const TimerPicker = ({
  onChange,
  hours,
  minutes,
  outerWidth,
}: TimerPickerProps) => {
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isFirstRender = useRef(true);

  const itemWidth = outerWidth ? outerWidth / 2.5 : 140;
  const itemHeight = 40;

  const renderBgLine = () => {
    return (
      <View
        style={{
          position: "absolute",
          left: 0,
          height: itemHeight,
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: theme.colors.primaryContainer,
          borderRadius: theme.layout.borderRadius.lg,
        }}
      >
        <Typography variant="h2" style={{ marginTop: -5 }}>
          :
        </Typography>
      </View>
    );
  };

  const renderTopGradient = () => {
    return (
      <LinearGradient
        colors={[theme.colors.surface, withAlpha(theme.colors.surface, 0.2)]}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: itemHeight * 1.8,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    );
  };

  const renderBottomGradient = () => {
    return (
      <LinearGradient
        colors={[withAlpha(theme.colors.surface, 0.2), theme.colors.surface]}
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: itemHeight * 1.8,
          zIndex: 1,
          pointerEvents: "none",
        }}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderTopGradient()}
      {renderBgLine()}
      <RNTimerPicker
        padWithNItems={2}
        hideSeconds
        hourLabel=""
        minuteLabel=""
        secondLabel=""
        initialValue={{ hours, minutes }}
        onDurationChange={({ hours, minutes }) => {
          if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
          }
          onChange(hours, minutes);
        }}
        styles={{
          theme: isDark ? "dark" : "light",
          backgroundColor: "transparent",
          pickerContainer: {
            justifyContent: "center",
            right: -11,
          },
          text: {
            fontSize: typography.h2.fontSize,
            fontFamily: fonts["semibold"],
          },
          pickerItemContainer: {
            width: itemWidth,
            height: itemHeight,
          },
          pickerItem: {},
          pickerLabel: {
            display: "none",
          },
        }}
      />
      {renderBottomGradient()}
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      backgroundColor: theme.colors.surface,
      alignItems: "center",
      justifyContent: "center",
    },
  });
