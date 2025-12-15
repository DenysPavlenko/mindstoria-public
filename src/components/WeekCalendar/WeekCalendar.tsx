import { TTheme, useTheme } from "@/theme";
import { generatePeriodDates } from "@/utils";
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
const MAX_WIDTH = Math.min(SCREEN_WIDTH, 500);

interface WeekCalendarProps {
  date: Dayjs;
  onDateChange: (date: Dayjs) => void;
  style?: StyleProp<ViewStyle>;
  getDotsCount: (date: Dayjs) => number;
}
const ICON_SIZE = MAX_WIDTH / 8;

export const WeekCalendar = ({
  style,
  date,
  onDateChange,
  getDotsCount,
}: WeekCalendarProps) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const currentLanguage = i18n.language;

  const styles = useMemo(() => createStyles(theme), [theme]);

  const daysOfWeek = useMemo(() => {
    return generatePeriodDates("week", dayjs());
  }, []);

  const weekNameFormat = useMemo(() => {
    return currentLanguage === "ua" ? "dd" : "ddd";
  }, [currentLanguage]);

  const renderDots = (isoDay: string) => {
    const dotsCount = getDotsCount(dayjs(isoDay));
    if (dotsCount === 0) return null;
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
          size={ICON_SIZE}
          radius={ICON_SIZE / 2}
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
      maxWidth: MAX_WIDTH,
      width: "100%",
      alignSelf: "center",
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
