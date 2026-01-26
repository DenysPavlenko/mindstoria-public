import {
  CalendarPicker,
  CBTLogPreview,
  Header,
  IconButton,
  Typography,
  WeekCalendar,
} from "@/components";
import { useAppSelector } from "@/store";
import { selectCBTLogDateAvailability } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TCBTLog } from "@/types";
import { CALENDAR_DATE_FORMAT, getRelativeDayTitle } from "@/utils/";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { LogsList } from "./LogsList/LogsList";

export const LogsCalendarView = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const logsLookup = useAppSelector(selectCBTLogDateAvailability);
  const [selectedLog, setSelectedLog] = useState<TCBTLog | null>(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const title = useMemo(() => {
    return getRelativeDayTitle(selectedDate, t, i18n.language);
  }, [selectedDate, t, i18n.language]);

  const getDotsCount = (date: Dayjs) => {
    const dayKey = dayjs(date).format(CALENDAR_DATE_FORMAT);
    const dotsCount = [logsLookup[dayKey]].filter(Boolean).length;
    return dotsCount;
  };

  const renderHeader = () => {
    return (
      <Header
        leftContent={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.layout.spacing.sm,
            }}
          >
            <IconButton
              icon="calendar"
              size="md"
              onPress={() => setShowCalendarPicker(true)}
            />
            <Typography variant="h4">{title}</Typography>
          </View>
        }
        rightContent={
          <IconButton
            icon="settings"
            size="md"
            onPress={() => {
              router.navigate("/cbt-settings");
            }}
            withHaptics={false}
          />
        }
      />
    );
  };

  const renderLogsPreview = () => {
    if (!selectedLog) return null;
    return (
      <CBTLogPreview log={selectedLog} onClose={() => setSelectedLog(null)} />
    );
  };

  const renderCalendarPicker = () => {
    if (!showCalendarPicker) return null;
    return (
      <CalendarPicker
        visible
        onClose={() => setShowCalendarPicker(false)}
        date={selectedDate}
        onDateChange={setSelectedDate}
        getDotsCount={getDotsCount}
      />
    );
  };

  return (
    <View style={styles.container}>
      {renderHeader()}
      <WeekCalendar
        date={selectedDate}
        onDateChange={setSelectedDate}
        style={styles.weekCalendar}
        getDotsCount={getDotsCount}
      />
      <LogsList
        date={selectedDate}
        onCardPress={setSelectedLog}
        viewType="calendar"
      />
      {renderCalendarPicker()}
      {renderLogsPreview()}
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    weekCalendar: {
      paddingHorizontal: theme.layout.spacing.lg,
      marginBottom: theme.layout.spacing.lg,
    },
  });
