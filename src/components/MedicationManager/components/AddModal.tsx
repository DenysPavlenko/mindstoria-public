import { TimePickerModal } from "@/components/TimePickerModal/TimePickerModal";
import { useTheme } from "@/theme";
import { TMedication, TMedLog } from "@/types/medications";
import { generateUniqueId, TIME_FORMAT } from "@/utils";
import dayjs from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "../../Button/Button";
import { IconButton } from "../../IconButton/IconButton";
import { Input } from "../../Input/Input";
import { Modal } from "../../Modal/Modal";
import { Pill } from "../../Pill/Pill";
import { Typography } from "../../Typography/Typography";

export type TMedModalData = {
  med: TMedication;
  log?: TMedLog;
};

interface AddModalProps {
  data: TMedModalData;
  date: string;
  onClose: () => void;
  onAdd: (log: TMedLog) => void;
  onEdit: (log: TMedLog) => void;
  onDelete: (log: TMedLog) => void;
}

const INCREMENTS = [
  { label: "-1", operation: (curr: number, d: number) => curr - d },
  { label: "-0.5", operation: (curr: number, d: number) => curr - d / 2 },
  { label: "+0.5", operation: (curr: number, d: number) => curr + d / 2 },
  { label: "+1", operation: (curr: number, d: number) => curr + d },
] as const;

export const AddModal = ({
  data,
  onClose,
  date,
  onAdd,
  onEdit,
  onDelete,
}: AddModalProps) => {
  const { theme } = useTheme();
  const [dosage, setDosage] = useState(data.med.dosage.toString());
  const [timestamp, setTimestamp] = useState(date);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const { t } = useTranslation();

  const medData = data.med;
  const logData = data.log;

  const defaultDosage = medData.dosage;
  const numericDosage = Number(dosage);

  const initialTime = useMemo(() => {
    const d = dayjs(timestamp);
    const hours = d.hour();
    const minutes = d.minute();
    const seconds = d.second();
    return { hours, minutes, seconds };
  }, [timestamp]);

  useEffect(() => {
    if (logData) {
      setDosage(logData.dosage.toString());
      setTimestamp(logData.timestamp);
    }
  }, [logData, defaultDosage]);

  const isDosageValid = !isNaN(numericDosage) && numericDosage > 0;

  const handleAdd = () => {
    if (medData && isDosageValid) {
      onClose();
      const newLog: TMedLog = {
        id: generateUniqueId(),
        medId: medData.id,
        timestamp,
        dosage: numericDosage,
      };
      onAdd(newLog);
    }
  };

  const handleEdit = () => {
    if (logData && isDosageValid) {
      onClose();
      onEdit({ ...logData, dosage: numericDosage, timestamp });
    }
  };

  const handleDelete = () => {
    if (logData) {
      onDelete(logData);
      onClose();
    }
  };

  const handleTimePick = (hours: number, minutes: number) => {
    const d = dayjs(timestamp).hour(hours).minute(minutes);
    setTimestamp(d.toISOString());
    setShowTimePicker(false);
  };

  const renderTimePicker = () => {
    return (
      <TimePickerModal
        hours={initialTime.hours}
        minutes={initialTime.minutes}
        onClose={() => {
          setShowTimePicker(false);
        }}
        onConfirm={handleTimePick}
        visible={showTimePicker}
      />
    );
  };

  return (
    <Modal visible onClose={onClose}>
      <View
        style={{
          flexDirection: "row",
          gap: theme.layout.spacing.md,
          justifyContent: "center",
          marginBottom: theme.layout.spacing.lg,
        }}
      >
        {INCREMENTS.map(({ label, operation }) => {
          return (
            <IconButton
              key={label}
              customContent={
                <Typography variant="smallBold">{label}</Typography>
              }
              size="xl"
              onPress={() => {
                setDosage((prev) => {
                  const numVal = Number(prev);
                  const result = operation(numVal, defaultDosage);
                  return Math.max(0, result).toString();
                });
              }}
            />
          );
        })}
      </View>
      <View
        style={{
          alignItems: "center",
          marginBottom: theme.layout.spacing.lg,
        }}
      >
        <Typography
          variant="h4"
          style={{ marginBottom: theme.layout.spacing.md }}
        >
          {medData?.name}
        </Typography>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <Input
            style={{ width: 120 }}
            value={dosage}
            onChangeText={setDosage}
            keyboardType="numeric"
            right={<Typography>{medData?.units}</Typography>}
          />
          <Pill
            label={dayjs(timestamp).format(TIME_FORMAT)}
            onPress={() => setShowTimePicker(true)}
          />
        </View>
      </View>
      <View
        style={{
          gap: theme.layout.spacing.md,
          flexDirection: "row",
          alignItems: "center",
        }}
      >
        <Button
          style={{ flex: 1 }}
          disabled={!medData || !isDosageValid}
          onPress={logData ? handleEdit : handleAdd}
        >
          {t("common.save")}
        </Button>
        {logData && (
          <IconButton
            size="md"
            icon="trash-2"
            backgroundColor="errorContainer"
            iconColor="onErrorContainer"
            disabled={!medData}
            onPress={handleDelete}
          />
        )}
      </View>
      {renderTimePicker()}
    </Modal>
  );
};
