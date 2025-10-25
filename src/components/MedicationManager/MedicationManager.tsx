import PillIcon from "@/assets/feather/pill.svg";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addMedLogThunk,
  removeMedLogThunk,
  selectMedications,
  selectMedLogsMapByDate,
  updateMedLogThunk,
} from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TMedication, TMedLog } from "@/types";
import { CALENDAR_DATE_FORMAT, TIME_FORMAT } from "@/utils";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Chip } from "../Chip/Chip";
import { IconBox } from "../IconBox/IconBox";
import { IconButton } from "../IconButton/IconButton";
import { Placeholder } from "../Placeholder/Placeholder";
import { Typography } from "../Typography/Typography";
import { AddModal, TMedModalData } from "./components/AddModal";

interface MedicationManagerProps {
  date: string;
}

export const MedicationManager = ({ date }: MedicationManagerProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [modalData, setModalData] = useState<TMedModalData | null>(null);
  const dispatch = useAppDispatch();
  const medications = useAppSelector(selectMedications);
  const medLogsMapByDate = useAppSelector(selectMedLogsMapByDate);

  const todayLogs = useMemo(() => {
    const formattedDate = dayjs(date).format(CALENDAR_DATE_FORMAT);
    return medLogsMapByDate[formattedDate] || {};
  }, [date, medLogsMapByDate]);

  const medList = useMemo(() => {
    return medications.filter((def) => {
      const logsForMed = todayLogs[def.id] || [];
      const hasLogs = logsForMed.length > 0;
      // Keep archived and inactive items if they are currently selected
      if ((def.isArchived || !def.isActive) && hasLogs) return true;
      return !def.isArchived && def.isActive;
    });
  }, [medications, todayLogs]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleAddMedLog = (log: TMedLog) => {
    dispatch(addMedLogThunk(log));
    setModalData(null);
  };

  const handleEditMedLog = (log: TMedLog) => {
    dispatch(updateMedLogThunk(log));
    setModalData(null);
  };

  const handleDeleteMedLog = (log: TMedLog) => {
    dispatch(removeMedLogThunk(log));
    setModalData(null);
  };

  const renderMedModal = () => {
    if (!modalData) return null;
    return (
      <AddModal
        data={modalData}
        date={date}
        onClose={() => setModalData(null)}
        onAdd={handleAddMedLog}
        onEdit={handleEditMedLog}
        onDelete={handleDeleteMedLog}
      />
    );
  };

  const renderTakenMed = useCallback(
    (log: TMedLog, med: TMedication) => {
      const takenItems = log.dosage / med.dosage;
      return (
        <View key={log.id} style={styles.doseBadgeContainer}>
          <IconButton
            onPress={() => setModalData({ med, log })}
            customContent={
              <Typography
                variant="smallBold"
                color="onPrimaryContainer"
                numberOfLines={1}
              >
                {takenItems}
              </Typography>
            }
            radius="lg"
            size="md"
            backgroundColor="primaryContainer"
          />
          <Typography align="center" variant="tinyBold">
            {dayjs(log.timestamp).format(TIME_FORMAT)}
          </Typography>
        </View>
      );
    },
    [styles]
  );

  const renderIcon = useCallback(
    (isArchived: boolean, isActive: boolean) => {
      if (isArchived) {
        return <IconBox icon="archive" radius="lg" backgroundColor="surface" />;
      }
      if (!isActive) {
        return <IconBox icon="eye-off" radius="lg" backgroundColor="surface" />;
      }
      const size = theme.layout.size.lg * 0.45;
      return (
        <IconBox
          customContent={
            <PillIcon
              width={size}
              height={size}
              color={theme.colors.onSurface}
            />
          }
          radius="lg"
          backgroundColor="surface"
        />
      );
    },
    [theme]
  );

  const renderItem = useCallback(
    ({ item }: { item: TMedication }) => {
      const takenLogs = todayLogs[item.id] || [];
      const totalDosage = takenLogs.reduce((sum, log) => sum + log.dosage, 0);
      const isArchived = item.isArchived || false;
      const isActive = item.isActive || false;
      let status = "";
      if (!isActive) {
        status += `${t("common.inactive")}`;
      }
      if (isArchived) {
        status += `${t("common.archived")}`;
      }
      return (
        <Card style={styles.listCard}>
          {status !== "" && (
            <Typography variant="smallBold" color="error" align="right">
              {status}
            </Typography>
          )}
          <View style={styles.listCardTopRow}>
            {renderIcon(isArchived, isActive)}
            <View style={{ flex: 1 }}>
              <Typography variant="h5" numberOfLines={2}>
                {item.name}
              </Typography>
              <Typography>
                {item.dosage} {item.units}
              </Typography>
            </View>
            <IconButton
              icon="plus"
              size="md"
              backgroundColor="surface"
              onPress={() => {
                setModalData({ med: item });
              }}
            />
          </View>
          {takenLogs.length > 0 && (
            <View style={styles.listCardBottomRow}>
              <View style={styles.listCardTakenContainer}>
                {takenLogs.map((log) => renderTakenMed(log, item))}
              </View>
              <Chip
                label={`${totalDosage} ${item.units}`}
                bgColor="surface"
                textColor="onSurface"
                minHeight="md"
              />
            </View>
          )}
        </Card>
      );
    },
    [styles, t, todayLogs, renderTakenMed, renderIcon]
  );

  const renderPlaceholder = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Placeholder content={t("medications.no_medications_text")} />
      </View>
    );
  };

  const renderList = () => {
    return (
      <FlatList
        data={medList}
        ListEmptyComponent={renderPlaceholder}
        showsVerticalScrollIndicator={false}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContainer}
        renderItem={renderItem}
      />
    );
  };

  const renderAddMedicationButton = () => {
    return (
      <Button
        onPress={() => {
          router.navigate({
            pathname: "/medications",
          });
        }}
        style={{ marginTop: theme.layout.spacing.lg }}
      >
        {t("medications.manage_medications")}
      </Button>
    );
  };

  return (
    <View style={styles.container}>
      {renderList()}
      {renderMedModal()}
      {renderAddMedicationButton()}
    </View>
  );
};

const createStyles = (theme: TTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
    },
    listContainer: {
      flexGrow: 1,
      justifyContent: "flex-end",
      gap: theme.layout.spacing.sm,
    },
    listCard: {
      gap: theme.layout.spacing.md,
    },
    listCardTopRow: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.layout.spacing.md,
    },
    listCardBottomRow: {
      flexDirection: "row",
      alignItems: "flex-start",
      justifyContent: "space-between",
      gap: theme.layout.spacing.lg,
    },
    listCardTakenContainer: {
      maxWidth: "70%",
      flexDirection: "row",
      flexWrap: "wrap",
      gap: theme.layout.spacing.sm,
    },
    doseBadgeContainer: {
      gap: theme.layout.spacing.xs,
      justifyContent: "center",
      alignItems: "center",
    },
  });
};
