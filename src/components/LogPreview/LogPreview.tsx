import { useAppSelector } from "@/store";
import { TTheme, useTheme } from "@/theme";
import {
  TEmotionDefinition,
  TEmotionLog,
  TImpactDefinition,
  TImpactLog,
  TLog,
  TLogMetricType,
  TLogValues,
} from "@/types";
import { getRatingLevelLabel, getSentimentColor } from "@/utils";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { isEmpty } from "lodash";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { Badge } from "../Badge/Badge";
import { Card } from "../Card/Card";
import { Chip } from "../Chip/Chip";
import { IconButton } from "../IconButton/IconButton";
import { Pill } from "../Pill/Pill";
import { SlideInModal } from "../SlideInModal/SlideInModal";
import { Typography } from "../Typography/Typography";

interface LogPreviewProps {
  log: TLog;
  onClose: () => void;
}

export const LogPreview = ({ log, onClose }: LogPreviewProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const metricsData = useAppSelector((state) => state.logMetrics.items);
  const impactDefinitionsItems = useAppSelector(
    (state) => state.impactDefinitions.items
  );
  const emotionDefinitionsItems = useAppSelector(
    (state) => state.emotionDefinitions.items
  );

  const metrics = useMemo(() => {
    return Object.values(metricsData);
  }, [metricsData]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const formattedTime = useMemo(() => {
    return dayjs(log.timestamp).format("HH:mm");
  }, [log.timestamp]);

  const handleEdit = (metricId?: string) => {
    onClose();
    router.push({
      pathname: "/log-manager",
      params: {
        logId: log.id,
        metricId,
      },
    });
  };

  const renderSentimentChips = (
    items: (TImpactLog | TEmotionLog)[],
    definitions: Record<string, TImpactDefinition | TEmotionDefinition>,
    isEmotion: boolean = false
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
          {items.map(({ id, definitionId, level }) => {
            const definition = definitions[definitionId];
            if (!definition) return null;
            const color = getSentimentColor(definition.type, level, theme);

            const chipIconProp = isEmotion
              ? { customContent: <Typography>{definition.icon}</Typography> }
              : { icon: (definition as TImpactDefinition).icon };

            return (
              <Chip
                key={id}
                bgColor="surface"
                {...chipIconProp}
                disabled={definition.isArchived}
                label={
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      gap: theme.layout.spacing.xs,
                    }}
                  >
                    <Typography variant="smallBold">
                      {t(definition.name)}
                    </Typography>
                    <Badge
                      absolute={false}
                      size={20}
                      value={level}
                      style={{ backgroundColor: color }}
                    />
                  </View>
                }
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
    noCardPadding: boolean
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
        false
      );
    }
    if (type === "emotions" && values.emotions.length > 0) {
      return renderSentimentChips(
        values.emotions,
        emotionDefinitionsItems,
        true
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

  const renderTitle = () => {
    return (
      <View style={styles.titleContainer}>
        <Pill label={formattedTime} />
        <IconButton size="md" icon="edit-2" onPress={() => handleEdit()} />
      </View>
    );
  };

  const renderList = () => {
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
              {t(`logs.${item.type}_title`)}
            </Typography>
            {renderMetricValue(item.type, log.values, noCardPadding)}
          </View>
        </Card>
      );
    });
  };

  return (
    <SlideInModal visible onClose={onClose} title={renderTitle()}>
      <View style={styles.list}>{renderList()}</View>
    </SlideInModal>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    list: {
      paddingHorizontal: theme.layout.spacing.lg,
      gap: theme.layout.spacing.sm,
    },
    titleContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.layout.spacing.sm,
      paddingRight: theme.layout.spacing.sm,
    },
    listContent: {
      gap: theme.layout.spacing.sm,
    },
    metricItem: {
      flexDirection: "row",
      paddingVertical: theme.layout.spacing.md,
    },
    checkbox: {
      marginRight: theme.layout.spacing.md,
    },
    metricInfo: {
      flex: 1,
    },
  });
