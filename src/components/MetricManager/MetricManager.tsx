import { TTheme, useTheme } from "@/theme";
import { TrackerMetricType, TTrackerMetric } from "@/types";
import { buildMetric } from "@/utils";
import { TFunction } from "i18next";
import { isEmpty } from "lodash";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { Button } from "../Button/Button";
import { Input } from "../Input/Input";
import { MetricTypePicker } from "../MetricTypePicker/MetricTypePicker";
import { Modal } from "../Modal/Modal";
import { Typography } from "../Typography/Typography";

interface MetricManagerProps {
  onClose: () => void;
  onDone: (metrics: TTrackerMetric[]) => void;
  onEdit: (metric: TTrackerMetric) => void;
  metricToEdit?: TTrackerMetric | null;
  limitEditing?: boolean;
}

const getPlaceholderText = (type: TrackerMetricType, t: TFunction) => {
  switch (type) {
    case TrackerMetricType.Range:
      return t("metrics.range_input_placeholder");
    case TrackerMetricType.Number:
      return t("metrics.number_input_placeholder");
    case TrackerMetricType.Boolean:
      return t("metrics.boolean_input_placeholder");
    case TrackerMetricType.Duration:
      return t("metrics.duration_input_placeholder");
    case TrackerMetricType.Notes:
      return t("metrics.text_input_placeholder");
    case TrackerMetricType.Time:
      return t("metrics.time_input_placeholder");
    default:
      return "";
  }
};

export const MetricManager = ({
  onClose,
  onDone,
  onEdit,
  metricToEdit,
  limitEditing,
}: MetricManagerProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [metricLabel, setMetricLabel] = useState(metricToEdit?.label || "");
  const [metricType, setMetricType] = useState<TrackerMetricType>(
    metricToEdit?.type || TrackerMetricType.Range
  );
  const [rangeMin, setRangeMin] = useState(
    metricToEdit?.config?.range?.[0].toString() || "1"
  );
  const [rangeMax, setRangeMax] = useState(
    metricToEdit?.config?.range?.[1].toString() || "10"
  );
  const [metrics, setMetrics] = useState<TTrackerMetric[]>([]);
  const [showAdded, setShowAdded] = useState(false);
  const timeoutId = useRef<NodeJS.Timeout>(null);
  const nameInputRef = useRef<TextInput>(null);
  const minInputRef = useRef<TextInput>(null);
  const maxInputRef = useRef<TextInput>(null);

  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (showAdded) {
      const timer = setTimeout(() => {
        setShowAdded(false);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [showAdded]);

  const handleModalShow = useCallback(() => {
    if (timeoutId.current) {
      clearTimeout(timeoutId.current);
    }
    // Add a small buffer to ensure TextInput is ready
    timeoutId.current = setTimeout(() => {
      nameInputRef.current?.focus();
    }, 100);
  }, []);

  const handleAdd = () => {
    if (isEmpty(metricLabel)) return;
    if (metricType === TrackerMetricType.Range) {
      const min = Number(rangeMin);
      const max = Number(rangeMax);
      if (isNaN(min) || isNaN(max) || min >= max) {
        // Optionally show error to user
        return;
      }
    }
    setMetrics((prev) => [
      ...prev,
      buildMetric({ label: metricLabel, type: metricType, rangeMin, rangeMax }),
    ]);
    setMetricLabel("");
    setShowAdded(true);
  };

  const handleDone = () => {
    if (metrics.length > 0 && !metricToEdit) {
      onDone(metrics);
    }
    setMetrics([]);
    onClose();
  };

  const handleEdit = () => {
    if (metricToEdit) {
      const editedMetric = buildMetric({
        id: metricToEdit.id,
        label: metricLabel,
        type: metricType,
        rangeMin,
        rangeMax,
      });
      onEdit(editedMetric);
    }
    onClose();
  };

  const renderHeader = () => {
    const title = metricToEdit
      ? t("metrics.edit_metric")
      : t("metrics.add_metric");
    return (
      <View style={styles.header}>
        <Typography variant="h3">{title}</Typography>
        {showAdded && (
          <Typography color="onSurface" variant="tiny">
            {t("metrics.added")}
          </Typography>
        )}
      </View>
    );
  };

  const renderEditActions = () => {
    return (
      <View style={styles.dialogActions}>
        <Button variant="text" onPress={onClose}>
          {t("common.cancel")}
        </Button>
        <Button
          variant="text"
          disabled={!metricLabel.trim()}
          onPress={handleEdit}
        >
          {t("common.save")}
        </Button>
      </View>
    );
  };

  const renderAddActions = () => {
    return (
      <View style={styles.dialogActions}>
        <Button variant="text" onPress={handleDone}>
          {metrics.length > 0 ? t("common.done") : t("common.cancel")}
        </Button>
        <Button
          variant="text"
          disabled={!metricLabel.trim()}
          onPress={handleAdd}
        >
          {t("common.add")}
        </Button>
      </View>
    );
  };

  const renderActions = () => {
    if (metricToEdit) {
      return renderEditActions();
    }
    return renderAddActions();
  };

  return (
    <Modal
      animated={false}
      visible
      onClose={handleDone}
      onShow={handleModalShow}
    >
      {renderHeader()}
      <Input
        value={metricLabel}
        onChangeText={setMetricLabel}
        label={t("common.name")}
        placeholder={getPlaceholderText(metricType, t)}
        style={styles.modalInput}
        ref={nameInputRef}
        onSubmitEditing={() => {
          if (metricType === TrackerMetricType.Range) {
            minInputRef.current?.focus();
          }
        }}
        submitBehavior="submit"
      />
      {metricType === TrackerMetricType.Range && (
        <View style={styles.metricRangeRow}>
          <Input
            style={[styles.metricRangeInput, styles.metricRangeInputLeft]}
            label={t("common.min")}
            value={rangeMin}
            onChangeText={setRangeMin}
            keyboardType="numeric"
            placeholder="1"
            disabled={limitEditing}
            ref={minInputRef}
            onSubmitEditing={() => {
              maxInputRef.current?.focus();
            }}
            submitBehavior="submit"
          />
          <Input
            style={[styles.metricRangeInput, styles.metricRangeInputRight]}
            label={t("common.max")}
            value={rangeMax}
            onChangeText={setRangeMax}
            placeholder="10"
            keyboardType="numeric"
            disabled={limitEditing}
            ref={maxInputRef}
          />
        </View>
      )}
      <MetricTypePicker
        style={styles.metricTypePicker}
        value={metricType}
        onChange={setMetricType}
        disabled={limitEditing}
      />
      {renderActions()}
    </Modal>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.layout.spacing.lg,
    },
    modalInput: {
      marginBottom: theme.layout.spacing.md,
    },
    metricRangeRow: {
      flexDirection: "row",
    },
    metricRangeInput: {
      flex: 1,
    },
    metricRangeInputLeft: {
      marginRight: theme.layout.spacing.xs,
    },
    metricRangeInputRight: {
      marginLeft: theme.layout.spacing.xs,
    },
    metricTypePicker: {
      marginTop: theme.layout.spacing.lg,
    },
    dialogActions: {
      flexDirection: "row",
      justifyContent: "flex-end",
      marginTop: theme.layout.spacing.lg,
    },
  });
