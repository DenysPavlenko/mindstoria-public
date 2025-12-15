import {
  Header,
  MedsChart,
  SentimentStatsView,
  SleepLogsChart,
  TAB_BAR_HEIGHT,
  TimePeriodSelect,
  WellbeingLogsChart,
} from "@/components";
import { useAppSelector } from "@/store";
import { TTheme, useTheme } from "@/theme";
import { TTimePeriod } from "@/types";
import {
  filterDataByTimePeriod,
  getEmotions,
  getEmotionsStats,
  getImpacts,
  getImpactsStats,
  getMedicationsChartData,
  getSleepLogChartDataMap,
  getTakenMedications,
  getWellbeingChartDataMap,
} from "@/utils";
import dayjs from "dayjs";
import { useCallback, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const Statistics = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const { showMedications } = useAppSelector((state) => state.settings);
  const logsItems = useAppSelector((state) => state.logs.items);
  const medicationsItems = useAppSelector((state) => state.medications.items);
  const sleepLogsItems = useAppSelector((state) => state.sleepLogs.items);
  const medLogsItems = useAppSelector((state) => state.medLogs.items);
  const impactDefsItems = useAppSelector(
    (state) => state.impactDefinitions.items
  );
  const emotionDefsItems = useAppSelector(
    (state) => state.emotionDefinitions.items
  );
  const [currentPeriod, setCurrentPeriod] = useState<TTimePeriod>("week");
  const [currentDate, setCurrentDate] = useState(dayjs());

  const styles = useMemo(() => createStyles(theme), [theme]);

  const filteredLogItems = useMemo(() => {
    const logs = Object.values(logsItems);
    const filtered = filterDataByTimePeriod(
      logs,
      "timestamp",
      currentPeriod,
      currentDate
    );
    return filtered;
  }, [logsItems, currentPeriod, currentDate]);

  const wellbeingChartDataMap = useMemo(() => {
    return getWellbeingChartDataMap(filteredLogItems, currentPeriod);
  }, [filteredLogItems, currentPeriod]);

  const sleepLogsChartDataMap = useMemo(() => {
    const sleepLogs = Object.values(sleepLogsItems);
    const filteredLogs = filterDataByTimePeriod(
      sleepLogs,
      "timestamp",
      currentPeriod,
      currentDate
    );
    const data = getSleepLogChartDataMap(filteredLogs, currentPeriod);
    return data;
  }, [sleepLogsItems, currentPeriod, currentDate]);

  const medicationsChartData = useMemo(() => {
    if (!showMedications) return {};
    const medLogs = Object.values(medLogsItems);
    const filteredLogs = filterDataByTimePeriod(
      medLogs,
      "timestamp",
      currentPeriod,
      currentDate
    );
    const takenMeds = getTakenMedications(filteredLogs, medicationsItems);
    const data = getMedicationsChartData(takenMeds, currentPeriod);
    return data;
  }, [
    showMedications,
    medLogsItems,
    medicationsItems,
    currentPeriod,
    currentDate,
  ]);

  const impactsStatsData = useMemo(() => {
    const impactLogItems = filteredLogItems.flatMap(
      (log) => log.values.impacts || []
    );
    const impacts = getImpacts(impactLogItems, impactDefsItems);
    return getImpactsStats(impacts);
  }, [filteredLogItems, impactDefsItems]);

  const emotionsStatsData = useMemo(() => {
    const emotionLogItems = filteredLogItems.flatMap(
      (log) => log.values.emotions || []
    );
    const emotions = getEmotions(emotionLogItems, emotionDefsItems);
    return getEmotionsStats(emotions);
  }, [filteredLogItems, emotionDefsItems]);

  const paddingBottom = useMemo(() => {
    return insets.bottom + TAB_BAR_HEIGHT + theme.layout.spacing.lg;
  }, [insets.bottom, theme.layout.spacing.lg]);

  const renderTimePeriodSelector = () => {
    return (
      <TimePeriodSelect
        date={currentDate}
        period={currentPeriod}
        onChangePeriod={setCurrentPeriod}
        onChangeDate={setCurrentDate}
      />
    );
  };

  const renderWellbeingChart = useCallback(() => {
    return (
      <WellbeingLogsChart
        dataMap={wellbeingChartDataMap}
        currentDate={currentDate}
        period={currentPeriod}
      />
    );
  }, [wellbeingChartDataMap, currentDate, currentPeriod]);

  const renderSleepLogsChart = useCallback(() => {
    return (
      <SleepLogsChart
        dataMap={sleepLogsChartDataMap}
        currentDate={currentDate}
        period={currentPeriod}
      />
    );
  }, [sleepLogsChartDataMap, currentDate, currentPeriod]);

  const renderMedLogsCard = useCallback(() => {
    if (!showMedications) return null;
    return (
      <MedsChart
        data={medicationsChartData}
        currentDate={currentDate}
        period={currentPeriod}
      />
    );
  }, [medicationsChartData, currentDate, currentPeriod, showMedications]);

  const renderImpactsStats = useCallback(() => {
    return (
      <SentimentStatsView
        title={t("impacts.impacts_count")}
        data={impactsStatsData}
        category="impact"
      />
    );
  }, [impactsStatsData, t]);

  const renderEmotionsStats = useCallback(() => {
    return (
      <SentimentStatsView
        title={t("emotions.emotions_count")}
        data={emotionsStatsData}
        category="emotion"
      />
    );
  }, [emotionsStatsData, t]);

  const listData = useMemo(() => {
    return [
      {
        key: "sleepQuality",
        renderItem: () => renderSleepLogsChart(),
      },
      {
        key: "wellbeing",
        renderItem: () => renderWellbeingChart(),
      },
      {
        key: "medications",
        renderItem: () => renderMedLogsCard(),
      },
      {
        key: "impactsStats",
        renderItem: () => renderImpactsStats(),
      },
      {
        key: "emotionsStats",
        renderItem: () => renderEmotionsStats(),
      },
    ];
  }, [
    renderWellbeingChart,
    renderSleepLogsChart,
    renderMedLogsCard,
    renderImpactsStats,
    renderEmotionsStats,
  ]);

  const renderList = () => {
    return (
      <FlatList
        data={listData}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          gap: theme.layout.spacing.sm,
          paddingBottom,
        }}
        keyExtractor={(item) => item.key}
        renderItem={({ item }) => item.renderItem()}
      />
    );
  };

  const renderHeader = () => {
    return <Header title={t("statistics.title")} />;
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.periodSelect}>{renderTimePeriodSelector()}</View>
      <View style={styles.wrapper}>{renderList()}</View>
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    periodSelect: {
      padding: theme.layout.spacing.lg,
      paddingTop: 0,
    },
    wrapper: {
      flex: 1,
      paddingHorizontal: theme.layout.spacing.lg,
    },
    impactsSection: {
      flex: 1,
      padding: theme.layout.spacing.lg,
      paddingTop: 0,
    },
    placeholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.layout.spacing.xl,
    },
    impactsSectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.layout.spacing.md,
      justifyContent: "space-between",
      marginBottom: theme.layout.spacing.md,
    },
  });
