import { useTheme } from "@/providers";
import { CALENDAR_DATE_FORMAT } from "@/utils";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  LocaleConfig,
  Calendar as RNCalendar,
  CalendarProps as RNCalendarProps,
} from "react-native-calendars";
import { Card } from "../Card/Card";
import { getCalendarTheme } from "./calendarTheme";
import { configureCalendarLocales } from "./utils";

// Initialize locales once
configureCalendarLocales();

const today = dayjs().format(CALENDAR_DATE_FORMAT).toString();

type CalendarProps = RNCalendarProps & {
  selectedDate?: string;
};

export const Calendar = ({ selectedDate, ...restProps }: CalendarProps) => {
  const { theme } = useTheme();
  const { i18n } = useTranslation();

  // Set calendar locale based on current language
  const currentLocale = i18n.language === "ua" ? "ua" : "";
  LocaleConfig.defaultLocale = currentLocale;

  // Set dayjs locale to match app language
  dayjs.locale(i18n.language === "ua" ? "uk" : "en");

  const calendarTheme = useMemo(() => getCalendarTheme(theme), [theme]);

  return (
    <Card style={restProps.style} noHorizontalPadding>
      <RNCalendar
        {...restProps}
        hideExtraDays
        theme={{ ...calendarTheme, ...restProps.theme }}
        current={selectedDate}
        maxDate={today}
        firstDay={1}
        disableAllTouchEventsForDisabledDays
      />
    </Card>
  );
};
