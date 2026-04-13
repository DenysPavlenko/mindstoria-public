import { Calendar } from "@/components";
import { useTheme } from "@/providers";
import { CALENDAR_DATE_FORMAT, generateDaysForMonth } from "@/utils";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { StyleProp, ViewStyle } from "react-native";
import { MarkedDates } from "react-native-calendars/src/types";

interface CBTCalendarProps {
  date: Dayjs;
  onClose: () => void;
  onDateChange: (date: Dayjs) => void;
  getDotsCount: (date: Dayjs) => number;
  style?: StyleProp<ViewStyle>;
}

const TODAY = dayjs().format(CALENDAR_DATE_FORMAT);

export const CBTCalendar = ({
  onClose,
  date,
  onDateChange,
  getDotsCount,
}: CBTCalendarProps) => {
  const { theme } = useTheme();
  const [innerDate, setInnerDate] = useState(date);

  const currentMonthDays = useMemo(() => {
    return generateDaysForMonth(innerDate);
  }, [innerDate]);

  const markedDates = useMemo(() => {
    const marks: MarkedDates = {};
    // Mark all days in the current month that have logs
    currentMonthDays.forEach((dayKey) => {
      const dotsCount = getDotsCount(dayjs(dayKey));
      if (dotsCount > 0) {
        marks[dayKey] = {
          marked: true,
          selected: true,
          dotColor: "transparent",
          selectedColor: theme.colors.surfaceVariant,
          selectedTextColor: theme.colors.onSurfaceVariant,
        };
      }
    });
    // Always mark today
    marks[TODAY] = {
      ...(marks[TODAY] || {}),
      marked: true,
      selectedColor: theme.colors.primaryContainer,
      selectedTextColor: theme.colors.onPrimaryContainer,
      dotColor: "transparent",
    };
    // Mark the selected day with accent color
    const selectedDate = date.format(CALENDAR_DATE_FORMAT);
    marks[selectedDate] = {
      ...(marks[selectedDate] || { marked: true }),
      selected: true,
      dotColor: "transparent",
      selectedColor: theme.colors.primary,
      selectedTextColor: theme.colors.onPrimary,
    };
    return marks;
  }, [currentMonthDays, date, theme.colors, getDotsCount]);

  return (
    <Calendar
      selectedDate={dayjs(date).format(CALENDAR_DATE_FORMAT)}
      onDayPress={(day) => {
        const selectedDate = dayjs(day.dateString)
          .hour(date.hour())
          .minute(date.minute())
          .second(date.second())
          .millisecond(date.millisecond());
        onDateChange(selectedDate);
        onClose();
      }}
      onMonthChange={(date) => {
        setInnerDate(dayjs(date.dateString));
      }}
      current={dayjs(date).format(CALENDAR_DATE_FORMAT)}
      markedDates={markedDates}
    />
  );
};
