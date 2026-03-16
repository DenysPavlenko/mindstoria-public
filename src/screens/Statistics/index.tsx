import { ANALYTICS_EVENTS } from "@/analytics-constants";
import {
  Header,
  MedsChart,
  MoodLogsChart,
  PeriodNavigator,
  PeriodSelector,
  SentimentStatsCard,
  SleepLogsChart,
} from "@/components";
import { useStatsPeriodNavigation } from "@/hooks";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { StatsOverview } from "./components/StatsOverview";
import { useStats } from "./hooks/useStats";

export const Statistics = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const { period, date, handlePeriodChange, handleDateChange } =
    useStatsPeriodNavigation({
      periodChangedEvent: ANALYTICS_EVENTS.MOOD_STATISTICS_PERIOD_CHANGED,
      periodChangeAttemptedEvent:
        ANALYTICS_EVENTS.MOOD_STATISTICS_PERIOD_CHANGE_ATTEMPTED,
      dateChangedEvent: ANALYTICS_EVENTS.MOOD_STATISTICS_DATE_CHANGED,
    });

  const {
    wellbeingChartData,
    sleepChartData,
    medsChartData,
    impactsStats,
    emotionsStats,
  } = useStats(period, date);

  const listData = useMemo(() => {
    const items = [
      {
        key: "stats",
        component: (
          <StatsOverview
            wellbeingCount={wellbeingChartData.totalEntries}
            sleepCount={sleepChartData.totalEntries}
            impactsCount={impactsStats.totalCount}
            emotionsCount={emotionsStats.totalCount}
          />
        ),
      },
      {
        key: "mood",
        component: (
          <MoodLogsChart
            dataMap={wellbeingChartData}
            currentDate={date}
            period={period}
          />
        ),
      },
      {
        key: "sleepQuality",
        component: (
          <SleepLogsChart
            dataMap={sleepChartData}
            currentDate={date}
            period={period}
          />
        ),
      },
      {
        key: "impactsStats",
        component: (
          <SentimentStatsCard
            title={t("impacts.top_impacts")}
            stats={impactsStats}
            sentimentType="impact"
          />
        ),
      },
      {
        key: "emotionsStats",
        component: (
          <SentimentStatsCard
            title={t("emotions.top_emotions")}
            stats={emotionsStats}
            sentimentType="emotion"
          />
        ),
      },
    ];

    if (medsChartData) {
      items.splice(3, 0, {
        key: "medications",
        component: (
          <MedsChart data={medsChartData} currentDate={date} period={period} />
        ),
      });
    }

    return items;
  }, [
    wellbeingChartData,
    sleepChartData,
    medsChartData,
    impactsStats,
    emotionsStats,
    date,
    period,
    t,
  ]);

  return (
    <View style={styles.container}>
      <Header
        title={t("statistics.title")}
        rightContent={
          <PeriodSelector period={period} onPress={handlePeriodChange} />
        }
      />
      <View style={styles.periodNavigator}>
        <PeriodNavigator
          date={date}
          period={period}
          onChangeDate={handleDateChange}
        />
      </View>
      <View style={styles.wrapper}>
        <FlatList
          data={listData}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{
            gap: theme.layout.spacing.sm,
            paddingBottom: insets.bottom + theme.layout.spacing.lg,
          }}
          keyExtractor={(item) => item.key}
          renderItem={({ item }) => item.component}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    periodNavigator: {
      padding: theme.layout.spacing.lg,
      paddingTop: theme.layout.spacing.xs,
    },
    wrapper: {
      flex: 1,
      paddingHorizontal: theme.layout.spacing.lg,
    },
  });
