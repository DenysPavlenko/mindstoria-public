import {
  EmotionsSelector,
  FullScreenInput,
  ImpactsSelector,
  WellbeingInput,
} from "@/components";
import { TTheme, useTheme } from "@/theme";
import {
  RatingLevel,
  TEmotionLog,
  TImpactLog,
  TLogMetric,
  TLogValue,
} from "@/types";
import { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export type TLogFormValues = {
  wellbeing: RatingLevel | null;
  impacts: TImpactLog[];
  emotions: TEmotionLog[];
  notes: string | null;
};

interface MetricInputProps {
  metric: TLogMetric;
  values: TLogFormValues;
  isEditing: boolean;
  onChange: (metric: TLogMetric, value: TLogValue) => void;
}

export const MetricInput = ({
  metric,
  values,
  isEditing,
  onChange,
}: MetricInputProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleValueChange = useCallback(
    (val: TLogValue) => {
      onChange(metric, val);
    },
    [metric, onChange]
  );

  const renderInput = () => {
    switch (metric.type) {
      case "wellbeing":
        return (
          <View style={styles.container}>
            <WellbeingInput
              value={values.wellbeing}
              onChange={handleValueChange}
            />
          </View>
        );
      case "impacts":
        return (
          <View style={styles.container}>
            <ImpactsSelector
              impactLogItems={values.impacts}
              onChange={handleValueChange}
              wellbeing={values.wellbeing}
            />
          </View>
        );
      case "emotions":
        return (
          <View style={styles.container}>
            <EmotionsSelector
              emotionLogItems={values.emotions}
              onChange={handleValueChange}
              wellbeing={values.wellbeing}
            />
          </View>
        );
      case "notes":
        return (
          <View style={styles.notesContainer}>
            <FullScreenInput
              value={values.notes || ""}
              onChangeText={handleValueChange}
              placeholder={t("common.add_note")}
            />
          </View>
        );

      default:
        return null;
    }
  };

  return renderInput();
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    notesContainer: {
      flex: 1,
      padding: theme.layout.spacing.lg,
    },
  });

export default MetricInput;
