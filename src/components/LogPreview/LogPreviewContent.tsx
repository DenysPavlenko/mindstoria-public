import { useTheme } from "@/providers";
import { useAppSelector } from "@/store";
import { selectLogMetrics } from "@/store/slices";
import { TTheme } from "@/theme";
import {
  TEmotionDefinition,
  TImpactDefinition,
  TLog,
  TLogMetricType,
  TLogValues,
  TSentimentLog,
} from "@/types";
import { getRatingLevelLabel } from "@/utils";
import { isEmpty } from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { Card } from "../Card/Card";
import { Chip } from "../Chip/Chip";
import { Typography } from "../Typography/Typography";

interface LogPreviewContentProps {
  log: TLog;
}

export const LogPreviewContent = ({ log }: LogPreviewContentProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const metricsData = useAppSelector(selectLogMetrics);
  const impactDefinitionsItems = useAppSelector(
    (state) => state.impactDefinitions.items,
  );
  const emotionDefinitionsItems = useAppSelector(
    (state) => state.emotionDefinitions.items,
  );

  const metrics = useMemo(() => {
    return Object.values(metricsData);
  }, [metricsData]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderSentimentChips = (
    items: (TSentimentLog | TSentimentLog)[],
    definitions: Record<string, TImpactDefinition | TEmotionDefinition>,
    isEmotion: boolean = false,
  ) => {
    if (items.length === 0) return null;
    return (
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View
          style={{
            flexDirection: "row",
            gap: theme.layout.spacing.xs,
            marginTop: theme.layout.spacing.xs,
            paddingHorizontal: theme.layout.spacing.lg,
          }}
        >
          {items.map(({ id, definitionId }) => {
            const definition = definitions[definitionId];
            if (!definition) return null;
            const chipIconProp = isEmotion
              ? { customIcon: <Typography>{definition.icon}</Typography> }
              : { icon: (definition as TImpactDefinition).icon };
            return (
              <Chip
                key={id}
                disabled={definition.isArchived}
                label={t(definition.name)}
                {...chipIconProp}
              />
            );
          })}
        </View>
      </ScrollView>
    );
  };

  const renderMetricValue = (
    type: TLogMetricType,
    values: TLogValues,
    noCardPadding: boolean,
  ) => {
    if (type === "wellbeing") {
      return (
        <Typography variant="body">
          {getRatingLevelLabel(values.wellbeing, t)}
        </Typography>
      );
    }
    if (type === "impacts" && values.impacts.length > 0) {
      return renderSentimentChips(
        values.impacts,
        impactDefinitionsItems,
        false,
      );
    }
    if (type === "emotions" && values.emotions.length > 0) {
      return renderSentimentChips(
        values.emotions,
        emotionDefinitionsItems,
        true,
      );
    }
    if (type === "notes" && !isEmpty(values.notes?.trim())) {
      return (
        <ScrollView
          style={{ maxHeight: 150 }}
          showsVerticalScrollIndicator={false}
        >
          <Typography variant="body" color="outline">
            {values.notes}
          </Typography>
        </ScrollView>
      );
    }
    return (
      <Typography
        variant="small"
        color="outline"
        style={{
          paddingHorizontal: noCardPadding ? theme.layout.spacing.lg : 0,
        }}
      >
        {t("common.no_data")}
      </Typography>
    );
  };

  const renderList = () => {
    const translations: Record<TLogMetricType, string> = {
      wellbeing: t("mood.title"),
      impacts: t("impacts.title"),
      emotions: t("emotions.title"),
      notes: t("notes.title"),
    };
    return metrics.map((item) => {
      const noCardPadding = item.type === "impacts" || item.type === "emotions";
      return (
        <Card key={item.id} noPadding={noCardPadding} style={styles.metricItem}>
          <View style={styles.metricInfo}>
            <Typography
              variant="h5"
              style={{
                paddingHorizontal: noCardPadding ? theme.layout.spacing.lg : 0,
                marginBottom: theme.layout.spacing.xxs,
              }}
            >
              {translations[item.type]}
            </Typography>
            {renderMetricValue(item.type, log.values, noCardPadding)}
          </View>
        </Card>
      );
    });
  };

  return <View style={styles.list}>{renderList()}</View>;
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
      overflow: "hidden",
    },
    metricInfo: {
      flex: 1,
    },
  });
