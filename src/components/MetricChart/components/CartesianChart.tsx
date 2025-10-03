import { useTheme, withAlpha } from "@/theme";
import { TMetricDataItem, TrackerMetricType, TTrackerMetric } from "@/types";
import { formatDuration, formatTime, MONTH_DAY_FORMAT } from "@/utils";
import { Manrope_400Regular } from "@expo-google-fonts/manrope/400Regular";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import {
  Area,
  Line,
  Scatter,
  useChartPressState,
  CartesianChart as VNCartesianChart,
} from "victory-native";
import { Tooltip } from "./Tooltip";

interface CartesianChartProps {
  data: TMetricDataItem[];
  metric: TTrackerMetric;
  yMin: number;
  yMax: number;
}

export const CartesianChart = ({
  data,
  yMin,
  yMax,
  metric,
}: CartesianChartProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const font = useFont(Manrope_400Regular, 12);
  const { state, isActive } = useChartPressState({ x: "0", y: { value: 0 } });

  return (
    <VNCartesianChart
      data={data}
      xKey="date"
      yKeys={["value"]}
      domain={{ y: [yMin, yMax] }}
      chartPressState={state}
      domainPadding={{ left: 10, right: 10, top: 10, bottom: 10 }}
      axisOptions={{
        font,
        tickCount: { x: 5, y: 5 },
        lineColor: withAlpha(theme.colors.onBackground, 0.25),
        labelColor: theme.colors.onSurface,
        formatXLabel: (value) => dayjs(value).format(MONTH_DAY_FORMAT),
        formatYLabel: (value) => {
          if (typeof value !== "number") {
            return String(value);
          }
          switch (metric.type) {
            case TrackerMetricType.Duration:
              return formatDuration(value, t);
            case TrackerMetricType.Time:
              const hideSeconds = true;
              return formatTime(value, hideSeconds);
            default:
              return String(value);
          }
        },
      }}
      renderOutside={({ chartBounds }) => {
        if (!isActive) return null;
        return (
          <Tooltip
            xPosition={state.x.position}
            yPosition={state.y.value.position}
            textColor={theme.colors.onPrimary}
            backgroundColor={theme.colors.primary}
            bottom={chartBounds.bottom}
            activeValue={state.y.value.value}
            activeXValue={state.x.value}
            lineColor={withAlpha(theme.colors.onBackground, 0.8)}
            indicatorColor={theme.colors.primary}
            metric={metric}
            topOffset={18}
            chartBounds={chartBounds}
          />
        );
      }}
    >
      {({ points, chartBounds }) => (
        <>
          <Line
            points={points.value}
            color={theme.colors.primary}
            strokeWidth={2}
            curveType="monotoneX"
            connectMissingData
          />
          <Area
            points={points.value}
            y0={chartBounds.bottom}
            curveType="monotoneX"
            connectMissingData
          />
          <LinearGradient
            start={vec(0, chartBounds.top)} // Gradient start position
            end={vec(0, chartBounds.bottom)} // Gradient end position
            colors={[
              withAlpha(theme.colors.primaryContainer, 1),
              withAlpha(theme.colors.primaryContainer, 0.3),
            ]}
          />
          <Scatter
            points={points.value}
            color={theme.colors.primary}
            radius={3}
          />
        </>
      )}
    </VNCartesianChart>
  );
};
