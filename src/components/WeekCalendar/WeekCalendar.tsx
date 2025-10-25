import { useAppSelector } from "@/store";
import {
  selectLogDateAvailability,
  selectMedLogDateAvailability,
  selectSleepLogsGroupedByDate,
} from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { CALENDAR_DATE_FORMAT, generatePeriodDates } from "@/utils";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { IconButton } from "../IconButton/IconButton";
import { Typography } from "../Typography/Typography";

const SCREEN_WIDTH = Dimensions.get("window").width;

interface WeekCalendarProps {
  date: Dayjs;
  onDateChange: (date: Dayjs) => void;
  style?: StyleProp<ViewStyle>;
}

export const WeekCalendar = ({
  style,
  date,
  onDateChange,
}: WeekCalendarProps) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const sleepLogs = useAppSelector(selectSleepLogsGroupedByDate);
  const medLogsLookup = useAppSelector(selectMedLogDateAvailability);
  const logsLookup = useAppSelector(selectLogDateAvailability);
  const currentLanguage = i18n.language;

  const styles = useMemo(() => createStyles(theme), [theme]);

  const daysOfWeek = useMemo(() => {
    return generatePeriodDates("week", dayjs());
  }, []);

  const weekNameFormat = useMemo(() => {
    return currentLanguage === "ua" ? "dd" : "ddd";
  }, [currentLanguage]);

  const renderDots = (isoDay: string) => {
    const dayKey = dayjs(isoDay).format(CALENDAR_DATE_FORMAT);
    const dotsCount = [
      sleepLogs[dayKey],
      medLogsLookup[dayKey],
      logsLookup[dayKey],
    ].filter(Boolean).length;
    return (
      <View style={styles.dotsWrapper}>
        {Array.from({ length: dotsCount }).map((_, index) => (
          <View
            key={index}
            style={[
              styles.dot,
              { backgroundColor: theme.colors.inversePrimary },
            ]}
          />
        ))}
      </View>
    );
  };

  const renderDayItem = (isoDay: string) => {
    const isToday = dayjs(isoDay).isSame(date, "day");
    const size = SCREEN_WIDTH / 8;
    return (
      <View
        key={isoDay}
        style={{ alignItems: "center", justifyContent: "space-between" }}
      >
        <IconButton
          customContent={
            <>
              <View style={styles.dayItemContent}>
                <Typography
                  color={isToday ? "onPrimary" : "onSurface"}
                  variant="tinyBold"
                  style={{ marginBottom: -2 }}
                >
                  {dayjs(isoDay).format(weekNameFormat)}
                </Typography>
                <Typography
                  variant="smallBold"
                  color={isToday ? "onPrimary" : "onSurface"}
                >
                  {dayjs(isoDay).format("D")}
                </Typography>
              </View>
              {renderDots(isoDay)}
            </>
          }
          size={size}
          radius={size / 2}
          backgroundColor={isToday ? "primary" : "surfaceVariant"}
          onPress={() => onDateChange(dayjs(isoDay))}
        />
      </View>
    );
  };

  return (
    <View style={style}>
      <View style={styles.dayItemsContainer}>
        {daysOfWeek.map((day) => {
          return renderDayItem(day);
        })}
      </View>
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    dayItemsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    dayItemContent: {
      position: "absolute",
      top: 0,
      height: "100%",
      alignItems: "center",
      justifyContent: "center",
    },
    dotsWrapper: {
      position: "absolute",
      bottom: 0,
      top: 0,
      left: theme.layout.spacing.xs,
      gap: 1.5,
      alignItems: "center",
      justifyContent: "center",
    },
    dot: {
      marginHorizontal: 1,
      width: 4,
      height: 4,
      borderRadius: 4 / 2,
    },
  });
