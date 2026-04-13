import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { generatePeriodDates } from "@/utils";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { IconButton } from "../IconButton/IconButton";
import { SlideInModal } from "../SlideInModal/SlideInModal";
import { Typography } from "../Typography/Typography";

const SCREEN_WIDTH = Dimensions.get("window").width;
const MAX_WIDTH = Math.min(SCREEN_WIDTH, 500);

interface WeekCalendarProps {
  date: Dayjs;
  onDateChange: (date: Dayjs) => void;
  style?: StyleProp<ViewStyle>;
  getDotsCount: (date: Dayjs) => number;
  renderCalendar: ({
    date,
    onDateChange,
    getDotsCount,
    onClose,
  }: {
    date: Dayjs;
    onDateChange: (date: Dayjs) => void;
    getDotsCount: (date: Dayjs) => number;
    onClose: () => void;
  }) => React.ReactNode;
}
const ICON_SIZE = MAX_WIDTH / 8;

export const WeekCalendar = ({
  style,
  date,
  onDateChange,
  getDotsCount,
  renderCalendar,
}: WeekCalendarProps) => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const currentLanguage = i18n.language;
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const daysOfWeek = useMemo(() => {
    return generatePeriodDates("week", dayjs()).slice(1);
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
          customIcon={
            <>
              <View style={styles.dayItemContent}>
                <Typography
                  color={isToday ? "onPrimary" : "onSurface"}
                  variant="tinySemibold"
                  style={{ marginBottom: -2 }}
                >
                  {dayjs(isoDay).format(weekNameFormat)}
                </Typography>
                <Typography
                  variant="smallBold"
                  color={isToday ? "onPrimary" : "onSecondaryContainer"}
                >
                  {dayjs(isoDay).format("D")}
                </Typography>
              </View>
              {renderDots(isoDay)}
            </>
          }
          size={ICON_SIZE}
          radius={ICON_SIZE / 2}
          color={isToday ? "primary" : "secondaryContainer"}
          onPress={() => onDateChange(dayjs(isoDay))}
        />
      </View>
    );
  };

  const renderCalendarPicker = () => {
    if (!showCalendarPicker) return null;
    return (
      <SlideInModal
        title={t("common.select_day")}
        visible
        onClose={() => setShowCalendarPicker(false)}
      >
        <View style={{ paddingHorizontal: theme.layout.spacing.lg }}>
          {renderCalendar({
            date,
            onDateChange,
            getDotsCount,
            onClose: () => setShowCalendarPicker(false),
          })}
        </View>
      </SlideInModal>
    );
  };

  return (
    <View style={style}>
      <View style={styles.dayItemsContainer}>
        <IconButton
          color="secondaryContainer"
          iconColor="onSecondaryContainer"
          icon="calendar"
          size={ICON_SIZE}
          radius={ICON_SIZE / 2}
          onPress={() => setShowCalendarPicker(true)}
        />
        {daysOfWeek.map(renderDayItem)}
      </View>
      {renderCalendarPicker()}
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    dayItemsContainer: {
      flexDirection: "row",
      justifyContent: "space-between",
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
