import {
  Card,
  Header,
  Placeholder,
  SentimentIconButton,
  SentimentStatsFilter,
  StatInfoCard,
  TimePeriodSelect,
} from "@/components";
import { SentimentList } from "@/components/SentimentList/SentimentList";
import { useAppSelector } from "@/store";
import { TTheme, useTheme } from "@/theme";
import { TEmotionStatsItem, TLog, TSentimentType, TTimePeriod } from "@/types";
import { filterDataByTimePeriod, getEmotions, getEmotionsStats } from "@/utils";
import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import { useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const EmotionsStats = () => {
  const { theme } = useTheme();
  const isFocused = useIsFocused();
  const { t } = useTranslation();
  const insets = useSafeAreaInsets();
  const logsItems = useAppSelector((state) => state.logs.items);
  const emotionDefsItems = useAppSelector(
    (state) => state.emotionDefinitions.items
  );
  const cachedLogs = useRef<TLog[] | null>(null);
  const [emotionsType, setEmotionsType] = useState<TSentimentType | null>(null);
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

  const emotionsStatsData = useMemo(() => {
    const emotionLogItems = filteredLogItems.flatMap(
      (log) => log.values.emotions || []
    );
    const emotions = getEmotions(emotionLogItems, emotionDefsItems);
    return getEmotionsStats(emotions);
  }, [filteredLogItems, emotionDefsItems]);

  const positiveData = useMemo(() => {
    return emotionsStatsData.filter((item) => item.type === "positive");
  }, [emotionsStatsData]);

  const negativeData = useMemo(() => {
    return emotionsStatsData.filter((item) => item.type === "negative");
  }, [emotionsStatsData]);

  const dataToRender = useMemo(() => {
    if (emotionsType === null) return emotionsStatsData;
    return emotionsType === "negative" ? negativeData : positiveData;
  }, [emotionsType, negativeData, positiveData, emotionsStatsData]);

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
        type={emotionsType}
        onTypeChange={setEmotionsType}
        searchPlaceholder={t("emotions.search_emotion")}
        query={searchQuery}
        onSearch={setSearchQuery}
      />
    );
  };

  const renderItem = ({ item }: { item: TEmotionStatsItem }) => {
    return (
      <SentimentIconButton
        title={t(item.name)}
        icon={item.icon}
        isArchived={item.isArchived}
        category="emotion"
        counter={item.count}
        type={item.type}
      />
    );
  };

  const renderList = () => {
    return (
      <SentimentList
        data={dataToRender}
        renderItem={renderItem}
        ListEmptyComponent={renderPlaceholder}
        keyExtractor={(item) => item.id}
        style={{
          paddingBottom,
          flexGrow: dataToRender.length === 0 ? 1 : 0,
        }}
      />
    );
  };

  const renderHeader = () => {
    return <Header title={t("emotions.emotions_statistics")} />;
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
          label={t("emotions.negative_emotions")}
          value={negativeData.length}
        />
        <StatInfoCard
          label={t("emotions.positive_emotions")}
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
