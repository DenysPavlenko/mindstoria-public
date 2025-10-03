import { TTheme, useTheme } from "@/theme";
import { TEntry, TrackerMetricType, TTrackerMetric } from "@/types";
import { CALENDAR_DATE_FORMAT, getMetricChartData } from "@/utils";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Card } from "../Card/Card";
import { Typography } from "../Typography/Typography";
import { BarChart } from "./components/BarChart";
import { CartesianChart } from "./components/CartesianChart";

const CHART_HEIGHT = 180;

interface MetricChartProps {
  metric: TTrackerMetric;
  entries: TEntry[];
  currentDate: Dayjs;
  style?: StyleProp<ViewStyle>;
}

export const MetricChart = ({
  metric,
  entries,
  style,
  currentDate,
}: MetricChartProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const data = useMemo(() => {
    return getMetricChartData(entries, metric);
  }, [entries, metric]);

  // Generate all dates for the current month
  const monthDates = useMemo(() => {
    const daysInMonth = currentDate.daysInMonth();
    return Array.from({ length: daysInMonth }, (_, i) =>
      currentDate.startOf("month").add(i, "day").format(CALENDAR_DATE_FORMAT)
    );
  }, [currentDate]);

  // Merge with data, fill missing days with null
  const dataMap = useMemo(() => {
    return Object.fromEntries(
      data.map((d) => [dayjs(d.date).format(CALENDAR_DATE_FORMAT), d.value])
    );
  }, [data]);

  const pagedData = useMemo(() => {
    return monthDates.map((date) => {
      const value = dataMap[date] !== undefined ? dataMap[date] : null;
      return { date, value };
    });
  }, [monthDates, dataMap]);

  const yRange = useMemo(() => {
    if (metric.config?.range) {
      return { min: metric.config.range[0], max: metric.config.range[1] };
    }
    const values = pagedData
      .map((d) => d.value)
      .filter((v) => v !== null) as number[];
    const min = Math.min(...values);
    return {
      min: min >= 0 ? 0 : min,
      max: Math.max(...values),
    };
  }, [pagedData, metric]);

  const hasCurrentMonthData = useMemo(() => {
    return pagedData.filter((d) => d.value !== null).length > 1;
  }, [pagedData]);

  const renderPlaceholder = () => {
    return (
      <View style={styles.placeholder}>
        <Typography align="center">
          {t("statistics.not_enough_data")}
        </Typography>
      </View>
    );
  };

  const renderChart = () => {
    if (!hasCurrentMonthData) {
      return renderPlaceholder();
    }
    const isBoolChart = metric.type === TrackerMetricType.Boolean;
    if (isBoolChart) {
      return (
        <View style={styles.chart}>
          <BarChart data={pagedData} metric={metric} />
        </View>
      );
    } else {
      return (
        <View style={styles.chart}>
          <CartesianChart
            data={pagedData}
            yMin={yRange.min}
            yMax={yRange.max}
            metric={metric}
          />
        </View>
      );
    }
  };

  return (
    <View style={[styles.container, style]}>
      <Card>
        <Typography variant="h3" style={styles.label}>
          {metric.label}
        </Typography>
        {renderChart()}
      </Card>
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      justifyContent: "center",
    },
    placeholder: {
      maxWidth: 180,
      height: CHART_HEIGHT,
      paddingBottom: theme.layout.spacing.xxl,
      marginHorizontal: "auto",
      justifyContent: "center",
      alignItems: "center",
    },
    chart: {
      height: CHART_HEIGHT,
      marginBottom: theme.layout.spacing.lg,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.layout.spacing.lg,
    },
    label: {
      marginBottom: theme.layout.spacing.lg,
    },
  });

export default MetricChart;
