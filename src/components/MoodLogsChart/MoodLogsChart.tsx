import { RANGE_MAX_LEVEL, RANGE_MIN_LEVEL } from "@/appConstants";
import { TChartDataMap, TTimePeriod } from "@/types";
import { generatePeriodDatesForCharts } from "@/utils";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, ViewStyle } from "react-native";
import { CartesianChart } from "../CartesianChart/CartesianChart";
import { ChartCard } from "../ChartCard/ChartCard";
import { MoodIcon } from "../MoodIcon/MoodIcon";
import { Typography } from "../Typography/Typography";

interface MoodLogsChartProps {
  dataMap: TChartDataMap;
  currentDate: dayjs.Dayjs;
  period: TTimePeriod;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const MoodLogsChart = ({
  dataMap,
  currentDate,
  period,
  style,
  onPress,
}: MoodLogsChartProps) => {
  const { t } = useTranslation();

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
        <Typography variant="h5">{t("mood.title")}</Typography>
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
        customYLabel={(tick) => {
          return <MoodIcon level={tick} size="xxs" />;
        }}
      />
    );
  };

  return (
    <ChartCard
      iconName="heart"
      info={renderInfo()}
      chart={renderChart()}
      hasData={hasData}
      onPress={onPress}
      style={style}
    />
  );
};
