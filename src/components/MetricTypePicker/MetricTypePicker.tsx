import { useTheme } from "@/theme";
import { TrackerMetricType } from "@/types";
import { useTranslation } from "react-i18next";
import { FlatList, StyleProp, ViewStyle } from "react-native";
import { Chip } from "../Chip/Chip";

export type MetricTypePickerProps = {
  value: TrackerMetricType;
  onChange: (value: TrackerMetricType) => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
};

export const MetricTypePicker = ({
  value,
  onChange,
  style,
  disabled,
}: MetricTypePickerProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const METRIC_TYPE_OPTIONS = [
    { label: t("metrics.range"), value: TrackerMetricType.Range },
    { label: t("metrics.number"), value: TrackerMetricType.Number },
    { label: t("metrics.boolean"), value: TrackerMetricType.Boolean },
    { label: t("metrics.duration"), value: TrackerMetricType.Duration },
    { label: t("metrics.time"), value: TrackerMetricType.Time },
    { label: t("metrics.notes"), value: TrackerMetricType.Notes },
  ] as const;

  return (
    <FlatList
      style={style}
      horizontal
      keyboardShouldPersistTaps="handled"
      showsHorizontalScrollIndicator={false}
      data={METRIC_TYPE_OPTIONS}
      keyExtractor={(item) => item.label}
      renderItem={({ item }) => (
        <Chip
          key={item.label}
          label={item.label}
          style={{ marginRight: theme.layout.spacing.sm }}
          selected={value === item.value}
          onPress={() => onChange(item.value)}
          disabled={disabled}
        />
      )}
    />
  );
};

export default MetricTypePicker;
