import { Card, Pill, SlideInModal, Typography } from "@/components";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TCBTLogMetricType } from "@/types";
import { getCBTTitle } from "@/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface InfoModalProps {
  visible: boolean;
  metricType: TCBTLogMetricType;
  onClose: () => void;
}

interface CBTStep {
  type: TCBTLogMetricType;
  titleKey: string;
  exampleKey: string;
}

const CBT_STEPS: CBTStep[] = [
  {
    type: "situation",
    titleKey: "situation",
    exampleKey: "cbt.situation_example",
  },
  {
    type: "thought",
    titleKey: "thought",
    exampleKey: "cbt.automatic_thought_example",
  },
  {
    type: "behavior",
    titleKey: "behavior",
    exampleKey: "cbt.behavior_example",
  },
  {
    type: "alternativeThought",
    titleKey: "alternativeThought",
    exampleKey: "cbt.alternate_thought_example",
  },
  {
    type: "cognitiveDistortions",
    titleKey: "cognitiveDistortions",
    exampleKey: "cbt.cognitive_distortions_example",
  },
];

export const InfoModal = ({ visible, metricType, onClose }: InfoModalProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderExample = (label: string, example: string, isPrev?: boolean) => {
    return (
      <Card style={{ opacity: isPrev ? 0.5 : 1 }} key={label}>
        <Pill
          label={label}
          bgColor="secondaryContainer"
          textColor="onSecondaryContainer"
          style={{
            position: "absolute",
            top: -theme.layout.spacing.md,
            left: theme.layout.spacing.lg,
            alignSelf: "flex-start",
          }}
        />
        <Typography
          variant="h5"
          fontWeight="regular"
          style={{ paddingTop: theme.layout.spacing.md / 2 }}
        >
          {example}
        </Typography>
      </Card>
    );
  };

  const getStepsToShow = () => {
    const currentStepIndex = CBT_STEPS.findIndex(
      (step) => step.type === metricType,
    );
    return CBT_STEPS.slice(0, currentStepIndex + 1);
  };

  const getInfoKey = () => {
    const infoKeys: Record<TCBTLogMetricType, string> = {
      situation: "cbt.situation_info",
      thought: "cbt.automatic_thought_info",
      behavior: "cbt.behavior_info",
      alternativeThought: "cbt.alternate_thought_info",
      cognitiveDistortions: "cbt.cognitive_distortions_info",
      emotions: "cbt.emotions_info",
    };
    return infoKeys[metricType];
  };

  const renderContent = () => {
    const infoText = t(getInfoKey());
    if (metricType === "emotions" || metricType === "cognitiveDistortions") {
      return (
        <View style={styles.wrapper}>
          <Typography variant="h5" fontWeight="semibold">
            {infoText}
          </Typography>
        </View>
      );
    }
    const stepsToShow = getStepsToShow();
    return (
      <View style={styles.wrapper}>
        <Typography variant="h5" fontWeight="semibold">
          {infoText}
        </Typography>
        <View style={styles.examples}>
          {stepsToShow.map((step) => {
            const isCurrentStep = step.type === metricType;
            const label = getCBTTitle(t, step.titleKey as TCBTLogMetricType);
            const example = t(step.exampleKey);
            return renderExample(label, example, !isCurrentStep);
          })}
        </View>
      </View>
    );
  };

  return (
    <SlideInModal
      title={getCBTTitle(t, metricType)}
      visible={visible}
      onClose={onClose}
    >
      <View style={styles.container}>{renderContent()}</View>
    </SlideInModal>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.layout.spacing.lg,
    },
    wrapper: {
      gap: theme.layout.spacing.xxl,
    },
    examples: {
      gap: theme.layout.spacing.xl,
    },
  });
