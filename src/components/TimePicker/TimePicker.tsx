import { TTheme, useTheme } from "@/theme";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import { TimerPicker as RNTimerPicker } from "react-native-timer-picker";

export interface TimerPickerProps {
  onChange: (hours: number, minutes: number) => void;
  hours: number;
  minutes: number;
  seconds?: number;
}

export const TimerPicker = ({ onChange, hours, minutes }: TimerPickerProps) => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isFirstRender = useRef(true);

  return (
    <View style={styles.container}>
      <RNTimerPicker
        padWithNItems={1}
        hourLabel={t("time.hours_short")}
        minuteLabel={t("time.minutes_short")}
        LinearGradient={LinearGradient}
        initialValue={{ hours, minutes }}
        onDurationChange={({ hours, minutes, seconds }) => {
          if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
          }
          onChange(hours, minutes);
        }}
        styles={{
          theme: isDark ? "dark" : "light",
          backgroundColor: theme.colors.surface,
          pickerContainer: {},
          pickerItem: {
            fontSize: 28,
          },
          pickerLabel: {
            marginTop: 0,
          },
        }}
      />
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      // backgroundColor: theme.colors.primary,
      alignItems: "center",
      justifyContent: "center",
    },
  });
