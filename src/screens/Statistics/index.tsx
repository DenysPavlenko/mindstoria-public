import {
  HeaderTitle,
  HeaderTitleProps,
  MetricChart,
  MetricPagination,
  Placeholder,
  SafeView,
} from "@/components";
import { useAppSelector } from "@/store";
import {
  selectEntriesByTrackerId,
  selectMetricsByTrackerId,
} from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TrackerMetricType } from "@/types";
import {
  getFirstEntryDate,
  getLastEntryDate,
  getMissedDays,
  MONTH_DAY_FORMAT,
} from "@/utils";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import dayjs from "dayjs";
import { useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { InfoCard } from "./components/InfoCard";

interface StatisticsProps {
  trackerId: string;
}

type TInfoDataItem = {
  label: string;
  value: string | number;
  iconName: FeatherIconName;
};

export const Statistics = ({ trackerId }: StatisticsProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const { theme } = useTheme();
  const selectedEntries = useAppSelector((state) => {
    return selectEntriesByTrackerId(state, trackerId);
  });
  const [currentDate, setCurrentDate] = useState(() => {
    const lastEntryDate = getLastEntryDate(selectedEntries);
    return dayjs(lastEntryDate);
  });
  const metrics = useAppSelector((state) =>
    selectMetricsByTrackerId(state, trackerId)
  );
  // Create theme-aware styles (memoized for performance)
  const styles = useMemo(() => createStyles(theme), [theme]);

  const validMetrics = useMemo(() => {
    return metrics.filter((metric) => {
      return metric.type !== TrackerMetricType.Notes;
    });
  }, [metrics]);

  const renderHeaderTitle = useCallback(
    ({ tintColor }: HeaderTitleProps) => {
      return (
        <HeaderTitle tintColor={tintColor}>{t("statistics.title")}</HeaderTitle>
      );
    },
    [t]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: renderHeaderTitle,
    });
  }, [navigation, renderHeaderTitle]);

  const minDate = useMemo(() => {
    if (selectedEntries.length === 0) return dayjs();
    return dayjs(getFirstEntryDate(selectedEntries));
  }, [selectedEntries]);

  const maxDate = useMemo(() => {
    if (selectedEntries.length === 0) return dayjs();
    return dayjs(getLastEntryDate(selectedEntries));
  }, [selectedEntries]);

  const lastEntryDate = useMemo(() => {
    const date = getLastEntryDate(selectedEntries);
    if (!date) return "N/A";
    return dayjs(date).format(MONTH_DAY_FORMAT);
  }, [selectedEntries]);

  const firstEntryDate = useMemo(() => {
    const date = getFirstEntryDate(selectedEntries);
    if (!date) return "N/A";
    return dayjs(date).format(MONTH_DAY_FORMAT);
  }, [selectedEntries]);

  const missedDays = useMemo(() => {
    return getMissedDays(selectedEntries);
  }, [selectedEntries]);

  const infoData: TInfoDataItem[] = useMemo(() => {
    return [
      {
        label: t("statistics.total_records"),
        value: selectedEntries.length,
        iconName: "list",
      },
      {
        label: t("statistics.missed_days", { count: missedDays }),
        value: missedDays,
        iconName: "alert-circle",
      },
      {
        label: t("statistics.first_entry_date"),
        value: firstEntryDate,
        iconName: "calendar",
      },
      {
        label: t("statistics.last_entry_date"),
        value: lastEntryDate,
        iconName: "calendar",
      },
    ];
  }, [selectedEntries.length, missedDays, firstEntryDate, lastEntryDate, t]);

  const renderHeader = () => {
    return (
      <>
        <View style={styles.infoContainer}>
          {infoData.map((item) => {
            return (
              <View style={styles.infoCardContainer} key={item.label}>
                <InfoCard
                  label={item.label}
                  value={item.value}
                  iconName={item.iconName}
                />
              </View>
            );
          })}
        </View>
        {validMetrics.length > 0 && (
          <MetricPagination
            currentDate={currentDate}
            setCurrentDate={setCurrentDate}
            style={styles.pagination}
            minDate={minDate}
            maxDate={maxDate}
          />
        )}
      </>
    );
  };

  const renderPlaceholder = () => {
    return (
      <View style={styles.placeholder}>
        <Placeholder
          title={t("common.no_data")}
          content={t("statistics.notes_data")}
        />
      </View>
    );
  };

  const renderCharts = () => {
    return (
      <FlatList
        data={validMetrics}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderPlaceholder}
        ListHeaderComponent={renderHeader}
        renderItem={({ item }) => (
          <MetricChart
            metric={item}
            entries={selectedEntries}
            style={styles.chart}
            currentDate={currentDate}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <SafeView>
      <View style={styles.container}>{renderCharts()}</View>
    </SafeView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.layout.spacing.lg,
    },
    placeholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.layout.spacing.xl,
    },
    infoContainer: {
      flexWrap: "wrap",
      flexDirection: "row",
      justifyContent: "space-between",
      marginHorizontal: -theme.layout.spacing.md / 2,
      marginBottom: theme.layout.spacing.md / 2,
    },
    infoCardContainer: {
      width: "50%",
      padding: theme.layout.spacing.md / 2,
    },
    pagination: {
      marginBottom: theme.layout.spacing.md,
    },
    chart: {
      marginBottom: theme.layout.spacing.md,
    },
  });

export default Statistics;
