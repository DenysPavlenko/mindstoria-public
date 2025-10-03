import { TTheme, disabledColor, typography } from "@/theme";
import { CalendarProps } from "react-native-calendars";

export const getCalendarTheme = (theme: TTheme): CalendarProps["theme"] => {
  return {
    backgroundColor: "transparent",
    calendarBackground: "transparent",
    selectedDayBackgroundColor: "transparent",
    todayBackgroundColor: "transparent",
    // Text colors
    todayTextColor: theme.colors.primary,
    selectedDayTextColor: theme.colors.primary,
    dayTextColor: theme.colors.onBackground,
    textDisabledColor: disabledColor(theme.colors.onBackground),
    monthTextColor: theme.colors.onBackground,
    // Font family
    textDayFontFamily: typography.bodyBold.fontFamily,
    textMonthFontFamily: typography.bodyBold.fontFamily,
    textDayHeaderFontFamily: typography.bodyBold.fontFamily,
    dotColor: theme.colors.onSecondary,
  };
};
