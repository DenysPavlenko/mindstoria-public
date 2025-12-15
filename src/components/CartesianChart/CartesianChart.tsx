import { useTheme, withAlpha } from "@/theme";
import { TChartDataPoint, TTimePeriod } from "@/types";
import { Nunito_400Regular } from "@expo-google-fonts/nunito";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import dayjs from "dayjs";
import { useMemo } from "react";
import {
  Area,
  Line,
  Scatter,
  useChartPressState,
  CartesianChart as VNCartesianChart,
} from "victory-native";
import { Tooltip } from "./components/Tooltip";

interface CartesianChartProps {
  data: TChartDataPoint[];
  period: TTimePeriod;
  variant?: "detailed" | "simple";
  yMin: number;
  yMax: number;
}

export const CartesianChart = ({
  data,
  period,
  variant = "detailed",
  yMin,
  yMax,
}: CartesianChartProps) => {
  const { theme } = useTheme();
  const font = useFont(Nunito_400Regular, 12);
  const { state, isActive } = useChartPressState({ x: "0", y: { value: 0 } });

  const tickCount = useMemo(() => {
    if (variant === "simple") {
      return { x: 0, y: 0 };
    }
    switch (period) {
      case "week":
        return { x: 7, y: 5 };
      case "month":
        return { x: 5, y: 5 };
      case "year":
        return { x: 12, y: 5 };
      default:
        return { x: 5, y: 5 };
    }
  }, [period, variant]);

  const domainPadding = useMemo(() => {
    if (variant === "detailed") {
      return { left: 10, right: 10, top: 10, bottom: 10 };
    }
    return { left: 0, right: 0, top: 2, bottom: 10 };
  }, [variant]);

  const formatXLabel = (value: string) => {
    if (period === "year") {
      return dayjs(value).format("M");
    }
    return dayjs(value).format("D");
  };

  return (
    <VNCartesianChart
      data={data}
      xKey="date"
      yKeys={["value"]}
      chartPressState={state}
      domain={{ y: [yMin, yMax] }}
      domainPadding={domainPadding}
      frame={{ lineWidth: 0 }}
      axisOptions={{
        font,
        tickCount,
        lineWidth: variant === "detailed" ? 0.5 : 0,
        lineColor: withAlpha(theme.colors.outline, 0.25),
        labelColor: theme.colors.onSurface,
        formatXLabel,
      }}
      renderOutside={({ chartBounds }) => {
        if (!isActive || variant === "simple") return null;
        return (
          <Tooltip
            xPosition={state.x.position}
            yPosition={state.y.value.position}
            textColor={theme.colors.onPrimary}
            backgroundColor={theme.colors.primary}
            bottom={chartBounds.bottom}
            activeValue={state.y.value.value}
            activeXValue={state.x.value}
            lineColor={withAlpha(theme.colors.outline, 0.5)}
            indicatorColor={theme.colors.primary}
            topOffset={18}
            chartBounds={chartBounds}
            isYearly={period === "year"}
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
              withAlpha(theme.colors.primaryContainer, 0.2),
            ]}
          />
          {variant === "detailed" && (
            <Scatter
              points={points.value}
              color={theme.colors.primary}
              radius={3}
            />
          )}
        </>
      )}
    </VNCartesianChart>
  );
};
