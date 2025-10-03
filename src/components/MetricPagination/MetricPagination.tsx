import { TTheme, useTheme } from "@/theme";
import { MONTH_YEAR_FORMAT } from "@/utils";
import { Dayjs } from "dayjs";
import { useMemo } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { Card } from "../Card/Card";
import { IconButton } from "../IconButton/IconButton";
import { Typography } from "../Typography/Typography";

interface MetricPaginationProps {
  currentDate: Dayjs; // 0 = January, 11 = December
  minDate: Dayjs | null;
  maxDate: Dayjs | null;
  setCurrentDate: (date: Dayjs) => void;
  style?: StyleProp<ViewStyle>;
}

export const MetricPagination = ({
  currentDate,
  setCurrentDate,
  minDate,
  maxDate,
  style,
}: MetricPaginationProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const canGoPrev =
    !minDate ||
    currentDate.isAfter(minDate, "month") ||
    currentDate.isAfter(minDate, "year");
  const canGoNext =
    !maxDate ||
    currentDate.isBefore(maxDate, "month") ||
    currentDate.isBefore(maxDate, "year");

  const handlePrev = () => {
    if (canGoPrev) {
      setCurrentDate(currentDate.subtract(1, "month"));
    }
  };
  const handleNext = () => {
    if (canGoNext) {
      setCurrentDate(currentDate.add(1, "month"));
    }
  };

  return (
    <Card cardStyle={[styles.container, style]}>
      <IconButton
        icon="chevron-left"
        size="xl"
        variant="text"
        autoSize
        onPress={handlePrev}
        disabled={!canGoPrev}
      />
      <Typography variant="smallBold" align="center">
        {currentDate.format(MONTH_YEAR_FORMAT)}
      </Typography>
      <IconButton
        icon="chevron-right"
        size="xl"
        variant="text"
        autoSize
        onPress={handleNext}
        disabled={!canGoNext}
      />
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
  });
