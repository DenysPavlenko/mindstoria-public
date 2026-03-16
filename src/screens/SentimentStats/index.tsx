import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { RATING_VALUES } from "@/appConstants";
import {
  Card,
  Header,
  MoodIcon,
  PeriodNavigator,
  PeriodSelector,
  SentimentRatingList,
  SwitchSelector,
} from "@/components";
import { useStatsPeriodNavigation } from "@/hooks";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { RatingLevel, TSentimentType } from "@/types";
import { trackEvent } from "@/utils";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { useStats } from "./hooks/useStats";

const ANALYTICS_EVENTS_MAP = {
  impact: {
    periodChangedEvent: ANALYTICS_EVENTS.IMPACTS_STATISTICS_PERIOD_CHANGED,
    periodChangeAttemptedEvent:
      ANALYTICS_EVENTS.IMPACTS_STATISTICS_PERIOD_CHANGE_ATTEMPTED,
    dateChangedEvent: ANALYTICS_EVENTS.IMPACTS_STATISTICS_DATE_CHANGED,
    screenViewedEvent: ANALYTICS_EVENTS.IMPACTS_STATISTICS_SCREEN_VIEWED,
  },
  emotion: {
    periodChangedEvent: ANALYTICS_EVENTS.EMOTIONS_STATISTICS_PERIOD_CHANGED,
    periodChangeAttemptedEvent:
      ANALYTICS_EVENTS.EMOTIONS_STATISTICS_PERIOD_CHANGE_ATTEMPTED,
    dateChangedEvent: ANALYTICS_EVENTS.EMOTIONS_STATISTICS_DATE_CHANGED,
    screenViewedEvent: ANALYTICS_EVENTS.EMOTIONS_STATISTICS_SCREEN_VIEWED,
  },
} as const;

const TITLE_MAP: Record<TSentimentType, string> = {
  impact: "impacts.impacts_statistics",
  emotion: "emotions.emotions_statistics",
};

export type SentimentStatsProps = {
  sentimentType: TSentimentType;
};

export const SentimentStats = ({ sentimentType }: SentimentStatsProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const [selectedMood, setSelectedMood] = useState<RatingLevel | null>(null);

  const { period, date, handlePeriodChange, handleDateChange } =
    useStatsPeriodNavigation(ANALYTICS_EVENTS_MAP[sentimentType]);

  const { statsData } = useStats({
    sentimentType,
    mood: selectedMood,
    period,
    date,
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS_MAP[sentimentType].screenViewedEvent);
  }, [sentimentType]);

  const paddingBottom = useMemo(() => {
    return insets.bottom + theme.layout.spacing.lg;
  }, [insets.bottom, theme.layout.spacing.lg]);

  const handleMoodSelect = (value: RatingLevel) => {
    setSelectedMood((prev) => (prev === value ? null : value));
  };

  return (
    <>
      <Header
        title={t(TITLE_MAP[sentimentType])}
        rightContent={
          <PeriodSelector period={period} onPress={handlePeriodChange} />
        }
      />
      <View style={styles.filters}>
        <PeriodNavigator
          date={date}
          period={period}
          onChangeDate={handleDateChange}
        />
        <SwitchSelector
          selectedValue={selectedMood}
          onChange={handleMoodSelect}
          options={RATING_VALUES.map((value) => ({
            label: <MoodIcon level={value} size="xs" />,
            value,
          }))}
        />
      </View>
      <Card style={[styles.content]} noPadding>
        <SentimentRatingList
          data={statsData.data}
          sentimentType={sentimentType}
          listStyle={{ paddingBottom }}
        />
      </Card>
    </>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    filters: {
      paddingHorizontal: theme.layout.spacing.lg,
      gap: theme.layout.spacing.md,
      marginBottom: theme.layout.spacing.md,
    },
    content: {
      flex: 1,
      borderBottomLeftRadius: 0,
      borderBottomRightRadius: 0,
    },
  });
