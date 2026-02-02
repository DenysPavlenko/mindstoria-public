import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { useTheme } from "@/providers";
import { useAppDispatch } from "@/store";
import { addMedication, updateMedication } from "@/store/slices";
import { TMedication } from "@/types/medications";
import { generateUniqueId, trackEvent } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { Label } from "../Label/Label";
import { Modal } from "../Modal/Modal";

interface AddMedicationModalProps {
  visible: boolean;
  onClose: () => void;
  itemToEdit: TMedication | null;
}

export const AddMedicationModal = ({
  visible,
  onClose,
  itemToEdit,
}: AddMedicationModalProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const [title, setTitle] = useState("");
  const [dose, setDose] = useState("");
  const [units, setUnits] = useState("");

  useEffect(() => {
    if (itemToEdit) {
      setTitle(itemToEdit.name);
      setDose(String(itemToEdit.dosage));
      setUnits(itemToEdit.units);
    }
  }, [itemToEdit]);

  const isMedicationValid = useMemo(() => {
    const isDoseValid = !isNaN(Number(dose)) && Number(dose) > 0;
    return title.trim().length > 0 && isDoseValid && units.trim().length > 0;
  }, [title, dose, units]);

  const handleAddMedication = () => {
    if (!isMedicationValid) return;
    const newMed: TMedication = {
      id: itemToEdit?.id || generateUniqueId(),
      name: title,
      dosage: Number(dose),
      isActive: itemToEdit?.isActive || true,
      units,
    };
    if (itemToEdit) {
      dispatch(updateMedication(newMed));
      trackEvent(ANALYTICS_EVENTS.MEDICATION_UPDATED);
    } else {
      dispatch(addMedication(newMed));
      trackEvent(ANALYTICS_EVENTS.MEDICATION_ADDED);
    }
    setTitle("");
    setDose("");
    setUnits("");
    onClose();
  };

  const renderForm = () => {
    return (
      <View style={{ gap: theme.layout.spacing.xl }}>
        <View style={{ gap: theme.layout.spacing.sm }}>
          <View>
            <Label label={t("common.name")} />
            <Input
              placeholder={t("common.enter_name")}
              value={title}
              onChangeText={setTitle}
            />
          </View>
          <View>
            <Label label={t("medications.single_dose")} />
            <Input
              placeholder={t("medications.enter_dose")}
              value={dose}
              onChangeText={setDose}
            />
          </View>
          <View>
            <Label label={t("medications.units")} />
            <Input
              placeholder={t("medications.enter_units")}
              autoCapitalize="none"
              value={units}
              onChangeText={setUnits}
            />
          </View>
        </View>
        <Button disabled={!isMedicationValid} onPress={handleAddMedication}>
          {itemToEdit
            ? t("common.save_changes")
            : t("medications.add_medication")}
        </Button>
      </View>
    );
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      {renderForm()}
    </Modal>
  );
};
