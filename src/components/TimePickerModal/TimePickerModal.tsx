import { useTheme } from "@/theme";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { TimerPicker } from "../TimePicker/TimePicker";
import { Typography } from "../Typography/Typography";

const MODAL_WIDTH = 300;

interface TimePickerModalProps {
  visible: boolean;
  onClose: () => void;
  onConfirm: (hours: number, minutes: number) => void;
  onDelete?: () => void;
  hours: number;
  minutes: number;
}

export const TimePickerModal = ({
  visible,
  onClose,
  onConfirm,
  onDelete,
  hours,
  minutes,
}: TimePickerModalProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [localHours, setLocalHours] = useState(hours);
  const [localMinutes, setLocalMinutes] = useState(minutes);

  // Sync local state with props when they change
  useEffect(() => {
    setLocalHours(hours);
    setLocalMinutes(minutes);
  }, [hours, minutes]);

  const handleConfirm = () => {
    onConfirm(localHours, localMinutes);
  };

  const renderFirstButton = () => {
    if (onDelete) {
      return (
        <Button textColor="onErrorContainer" variant="text" onPress={onDelete}>
          {t("common.delete")}
        </Button>
      );
    }
    return (
      <Button textColor="onPrimaryContainer" variant="text" onPress={onClose}>
        {t("common.cancel")}
      </Button>
    );
  };

  return (
    <Modal visible={visible} onClose={onClose} maxWidth={MODAL_WIDTH}>
      <Typography
        variant="h4"
        align="center"
        style={{ marginBottom: theme.layout.spacing.lg }}
      >
        {t("common.choose_time")}
      </Typography>
      <TimerPicker
        hours={localHours}
        minutes={localMinutes}
        onChange={(h, min) => {
          setLocalHours(h);
          setLocalMinutes(min);
        }}
        outerWidth={MODAL_WIDTH}
      />
      <View
        style={{
          flexDirection: "row",
          marginTop: theme.layout.spacing.lg,
          gap: theme.layout.spacing.sm,
          justifyContent: "flex-end",
        }}
      >
        {renderFirstButton()}
        <Button onPress={handleConfirm}>{t("common.confirm")}</Button>
      </View>
    </Modal>
  );
};
