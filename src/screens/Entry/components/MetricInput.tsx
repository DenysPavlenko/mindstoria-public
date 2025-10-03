import {
  BooleanInput,
  FullScreenInput,
  Input,
  RangeInput,
  TimerPicker,
} from "@/components";
import { TEntryValue, TrackerMetricType, TTrackerMetric } from "@/types";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface MetricInputProps {
  metric: TTrackerMetric;
  value: TEntryValue;
  onChange: (value: TEntryValue) => void;
}

export const METRIC_INPUT_HEIGHT = 150;

export const MetricInput = ({ metric, value, onChange }: MetricInputProps) => {
  const { t } = useTranslation();

  const renderInput = () => {
    switch (metric.type) {
      case TrackerMetricType.Notes:
        return (
          <FullScreenInput
            value={typeof value === "string" ? value : undefined}
            onChangeText={onChange}
            placeholder={t("common.enter_text")}
          />
        );

      case TrackerMetricType.Number:
        const normalizedValue =
          typeof value === "number" || typeof value === "string"
            ? String(value)
            : undefined;
        return (
          <View style={styles.container}>
            <Input
              value={normalizedValue}
              onChangeText={onChange}
              placeholder={t("common.enter_number")}
              keyboardType="numeric"
            />
          </View>
        );

      case TrackerMetricType.Range:
        return (
          <View style={styles.container}>
            <RangeInput
              value={typeof value === "number" ? value : null}
              onChange={onChange}
              min={metric.config?.range?.[0] || 0}
              max={metric.config?.range?.[1] || 10}
            />
          </View>
        );

      case TrackerMetricType.Boolean:
        return (
          <View style={styles.container}>
            <BooleanInput
              style={styles.booleanInput}
              value={typeof value === "boolean" ? value : undefined}
              onChange={(val) => {
                if (val !== undefined) {
                  onChange(val);
                }
              }}
            />
          </View>
        );

      case TrackerMetricType.Duration:
      case TrackerMetricType.Time:
        return (
          <View style={styles.container}>
            <TimerPicker
              value={typeof value === "number" ? value : undefined}
              onChange={onChange}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return renderInput();
};

const styles = StyleSheet.create({
  container: {
    height: METRIC_INPUT_HEIGHT,
    alignContent: "center",
    justifyContent: "center",
  },
  booleanInput: {
    alignSelf: "center",
  },
});

export default MetricInput;
