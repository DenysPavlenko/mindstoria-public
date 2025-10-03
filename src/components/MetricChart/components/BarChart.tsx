import { useTheme, withAlpha } from "@/theme";
import { TMetricDataItem, TTrackerMetric } from "@/types";
import { MONTH_DAY_FORMAT } from "@/utils";
import { Manrope_400Regular } from "@expo-google-fonts/manrope/400Regular";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import dayjs from "dayjs";
import { useTranslation } from "react-i18next";
import { Bar, CartesianChart, useChartPressState } from "victory-native";
import { Tooltip } from "./Tooltip";

interface BarChartProps {
  data: TMetricDataItem[];
  metric: TTrackerMetric;
}

export const BarChart = ({ data, metric }: BarChartProps) => {
  const { theme } = useTheme();
  const font = useFont(Manrope_400Regular, 12);
  const { state, isActive } = useChartPressState({ x: "0", y: { value: 0 } });
  const { t } = useTranslation();

  return (
    <CartesianChart
      data={data}
      xKey="date"
      yKeys={["value"]}
      domainPadding={{ left: 10, right: 10, top: 10, bottom: 10 }}
      domain={{ y: [0, 1] }}
      chartPressState={state}
      axisOptions={{
        font,
        tickCount: { x: 5, y: 2 },
        lineColor: withAlpha(theme.colors.onBackground, 0.25),
        labelColor: theme.colors.onBackground,
        formatXLabel: (value) => dayjs(value).format(MONTH_DAY_FORMAT),
        formatYLabel: (value) => {
          return value === 1
            ? t("common.yes")
            : value === 0
            ? t("common.no")
            : "";
        },
      }}
      renderOutside={({ chartBounds }) => {
        if (!isActive) return null;
        return (
          <Tooltip
            xPosition={state.x.position}
            yPosition={state.y.value.position}
            bottom={chartBounds.bottom}
            activeValue={state.x.value}
            lineColor={withAlpha(theme.colors.onBackground, 0.8)}
            indicatorColor={theme.colors.primary}
            metric={metric}
            textColor={theme.colors.onPrimary}
            backgroundColor={theme.colors.primary}
            activeXValue={state.x.value}
            topOffset={18}
            showLine={false}
            chartBounds={chartBounds}
            showBottomText={false}
          />
        );
      }}
    >
      {({ points, chartBounds }) => (
        <>
          <Bar
            points={points.value}
            chartBounds={chartBounds}
            color={theme.colors.primary}
            roundedCorners={{ topLeft: 10, topRight: 10 }}
          >
            <LinearGradient
              start={vec(0, chartBounds.top)} // Gradient start position
              end={vec(0, chartBounds.bottom)} // Gradient end position
              colors={[
                withAlpha(theme.colors.primary, 1),
                withAlpha(theme.colors.primary, 0.3),
              ]}
            />
          </Bar>
        </>
      )}
    </CartesianChart>
  );
};
