import {
  Card,
  Header,
  Placeholder,
  SentimentProgressItem,
  SentimentStatsFilter,
  StatInfoCard,
  TimePeriodSelect,
} from "@/components";
import { useAppSelector } from "@/store";
import { TTheme, useTheme } from "@/theme";
import { TLog, TSentimentType, TSortBy, TTimePeriod } from "@/types";
import { filterDataByTimePeriod, getImpacts, getImpactsStats } from "@/utils";
import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const ImpactsStats = () => {
  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const logsItems = useAppSelector((state) => state.logs.items);
  const impactDefsItems = useAppSelector(
    (state) => state.impactDefinitions.items
  );
  const cachedLogs = useRef<TLog[] | null>(null);
  const [impactsSortBy, setImpactsSortBy] = useState<TSortBy>("count");
  const [impactsType, setImpactsType] = useState<TSentimentType | null>(null);
  const [currentPeriod, setCurrentPeriod] = useState<TTimePeriod>("week");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentDate, setCurrentDate] = useState(dayjs());

  const styles = useMemo(() => createStyles(theme), [theme]);

  const filteredLogItems = useMemo(() => {
    const cachedData = cachedLogs.current;
    if (!isFocused && cachedData) return cachedData;
    const logs = Object.values(logsItems);
    const filtered = filterDataByTimePeriod(
      logs,
      "timestamp",
      currentPeriod,
      currentDate
    );
    cachedLogs.current = filtered;
    return filtered;
  }, [logsItems, isFocused, currentPeriod, currentDate]);

  const impactsStatsData = useMemo(() => {
    const impactLogItems = filteredLogItems.flatMap(
      (log) => log.values.impacts || []
    );
    const impacts = getImpacts(impactLogItems, impactDefsItems);
    return getImpactsStats(impacts, impactsSortBy);
  }, [filteredLogItems, impactDefsItems, impactsSortBy]);

  const positiveData = useMemo(() => {
    return impactsStatsData.filter((item) => item.type === "positive");
  }, [impactsStatsData]);

  const negativeData = useMemo(() => {
    return impactsStatsData.filter((item) => item.type === "negative");
  }, [impactsStatsData]);

  const dataToRender = useMemo(() => {
    if (impactsType === null) return impactsStatsData;
    return impactsType === "negative" ? negativeData : positiveData;
  }, [impactsType, negativeData, positiveData, impactsStatsData]);

  const paddingBottom = useMemo(() => {
    return insets.bottom + theme.layout.spacing.lg;
  }, [insets.bottom, theme.layout.spacing.lg]);

  const renderPlaceholder = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          paddingBottom: theme.layout.spacing.xl,
        }}
      >
        <Placeholder content={t("common.no_data")} />
      </View>
    );
  };

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

  const renderFilters = () => {
    return (
      <SentimentStatsFilter
        type={impactsType}
        onTypeChange={setImpactsType}
        sortBy={impactsSortBy}
        searchPlaceholder={t("impacts.search_impact")}
        onSortPress={() =>
          setImpactsSortBy((prev) => (prev === "count" ? "avg" : "count"))
        }
        query={searchQuery}
        onSearch={setSearchQuery}
      />
    );
  };

  const renderList = () => {
    return (
      <FlatList
        data={dataToRender}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={renderPlaceholder}
        contentContainerStyle={{
          gap: theme.layout.spacing.sm,
          paddingBottom,
          flexGrow: dataToRender.length === 0 ? 1 : 0,
        }}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => {
          const roundedAvg = Math.round(item.avg);
          return (
            <SentimentProgressItem
              key={item.id}
              level={roundedAvg}
              name={t(item.name)}
              category="impact"
              icon={item.icon}
              count={item.count}
              type={item.type}
            />
          );
        }}
      />
    );
  };

  const renderHeader = () => {
    return <Header title={t("impacts.impacts_statistics")} />;
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.periodSelect}>{renderTimePeriodSelector()}</View>
      <View
        style={{
          flexDirection: "row",
          gap: theme.layout.spacing.sm,
          padding: theme.layout.spacing.lg,
          paddingTop: 0,
        }}
      >
        <StatInfoCard
          label={t("impacts.negative_impacts")}
          value={negativeData.length}
        />
        <StatInfoCard
          label={t("impacts.positive_impacts")}
          value={positiveData.length}
        />
      </View>
      <Card style={{ flex: 1, paddingBottom: 0 }}>
        <View style={styles.filters}>{renderFilters()}</View>
        {renderList()}
      </Card>
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
    filters: {
      marginBottom: theme.layout.spacing.md,
    },
    wrapper: {
      flex: 1,
      paddingHorizontal: theme.layout.spacing.lg,
    },
  });
