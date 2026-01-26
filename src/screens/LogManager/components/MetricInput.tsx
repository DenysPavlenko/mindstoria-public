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
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

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
  isActive: boolean;
  onChange: (metric: TLogMetric, value: TLogValue) => void;
  onNext: () => void;
}

export const MetricInput = ({
  metric,
  values,
  isActive,
  onChange,
  onNext,
}: MetricInputProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const styles = useMemo(() => createStyles(theme), [theme]);

  // Focus input when page becomes active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isActive, metric.type]);

  const handleValueChange = useCallback(
    (val: TLogValue) => {
      onChange(metric, val);
      if (metric.type === "wellbeing") {
        if (timeoutRef.current) {
          clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(onNext, 700);
      }
    },
    [metric, onChange, onNext],
  );

  // Cleanup timeout on unmount or when dependencies change
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

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
              ref={inputRef}
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
      paddingBottom: 0,
    },
  });

export default MetricInput;
