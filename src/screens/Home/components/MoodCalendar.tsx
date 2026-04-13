import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { Calendar, CustomPressable, MoodIcon, Pill } from "@/components";
import { useTheme } from "@/providers";
import { useAppSelector } from "@/store";
import { selectLogsAvarageMap } from "@/store/slices";
import { DISABLED_ALPHA } from "@/theme";
import { CALENDAR_DATE_FORMAT, trackEvent } from "@/utils";
import dayjs, { Dayjs } from "dayjs";
import { useEffect } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { DateData } from "react-native-calendars/src/types";

interface MoodCalendarProps {
  selectedDate: Dayjs;
  onClose: () => void;
  onDateChange: (date: Dayjs) => void;
  style?: StyleProp<ViewStyle>;
}

export const MoodCalendar = ({
  onClose,
  selectedDate,
  onDateChange,
}: MoodCalendarProps) => {
  const { theme } = useTheme();
  const logsLookupAvg = useAppSelector(selectLogsAvarageMap);

  const today = dayjs().format("YYYY-MM-DD");

  useEffect(() => {
    trackEvent(ANALYTICS_EVENTS.MOOD_CALENDAR_OPENED);
  }, []);

  const renderDay = (
    date: DateData | undefined,
    state: string | undefined,
    onPress?: (date?: DateData | undefined) => void,
  ) => {
    if (!date) return <View />;
    const dateStr = date.dateString;
    const level = logsLookupAvg[dateStr];
    const isDisabled = state === "disabled";
    const isToday = dateStr === today;
    const isSelected = selectedDate.isSame(dateStr, "date");
    return (
      <CustomPressable
        key={dateStr}
        style={{ gap: 4, alignItems: "center" }}
        onPress={() => onPress?.(date)}
      >
        {level ? (
          <MoodIcon level={level} size="lg" />
        ) : (
          <View
            style={{
              width: theme.layout.size.lg,
              height: theme.layout.size.lg,
              borderRadius: theme.layout.size.lg / 2,
              backgroundColor: isDisabled
                ? theme.colors.surfaceContainerHigh
                : theme.colors.secondaryContainer,
              borderWidth: 1,
              borderColor: isToday
                ? theme.colors.primary
                : theme.colors.surfaceContainerHigh,
            }}
          />
        )}
        <Pill
          label={date.day}
          bgColor={isSelected ? "primary" : "surfaceContainer"}
          style={{
            paddingVertical: theme.layout.spacing.xxs,
            paddingHorizontal: 0,
            opacity: isDisabled ? DISABLED_ALPHA : 1,
            width: theme.layout.size.xs,
            justifyContent: "center",
          }}
          textProps={{
            variant: "extraTinyBold",
            color: isSelected ? "onPrimary" : isToday ? "primary" : "onSurface",
          }}
        />
      </CustomPressable>
    );
  };

  return (
    <Calendar
      selectedDate={dayjs(selectedDate).format(CALENDAR_DATE_FORMAT)}
      onDayPress={(day) => {
        const date = dayjs(day.dateString)
          .hour(selectedDate.hour())
          .minute(selectedDate.minute())
          .second(selectedDate.second())
          .millisecond(selectedDate.millisecond());
        onDateChange(date);
        onClose();
      }}
      current={dayjs(selectedDate).format(CALENDAR_DATE_FORMAT)}
      dayComponent={({ date, state, onPress }) =>
        renderDay(date, state, onPress)
      }
      onMonthChange={(date) => {
        trackEvent(ANALYTICS_EVENTS.MOOD_CALENDAR_MONTH_CHANGED, {
          date: date.dateString,
        });
      }}
    />
  );
};
