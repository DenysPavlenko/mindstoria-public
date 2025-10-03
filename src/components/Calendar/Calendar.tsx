import { useAppDispatch, useAppSelector } from "@/store";
import { toggleCalendarWeekMonth } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { CALENDAR_DATE_FORMAT, MONTH_YEAR_FORMAT } from "@/utils";
import dayjs from "dayjs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { LayoutChangeEvent, StyleSheet, View } from "react-native";
import {
  CalendarList,
  CalendarListProps,
  CalendarProvider,
  DateData,
  LocaleConfig,
  WeekCalendar,
  WeekCalendarProps,
} from "react-native-calendars";
import { Card } from "../Card/Card";
import { Typography } from "../Typography/Typography";
import { getCalendarTheme } from "./calendarTheme";
import { WeekMonthButton } from "./components/WeekMonthButton";
import { configureCalendarLocales, getCalendarHeight } from "./utils";

// Initialize locales once
configureCalendarLocales();

const today = dayjs().format(CALENDAR_DATE_FORMAT).toString();

type TDimensions = {
  width: number;
  height: number;
};

type CalendarProps = CalendarListProps &
  WeekCalendarProps & {
    selectedDate?: string;
  };

export const Calendar = ({ selectedDate, ...restProps }: CalendarProps) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();
  const [dimensions, setDimensions] = useState<TDimensions>();
  const [currentMonth, setCurrentMonth] = useState(today);
  const dispatch = useAppDispatch();
  const ui = useAppSelector((state) => state.ui);

  const isWeekView = ui.calendar === "week";

  // Set calendar locale based on current language
  const currentLocale = i18n.language === "ua" ? "ua" : "";
  LocaleConfig.defaultLocale = currentLocale;

  // Set dayjs locale to match app language
  dayjs.locale(i18n.language === "ua" ? "uk" : "en");

  const calendarTheme = useMemo(() => getCalendarTheme(theme), [theme]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleMonthChange = (date: DateData) => {
    setCurrentMonth(
      dayjs(`${date.year}-${date.month}-${date.day}`).format(
        CALENDAR_DATE_FORMAT
      )
    );
  };

  const handleDimensionsChange = (e: LayoutChangeEvent) => {
    setDimensions({
      height: e.nativeEvent.layout.height,
      width: e.nativeEvent.layout.width,
    });
  };

  const handleWeekMonthToggle = () => {
    dispatch(toggleCalendarWeekMonth());
  };

  const dynamicMonthHeight = useMemo(() => {
    if (isWeekView) return;
    return getCalendarHeight(currentMonth);
  }, [currentMonth, isWeekView]);

  const renderMonthCalendar = () => {
    return (
      <View
        onLayout={handleDimensionsChange}
        style={[styles.monthVew, { height: dynamicMonthHeight }]}
      >
        <CalendarList
          {...restProps}
          hideExtraDays
          horizontal
          pagingEnabled={true}
          futureScrollRange={0}
          renderHeader={() => null}
          theme={{ ...calendarTheme, ...restProps.theme }}
          // Do not set current to currentMonth to avoid issues with swiping months
          current={selectedDate}
          maxDate={today}
          onMonthChange={handleMonthChange}
          firstDay={1}
          key={dimensions?.width}
          disableAllTouchEventsForDisabledDays
          calendarWidth={dimensions?.width}
        />
      </View>
    );
  };

  const renderWeekCalendar = () => {
    return (
      <View style={styles.weekView} onLayout={handleDimensionsChange}>
        <CalendarProvider date={today} onMonthChange={handleMonthChange}>
          <WeekCalendar
            {...restProps}
            key={dimensions?.width}
            calendarWidth={dimensions?.width}
            calendarHeight={dimensions?.height}
            firstDay={1}
            current={selectedDate}
            theme={{ ...calendarTheme, ...restProps.theme }}
            maxDate={today}
            futureScrollRange={0}
            allowShadow={false}
            disableAllTouchEventsForDisabledDays
          />
        </CalendarProvider>
      </View>
    );
  };

  return (
    <Card cardStyle={restProps.style} noHorizontalPadding>
      <View style={styles.header}>
        <WeekMonthButton
          isWeekView={isWeekView}
          onPress={handleWeekMonthToggle}
        />
        <Typography variant="smallBold">
          {dayjs(currentMonth).format(MONTH_YEAR_FORMAT)}
        </Typography>
      </View>
      {isWeekView ? renderWeekCalendar() : renderMonthCalendar()}
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.layout.spacing.xxs,
      paddingHorizontal: theme.layout.spacing.lg,
      zIndex: 1,
    },
    monthVew: {
      overflow: "hidden",
      marginTop: -3,
      zIndex: 0,
    },
    weekView: {
      minHeight: 80,
    },
  });
