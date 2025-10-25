import { useTheme } from "@/theme";
import { useTranslation } from "react-i18next";
import { Dimensions } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import { TimerPickerModal as RNTimerPickerModal } from "react-native-timer-picker";
import { Button } from "../Button/Button";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (hours: number, minutes: number, seconds: number) => void;
  hours: number;
  minutes: number;
  seconds?: number;
}

export const TimePickerModal = ({
  visible,
  onClose,
  onConfirm,
  hours,
  minutes,
  seconds = 0,
}: TimePickerModalProps) => {
  const { t } = useTranslation();
  const { theme, isDark } = useTheme();
  return (
    <RNTimerPickerModal
      visible={visible}
      padWithNItems={1}
      setIsVisible={(visible) => {
        if (!visible) {
          onClose();
        }
      }}
      onConfirm={(pickedDuration) => {
        onConfirm(
          pickedDuration.hours,
          pickedDuration.minutes,
          pickedDuration.seconds
        );
      }}
      onCancel={onClose}
      hourLabel=":"
      minuteLabel=":"
      secondLabel=""
      closeOnOverlayPress
      initialValue={{
        hours,
        minutes,
        seconds,
      }}
      LinearGradient={LinearGradient}
      styles={{
        theme: isDark ? "dark" : "light",
        backgroundColor: theme.colors.surface,
        buttonContainer: {
          paddingHorizontal: theme.layout.spacing.lg,
          gap: theme.layout.spacing.sm,
        },
        pickerLabel: {
          marginTop: 0,
        },
        pickerContainer: {
          width: SCREEN_WIDTH - 40 * 2,
          justifyContent: "center",
        },
        pickerItemContainer: {
          width: 80,
        },
        pickerLabelContainer: {
          right: -20,
          top: 0,
          bottom: 6,
          width: 40,
          alignItems: "center",
        },
      }}
      modalProps={{
        overlayOpacity: 0.2,
      }}
      cancelButton={
        <Button
          buttonColor="primaryContainer"
          textColor="onPrimaryContainer"
          style={{ flex: 1 }}
          variant="text"
        >
          {t("common.cancel")}
        </Button>
      }
      confirmButton={<Button style={{ flex: 1 }}>{t("common.confirm")}</Button>}
    />
  );
};
