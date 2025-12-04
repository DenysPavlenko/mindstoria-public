import {
  CognitiveDistortionSelector,
  EmotionsSelector,
  FullScreenInput,
  Typography,
} from "@/components";
import { TTheme, useTheme } from "@/theme";
import {
  TCBTLogMetric,
  TCBTLogValue,
  TCognitiveDistortionLog,
  TEmotionLog,
} from "@/types";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";

export type TCBTLogFormValues = {
  situation: string | null;
  thought: string | null;
  behavior: string | null;
  emotions: TEmotionLog[];
  cognitiveDistortions: TCognitiveDistortionLog[];
  alternativeThought: string | null;
};

interface MetricInputProps {
  metric: TCBTLogMetric;
  values: TCBTLogFormValues;
  isEditing: boolean;
  isActive?: boolean; // New prop to indicate if this page is active
  onChange: (metric: TCBTLogMetric, value: TCBTLogValue) => void;
}

export const MetricInput = ({
  metric,
  values,
  isEditing,
  isActive = false,
  onChange,
}: MetricInputProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);

  const styles = useMemo(() => createStyles(theme), [theme]);

  // Focus input when page becomes active
  useEffect(() => {
    if (isActive && inputRef.current) {
      inputRef.current?.focus();
    }
  }, [isActive]);

  const handleValueChange = useCallback(
    (val: TCBTLogValue) => {
      onChange(metric, val);
    },
    [metric, onChange]
  );

  const renderInput = () => {
    switch (metric.type) {
      case "situation":
        return (
          <View style={styles.notesContainer}>
            <Typography variant="h3">{t("cbt.situation")}</Typography>
            <FullScreenInput
              autoFocus
              ref={inputRef}
              value={values.situation || ""}
              onChangeText={handleValueChange}
              placeholder={t("common.start_typing")}
            />
          </View>
        );
      case "thought":
        return (
          <View style={styles.notesContainer}>
            <Typography variant="h3">{t("cbt.automatic_thought")}</Typography>
            <FullScreenInput
              ref={inputRef}
              value={values.thought || ""}
              onChangeText={handleValueChange}
              placeholder={t("common.start_typing")}
            />
          </View>
        );
      case "behavior":
        return (
          <View style={styles.notesContainer}>
            <Typography variant="h3">{t("cbt.behavior")}</Typography>
            <FullScreenInput
              ref={inputRef}
              value={values.behavior || ""}
              onChangeText={handleValueChange}
              placeholder={t("common.start_typing")}
            />
          </View>
        );
      case "alternativeThought":
        return (
          <View style={styles.notesContainer}>
            <Typography variant="h3">{t("cbt.alternative_thought")}</Typography>
            <FullScreenInput
              ref={inputRef}
              value={values.alternativeThought || ""}
              onChangeText={handleValueChange}
              placeholder={t("common.start_typing")}
            />
          </View>
        );
      case "emotions":
        return (
          <View style={styles.container}>
            <EmotionsSelector
              emotionLogItems={values.emotions}
              onChange={handleValueChange}
              wellbeing={null}
            />
          </View>
        );

      case "cognitiveDistortions":
        return (
          <View style={styles.container}>
            <CognitiveDistortionSelector
              logItems={values.cognitiveDistortions}
              onChange={handleValueChange}
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
      paddingHorizontal: theme.layout.spacing.lg,
      gap: theme.layout.spacing.sm,
    },
  });

export default MetricInput;
