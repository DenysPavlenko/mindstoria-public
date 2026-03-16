import { CognitiveDistortionSelector, Typography } from "@/components";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import {
  RatingLevel,
  TCBTLogMetric,
  TCBTLogValue,
  TCognitiveDistortionLog,
  TSentimentLog,
} from "@/types";
import { useCallback, useEffect, useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, TextInput, View } from "react-native";
import { EmotionSelector } from "./EmotionSelector";
import { FullScreenInputWrapper } from "./FullScreenInputWrapper";

const IS_IOS = Platform.OS === "ios";

export type TCBTLogFormValues = {
  situation: string | null;
  thought: string | null;
  behavior: string | null;
  emotions: TSentimentLog[];
  cognitiveDistortions: TCognitiveDistortionLog[];
  alternativeThought: string | null;
};

interface MetricInputProps {
  metric: TCBTLogMetric;
  values: TCBTLogFormValues;
  isEditing: boolean;
  isActive: boolean;
  isKeyboardVisible: boolean;
  onChange: (metric: TCBTLogMetric, value: TCBTLogValue) => void;
  wellbeing: RatingLevel | null;
}

export const MetricInput = ({
  metric,
  values,
  isEditing,
  isActive = false,
  onChange,
  wellbeing,
  isKeyboardVisible,
}: MetricInputProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const inputRef = useRef<TextInput>(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  // Focus input when page becomes active(Android only)
  useEffect(() => {
    if (isActive && inputRef.current && !IS_IOS) {
      // Delay to ensure input is focused after any transitions
      setTimeout(() => {
        inputRef.current?.focus();
      }, 100);
    }
  }, [isActive]);

  const handleValueChange = useCallback(
    (val: TCBTLogValue) => {
      onChange(metric, val);
    },
    [metric, onChange],
  );

  const handleInputWrapperPress = () => {
    if (IS_IOS) {
      inputRef.current?.focus();
    }
  };

  const renderInput = () => {
    switch (metric.type) {
      case "situation":
        return (
          <View style={styles.notesContainer}>
            <Typography variant="h3">{t("cbt.situation")}</Typography>
            <FullScreenInputWrapper
              ref={inputRef}
              autoFocus={IS_IOS}
              onPress={handleInputWrapperPress}
              value={values.situation || ""}
              onChangeText={(text) => handleValueChange(text)}
              placeholder={t("common.start_typing")}
              isKeyboardVisible={isKeyboardVisible}
            />
          </View>
        );
      case "thought":
        return (
          <View style={styles.notesContainer}>
            <Typography variant="h3">{t("cbt.automatic_thought")}</Typography>
            <FullScreenInputWrapper
              ref={inputRef}
              onPress={handleInputWrapperPress}
              value={values.thought || ""}
              onChangeText={(text) => handleValueChange(text)}
              placeholder={t("common.start_typing")}
              isKeyboardVisible={isKeyboardVisible}
            />
          </View>
        );
      case "behavior":
        return (
          <View style={styles.notesContainer}>
            <Typography variant="h3">{t("cbt.behavior")}</Typography>
            <FullScreenInputWrapper
              ref={inputRef}
              onPress={handleInputWrapperPress}
              value={values.behavior || ""}
              onChangeText={(text) => handleValueChange(text)}
              placeholder={t("common.start_typing")}
              isKeyboardVisible={isKeyboardVisible}
            />
          </View>
        );
      case "alternativeThought":
        return (
          <View style={styles.notesContainer}>
            <Typography variant="h3">{t("cbt.alternative_thought")}</Typography>
            <FullScreenInputWrapper
              ref={inputRef}
              onPress={handleInputWrapperPress}
              value={values.alternativeThought || ""}
              onChangeText={(text) => handleValueChange(text)}
              placeholder={t("common.start_typing")}
              isKeyboardVisible={isKeyboardVisible}
            />
          </View>
        );
      case "emotions":
        return (
          <View style={styles.container}>
            <EmotionSelector
              emotionLogItems={values.emotions}
              onChange={handleValueChange}
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

  return <View style={{ flex: 1 }}>{renderInput()}</View>;
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
