import PillIcon from "@/assets/feather/pill.svg";
import { useTheme } from "@/providers";
import { useAppSelector } from "@/store";
import { TTheme } from "@/theme";
import { TChartDataPoint, TTimePeriod } from "@/types";
import { generatePeriodDatesForCharts } from "@/utils";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { Dayjs } from "dayjs";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { CartesianChart } from "../CartesianChart/CartesianChart";
import { ChartCard } from "../ChartCard/ChartCard";
import { Chip } from "../Chip/Chip";
import { Typography } from "../Typography/Typography";

interface MedsChartProps {
  data: Record<string, TChartDataPoint[]>;
  period: TTimePeriod;
  currentDate: Dayjs;
  style?: StyleProp<ViewStyle>;
  onPress?: () => void;
}

export const MedsChart = ({
  data,
  currentDate,
  period,
  style,
  onPress,
}: MedsChartProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const availableMedIds = useMemo(() => Object.keys(data), [data]);
  const medications = useAppSelector((state) => state.medications.items);
  const [selectedMedId, setSelectedMedId] = useState<string | null>(null);

  useEffect(() => {
    if (!selectedMedId) {
      setSelectedMedId(availableMedIds[0] || null);
    }
  }, [availableMedIds, selectedMedId]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  // Generate all dates for the week period
  const dates = useMemo(() => {
    return generatePeriodDatesForCharts(period, currentDate);
  }, [period, currentDate]);

  // Merge with data, fill missing days with null
  const dataMap = useMemo(() => {
    const map = new Map<string, number | null>();
    if (!selectedMedId) return map;
    data[selectedMedId]?.forEach((d) => {
      map.set(d.date, d.value);
    });
    return map;
  }, [data, selectedMedId]);

  const pagedData = useMemo(() => {
    return dates.map((date) => {
      const value = dataMap.get(date) ?? null;
      return { date, value };
    });
  }, [dates, dataMap]);

  const hasData = useMemo(() => {
    return pagedData.filter((d) => d.value !== null).length > 0;
  }, [pagedData]);

  const maxValue = useMemo(() => {
    const values = pagedData
      .map((d) => d.value)
      .filter((v): v is number => v !== null);
    return values.length > 0 ? Math.max(...values) : 100;
  }, [pagedData]);

  const renderInfo = () => {
    return (
      <View style={styles.info}>
        <Typography variant="h5">{t("medications.title")}</Typography>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: theme.layout.spacing.xs }}
        >
          {Object.keys(data).map((medId) => {
            const { name, isActive, isArchived } = medications[medId] || {};
            let icon: FeatherIconName | undefined = undefined;
            if (isArchived) {
              icon = "archive";
            } else if (!isActive) {
              icon = "eye-off";
            }
            return (
              <Chip
                key={medId}
                label={name}
                icon={icon}
                minHeight="xs"
                selected={medId === selectedMedId}
                onPress={() => setSelectedMedId(medId)}
              />
            );
          })}
        </ScrollView>
      </View>
    );
  };

  const renderChart = () => {
    return (
      <CartesianChart
        period={period}
        data={pagedData}
        yMin={0}
        yMax={maxValue}
      />
    );
  };

  const iconSize = theme.layout.size.lg * 0.45;

  return (
    <ChartCard
      customIcon={
        <PillIcon
          width={iconSize}
          height={iconSize}
          color={theme.colors.onSurface}
        />
      }
      info={renderInfo()}
      chart={renderChart()}
      hasData={hasData}
      onPress={onPress}
      style={style}
    />
  );
};

const createStyles = (theme: TTheme) => {
  return StyleSheet.create({
    info: {
      width: "110%",
      gap: theme.layout.spacing.xxs,
    },
  });
};
