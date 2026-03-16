import { RATING_VALUES } from "@/appConstants";
import { useTheme } from "@/providers";
import { TTheme, withAlpha } from "@/theme";
import { TChartDataPoint, TTimePeriod } from "@/types";
import { Nunito_400Regular } from "@expo-google-fonts/nunito";
import { LinearGradient, useFont, vec } from "@shopify/react-native-skia";
import dayjs from "dayjs";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import {
  Area,
  Line,
  Scatter,
  useChartPressState,
  CartesianChart as VNCartesianChart,
} from "victory-native";
import { Tooltip } from "./components/Tooltip";

const CHART_HEIGHT = 180;

interface CartesianChartProps {
  data: TChartDataPoint[];
  period: TTimePeriod;
  yMin: number;
  yMax: number;
  variant?: "detailed" | "simple";
  withSentiment?: boolean;
  height?: number;
  customYLabel?: (value: number) => React.ReactNode;
}

export const CartesianChart = ({
  data,
  period,
  yMin,
  yMax,
  withSentiment,
  height = CHART_HEIGHT,
  customYLabel,
}: CartesianChartProps) => {
  const { theme } = useTheme();
  const font = useFont(Nunito_400Regular, 12);
  const { state, isActive } = useChartPressState({ x: "0", y: { value: 0 } });

  const styles = useMemo(() => createStyles(theme, height), [theme, height]);

  const tickCount = useMemo(() => {
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
  }, [period]);

  const domainPadding = useMemo(() => {
    return { left: 10, right: 10, top: 10, bottom: 10 };
  }, []);

  const formatXLabel = (value: string) => {
    if (period === "year") {
      return dayjs(value).format("M");
    }
    return dayjs(value).format("D");
  };

  const renderYLabels = () => {
    if (!customYLabel) return null;
    return (
      <View style={styles.yAxisIcons}>
        {/* TEMPORARY HARDCODED SOLUTION */}
        {[...RATING_VALUES].reverse().map((value) => {
          return <View key={value}>{customYLabel(value)}</View>;
        })}
      </View>
    );
  };

  return (
    <View style={[styles.container, { height }]}>
      {renderYLabels()}
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
          lineWidth: {
            grid: { x: 0, y: 0.5 },
            frame: 0,
          },
          lineColor: withAlpha(theme.colors.outline, 0.2),
          labelColor: theme.colors.onSurface,
          formatXLabel,
          formatYLabel: customYLabel ? () => "" : undefined,
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
            <Scatter
              points={points.value}
              color={theme.colors.primary}
              radius={3}
            />
          </>
        )}
      </VNCartesianChart>
    </View>
  );
};

const createStyles = (theme: TTheme, height: number) => {
  return StyleSheet.create({
    container: {
      position: "relative",
    },
    yAxisIcons: {
      position: "absolute",
      height: height - 36, // 36 is the bottom padding of the chart
      top: 8,
      left: 0,
      justifyContent: "space-between",
    },
  });
};
