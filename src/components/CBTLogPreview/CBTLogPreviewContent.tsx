import { CBT_LOG_METRICS, COGNITIVE_DISTORTIONS } from "@/data";
import { useAppSelector } from "@/store";
import { TTheme, useTheme } from "@/theme";
import {
  TCBTLog,
  TCBTLogMetricType,
  TCBTLogValues,
  TCognitiveDistortionDefinition,
  TCognitiveDistortionLog,
  TEmotionLog,
} from "@/types";
import { getCBTTitle } from "@/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "../Card/Card";
import { Chip } from "../Chip/Chip";
import { Typography } from "../Typography/Typography";

interface CBTLogPreviewContentProps {
  log: TCBTLog;
}

export const CBTLogPreviewContent = ({ log }: CBTLogPreviewContentProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const metricsData = CBT_LOG_METRICS;
  const emotionDefinitionsItems = useAppSelector(
    (state) => state.emotionDefinitions.items
  );

  const metrics = useMemo(() => {
    return Object.values(metricsData);
  }, [metricsData]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const cognitiveDistortionsMap = useMemo(() => {
    return COGNITIVE_DISTORTIONS.reduce((acc, item) => {
      acc[item.id] = item;
      return acc;
    }, {} as Record<string, TCognitiveDistortionDefinition>);
  }, []);

  const renderEmotionsChips = (items: TEmotionLog[]) => {
    if (items.length === 0) return null;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipsContainer}>
          {items.map(({ id, definitionId, level }) => {
            const definition = emotionDefinitionsItems[definitionId];
            if (!definition) return null;
            return (
              <Chip
                key={id}
                bgColor="surface"
                customContent={<Typography>{definition.icon}</Typography>}
                disabled={definition.isArchived}
                label={t(definition.name)}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderDistortionsChips = (items: TCognitiveDistortionLog[]) => {
    if (items.length === 0) return null;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={styles.chipsContainer}>
          {items.map(({ id, definitionId }) => {
            const definition = cognitiveDistortionsMap[definitionId];
            if (!definition) return null;
            return (
              <Chip
                key={id}
                bgColor="surface"
                icon={definition.icon}
                label={t(definition.name)}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderMetricValue = (
    type: TCBTLogMetricType,
    values: TCBTLogValues,
    noCardPadding: boolean
  ) => {
    const isTextMetric =
      type === "situation" ||
      type === "thought" ||
      type === "behavior" ||
      type === "alternativeThought";
    if (isTextMetric && values[type]) {
      const text = values[type as keyof TCBTLogValues] as string;
      return (
        <Typography variant="body" color="outline">
          {text}
        </Typography>
      );
    }
    if (type === "emotions" && values.emotions.length > 0) {
      return renderEmotionsChips(values.emotions);
    }
    if (
      type === "cognitiveDistortions" &&
      values.cognitiveDistortions.length > 0
    ) {
      return renderDistortionsChips(values.cognitiveDistortions);
    }
    return (
      <Typography
        variant="small"
        color="outline"
        style={[styles.noDataText, noCardPadding && styles.noDataTextPadding]}
      >
        {t("common.no_data")}
      </Typography>
    );
  };

  const renderList = () => {
    return metrics.map((item) => {
      const noCardPadding =
        item.type === "emotions" || item.type === "cognitiveDistortions";
      return (
        <Card key={item.id} noPadding={noCardPadding} style={styles.metricItem}>
          <View style={styles.metricInfo}>
            <Typography
              variant="h5"
              style={[
                styles.metricTitle,
                noCardPadding && styles.metricTitlePadding,
              ]}
            >
              {getCBTTitle(t, item.type)}
            </Typography>
            {renderMetricValue(item.type, log.values, noCardPadding)}
          </View>
        </Card>
      );
    });
  };

  return (
    <ScrollView showsVerticalScrollIndicator={false}>
      <View style={styles.list}>{renderList()}</View>
    </ScrollView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    list: {
      paddingHorizontal: theme.layout.spacing.lg,
      gap: theme.layout.spacing.sm,
    },
    listContent: {
      gap: theme.layout.spacing.sm,
    },
    metricItem: {
      flexDirection: "row",
      paddingVertical: theme.layout.spacing.md,
    },
    metricInfo: {
      flex: 1,
    },
    chipsContainer: {
      flexDirection: "row",
      gap: theme.layout.spacing.xs,
      marginTop: theme.layout.spacing.xs,
      paddingHorizontal: theme.layout.spacing.lg,
    },
    chipLabel: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.layout.spacing.xs,
    },
    noDataText: {
      // Base style for no data text
    },
    noDataTextPadding: {
      paddingHorizontal: theme.layout.spacing.lg,
    },
    metricTitle: {
      marginBottom: theme.layout.spacing.xxs,
    },
    metricTitlePadding: {
      paddingHorizontal: theme.layout.spacing.lg,
    },
  });
