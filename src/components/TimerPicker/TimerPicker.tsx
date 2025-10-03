import { TTheme, useTheme } from "@/theme";
import { secondsToHMS } from "@/utils";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { TimerPicker as RNTimerPicker } from "react-native-timer-picker";

interface TimerPickerProps {
  onChange: (value: number) => void;
  value?: number;
}

export const TimerPicker = ({ onChange, value }: TimerPickerProps) => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);
  const isFirstRender = useRef(true);

  const initialTime = useMemo(() => secondsToHMS(value || 0), [value]);

  return (
    <View style={styles.container}>
      <RNTimerPicker
        padWithNItems={1}
        hourLabel={t("time.hours_short")}
        minuteLabel={t("time.minutes_short")}
        secondLabel={t("time.seconds_short")}
        LinearGradient={LinearGradient}
        initialValue={{
          hours: initialTime.hours,
          minutes: initialTime.minutes,
          seconds: initialTime.seconds,
        }}
        onDurationChange={({ hours, minutes, seconds }) => {
          if (isFirstRender.current) {
            isFirstRender.current = false;
            return;
          }
          const valueInSeconds = hours * 3600 + minutes * 60 + seconds;
          onChange(valueInSeconds);
        }}
        styles={{
          theme: isDark ? "dark" : "light",
          backgroundColor: theme.colors.background,
          pickerItem: {
            fontSize: 34,
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
      backgroundColor: theme.colors.background,
      alignItems: "center",
      justifyContent: "center",
    },
  });
