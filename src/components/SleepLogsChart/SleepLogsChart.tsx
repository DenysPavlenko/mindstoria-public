import { RANGE_MAX_LEVEL, RANGE_MIN_LEVEL } from "@/appConstants";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TChartDataMap, TTimePeriod } from "@/types";
import { generatePeriodDatesForCharts, getRatingLevelColor } from "@/utils";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { CartesianChart } from "../CartesianChart/CartesianChart";
import { ChartCard } from "../ChartCard/ChartCard";
import { Typography } from "../Typography/Typography";

interface SleepLogsChartProps {
  dataMap: TChartDataMap;
  currentDate: dayjs.Dayjs;
  period: TTimePeriod;
  onPress?: () => void;
  variant?: "detailed" | "simple";
  style?: StyleProp<ViewStyle>;
}

export const SleepLogsChart = ({
  dataMap,
  currentDate,
  period,
  style,
  onPress,
  variant = "detailed",
}: SleepLogsChartProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  // Generate all dates for the week period
  const dates = useMemo(() => {
    return generatePeriodDatesForCharts(period, currentDate);
  }, [period, currentDate]);

  const pagedData = useMemo(() => {
    return dates.map((date) => {
      const value = dataMap.data[date] ?? null;
      return { date, value };
    });
  }, [dates, dataMap]);

  const hasData = useMemo(() => {
    return pagedData.filter((d) => d.value !== null).length > 0;
  }, [pagedData]);

  const renderInfo = () => {
    return (
      <>
        <Typography variant="h5">{t("sleep.quality")}</Typography>
        {hasData && dataMap.average !== null && (
          <Typography variant="smallBold">
            {t("common.avg", { count: Number(dataMap.average.toFixed(1)) })}
          </Typography>
        )}
      </>
    );
  };

  const renderChart = () => {
    return (
      <CartesianChart
        data={pagedData}
        period={period}
        yMin={RANGE_MIN_LEVEL}
        yMax={RANGE_MAX_LEVEL}
        variant={variant}
        customYLabel={(tick) => {
          const color = getRatingLevelColor(tick, theme);
          return (
            <View style={[styles.dot, { backgroundColor: color }]}>
              <Typography
                variant="extraTinySemibold"
                color="surface"
                style={{ fontSize: 9 }}
              >
                {tick}
              </Typography>
            </View>
          );
        }}
      />
    );
  };

  return (
    <ChartCard
      iconName="moon"
      info={renderInfo()}
      chart={renderChart()}
      hasData={hasData}
      onPress={onPress}
      style={style}
    />
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    dot: {
      width: theme.layout.size.xxs,
      height: theme.layout.size.xxs,
      borderRadius: theme.layout.size.xxs / 2,
      justifyContent: "center",
      alignItems: "center",
    },
  });
