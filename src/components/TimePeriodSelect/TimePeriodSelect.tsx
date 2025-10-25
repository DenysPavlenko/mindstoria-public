import { useRevenueCat } from "@/services";
import { TTheme, useTheme } from "@/theme";
import { TTimePeriod } from "@/types/common";
import { formatPeriodRange } from "@/utils";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Card } from "../Card/Card";
import { Chip } from "../Chip/Chip";
import { IconButton } from "../IconButton/IconButton";
import { Typography } from "../Typography/Typography";

interface TimePeriodSelectProps {
  period: TTimePeriod;
  date: Dayjs;
  onChangePeriod: (type: TTimePeriod) => void;
  onChangeDate: (date: Dayjs) => void;
}

export const TimePeriodSelect = ({
  period,
  date,
  onChangePeriod,
  onChangeDate,
}: TimePeriodSelectProps) => {
  const { theme } = useTheme();
  const { checkPremiumFeature } = useRevenueCat();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const isNextHidden = useMemo(() => {
    let nextDate: Dayjs;
    switch (period) {
      case "week":
        nextDate = date.add(1, "day"); // moving forward one day
        break;
      case "month":
        nextDate = date.add(1, "day"); // for rolling month, add 1 day
        break;
      case "year":
        nextDate = date.add(1, "month"); // for rolling year, add 1 month
        break;
    }
    return nextDate.isAfter(dayjs(), "day"); // prevent future
  }, [date, period]);

  const movePeriod = (direction: -1 | 1) => {
    let nextDate: Dayjs;

    switch (period) {
      case "week":
        nextDate = date.add(direction, "week");
        break;
      case "month":
        nextDate = date.add(direction, "month");
        break;
      case "year":
        nextDate = date.add(direction, "year");
        break;
    }

    // prevent future periods
    if (nextDate.isAfter(dayjs())) return;

    onChangeDate(nextDate);
  };

  const handleMovePeriod = (direction: -1 | 1) => {
    checkPremiumFeature(() => {
      movePeriod(direction);
    });
  };

  const handlePeriodChange = (newPeriod: TTimePeriod) => {
    checkPremiumFeature(() => {
      onChangePeriod(newPeriod);
    });
  };

  const periodsData: { value: TTimePeriod; label: string }[] = [
    {
      value: "week",
      label: t("common.week"),
    },
    {
      value: "month",
      label: t("common.month"),
    },
    {
      value: "year",
      label: t("common.year"),
    },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.periodsContainer}>
        {periodsData.map((periodData) => (
          <Chip
            key={periodData.value}
            label={periodData.label}
            bgColor="surfaceContainer"
            textColor="onSurface"
            selected={period === periodData.value}
            onPress={() => handlePeriodChange(periodData.value)}
            style={{ flex: 1 }}
            minHeight="md"
          />
        ))}
      </View>
      <Card
        style={[styles.card, { height: theme.layout.size.md }]}
        noVerticalPadding
      >
        <IconButton
          icon="chevron-left"
          size="xl"
          variant="text"
          autoSize
          onPress={() => handleMovePeriod(-1)}
        />
        <View style={styles.text}>
          <Typography variant="smallBold" color="onSurface" align="center">
            {formatPeriodRange(period, date)}
          </Typography>
        </View>
        {!isNextHidden && (
          <IconButton
            icon="chevron-right"
            size="xl"
            variant="text"
            autoSize
            onPress={() => handleMovePeriod(1)}
            disabled={isNextHidden}
          />
        )}
      </Card>
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.layout.spacing.sm,
    },
    periodsContainer: {
      flexDirection: "row",
      gap: theme.layout.spacing.sm,
      justifyContent: "center",
    },
    card: {
      height: theme.layout.size.sm,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    text: {
      position: "absolute",
      left: 0,
      right: 0,
      justifyContent: "center",
      alignItems: "center",
    },
  });
