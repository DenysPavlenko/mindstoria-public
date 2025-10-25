import { useAppSelector } from "@/store";
import {
  selectLogDateAvailability,
  selectMedLogDateAvailability,
  selectSleepLogsGroupedByDate,
} from "@/store/slices";
import { useTheme } from "@/theme";
import { generateDaysForMonth } from "@/utils";
import { CALENDAR_DATE_FORMAT } from "@/utils/dateConstants";
import dayjs, { Dayjs } from "dayjs";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, View, ViewStyle } from "react-native";
import { MarkedDates } from "react-native-calendars/src/types";
import { Calendar } from "../Calendar/Calendar";
import { SlideInModal } from "../SlideInModal/SlideInModal";

interface CalendarPickerProps {
  date: Dayjs;
  visible: boolean;
  onClose: () => void;
  onDateChange: (date: Dayjs) => void;
  style?: StyleProp<ViewStyle>;
}

const TODAY = dayjs().format(CALENDAR_DATE_FORMAT);

export const CalendarPicker = ({
  visible,
  onClose,
  date,
  onDateChange,
}: CalendarPickerProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const sleepLogs = useAppSelector(selectSleepLogsGroupedByDate);
  const medLogsLookup = useAppSelector(selectMedLogDateAvailability);
  const logsLookup = useAppSelector(selectLogDateAvailability);
  const [innerDate, setInnerDate] = useState(date);

  const currentMonthDays = useMemo(() => {
    return generateDaysForMonth(innerDate);
  }, [innerDate]);

  const markedDates = useMemo(() => {
    const marks: MarkedDates = {};
    // Mark all days in the current month that have logs
    currentMonthDays.forEach((dayKey) => {
      const dotsCount = [
        sleepLogs[dayKey],
        medLogsLookup[dayKey],
        logsLookup[dayKey],
      ].filter(Boolean).length;
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
  }, [
    theme.colors,
    date,
    currentMonthDays,
    sleepLogs,
    medLogsLookup,
    logsLookup,
  ]);

  return (
    <SlideInModal
      title={t("common.select_date")}
      visible={visible}
      onClose={onClose}
    >
      <View style={{ paddingHorizontal: theme.layout.spacing.lg }}>
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
      </View>
    </SlideInModal>
  );
};
