import {
  AddMedicationModal,
  Button,
  Card,
  Checkbox,
  ConfirmationDialog,
  CustomPressable,
  Header,
  IconButton,
  Placeholder,
  SafeView,
  Typography,
} from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  activateMedication,
  archiveMedication,
  deactivateMedication,
} from "@/store/slices";
import { selectNonArchivedMedications } from "@/store/slices/medications/medicationsSelectors";
import { TOUCHABLE_ACTIVE_OPACITY, TTheme, useTheme } from "@/theme";
import { TMedication } from "@/types/medications";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";

export const Medications = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [itemToEdit, setItemToEdit] = useState<TMedication | null>(null);
  const [showModal, setShowModal] = useState(false);
  const [itemToArchive, setItemToArchive] = useState<TMedication | null>(null);
  const dispatch = useAppDispatch();
  const medsList = useAppSelector(selectNonArchivedMedications);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleActivateToggle = (medication: TMedication) => {
    const { id, isActive } = medication;
    if (isActive) {
      dispatch(deactivateMedication(id));
    } else {
      dispatch(activateMedication(id));
    }
  };

  const handleArchive = () => {
    if (itemToArchive) {
      dispatch(archiveMedication(itemToArchive.id));
      setItemToArchive(null);
    }
  };

  const renderPlaceholder = () => {
    return (
      <View style={styles.placeholder}>
        <Placeholder title={t("medications.no_medications_added_yet")} />
      </View>
    );
  };

  const renderItem = ({ item }: { item: TMedication }) => {
    return (
      <Card noVerticalPadding>
        <CustomPressable
          key={item.id}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
          style={styles.itemContainer}
          onPress={() => setItemToEdit(item)}
          withHaptics={false}
        >
          <Checkbox
            size="md"
            checked={Boolean(item.isActive)}
            onChange={() => handleActivateToggle(item)}
          />
          <View style={{ flex: 1 }}>
            <Typography>{item.name}</Typography>
            <Typography color="outline">
              {item.dosage} {item.units}
            </Typography>
          </View>
          <IconButton
            size="md"
            backgroundColor="errorContainer"
            iconColor="error"
            icon="trash-2"
            onPress={() => {
              setItemToArchive(item);
            }}
          />
        </CustomPressable>
      </Card>
    );
  };

  const renderList = () => {
    if (medsList.length === 0) {
      return renderPlaceholder();
    }
    return (
      <FlatList
        data={medsList}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ gap: theme.layout.spacing.sm }}
      />
    );
  };

  const renderModal = () => {
    if (!showModal && !itemToEdit) return null;
    const isVisible = Boolean(showModal) || Boolean(itemToEdit);
    return (
      <AddMedicationModal
        visible={isVisible}
        itemToEdit={itemToEdit}
        onClose={() => {
          setShowModal(false);
          setItemToEdit(null);
        }}
      />
    );
  };

  const renderConfirmArchiveModal = () => {
    if (!itemToArchive) return null;
    return (
      <ConfirmationDialog
        visible={Boolean(itemToArchive)}
        title={t("common.confirm_delete")}
        content={t("medications.confirm_delete")}
        onConfirm={handleArchive}
        onClose={() => setItemToArchive(null)}
      />
    );
  };

  const renderHeader = () => {
    return <Header title={t("medications.medications_list")} />;
  };

  return (
    <SafeView>
      {renderHeader()}
      <View style={styles.container}>
        {renderModal()}
        {renderList()}
        {renderConfirmArchiveModal()}
        <Button onPress={() => setShowModal(true)}>
          {t("medications.add_medication")}
        </Button>
      </View>
    </SafeView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.layout.spacing.lg,
      gap: theme.layout.spacing.lg,
      justifyContent: "space-between",
    },
    placeholder: {
      flex: 1,
      justifyContent: "center",
    },
    itemContainer: {
      flexDirection: "row",
      gap: theme.layout.spacing.md,
      alignItems: "center",
      paddingVertical: theme.layout.spacing.lg,
    },
  });
