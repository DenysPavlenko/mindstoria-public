import {
  CalendarPicker,
  Header,
  IconButton,
  LogPreview,
  Typography,
  WeekCalendar,
} from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  fetchCBTLogsThunk,
  fetchLogsThunk,
  fetchMedLogsThunk,
  fetchSleepLogsThunk,
  selectCBTConnectionsMap,
  selectLogDateAvailability,
  selectMedLogDateAvailability,
  selectSleepLogsGroupedByDate,
} from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TLog } from "@/types";
import { CALENDAR_DATE_FORMAT } from "@/utils/dateConstants";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Essentials } from "./components/Essentials";
import { LogsList } from "./components/LogsList";

export const Home = () => {
  const { theme } = useTheme();
  const router = useRouter();
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const dispatch = useAppDispatch();
  const sleepLogs = useAppSelector(selectSleepLogsGroupedByDate);
  const medLogsLookup = useAppSelector(selectMedLogDateAvailability);
  const logsLookup = useAppSelector(selectLogDateAvailability);
  const cbtConnections = useAppSelector(selectCBTConnectionsMap);
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<TLog | null>(null);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    Promise.all([
      dispatch(fetchLogsThunk()),
      dispatch(fetchSleepLogsThunk()),
      dispatch(fetchMedLogsThunk()),
      dispatch(fetchCBTLogsThunk()),
    ]).finally(() => setIsLoading(false));
  }, [dispatch]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const title = useMemo(() => {
    if (selectedDate.isSame(dayjs(), "day")) return t("common.today");
    if (selectedDate.isSame(dayjs().subtract(1, "day"), "day"))
      return t("common.yesterday");
    return selectedDate.locale(i18n.language).format("MMMM D");
  }, [selectedDate, t, i18n.language]);

  const getDotsCount = (date: Dayjs) => {
    const dayKey = dayjs(date).format(CALENDAR_DATE_FORMAT);
    const dotsCount = [
      sleepLogs[dayKey],
      medLogsLookup[dayKey],
      logsLookup[dayKey],
    ].filter(Boolean).length;
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
            icon="bar-chart-2"
            size="md"
            onPress={() => router.push("/statistics")}
          />
        }
      />
    );
  };

  const renderLogsPreview = () => {
    if (!selectedLog) return null;
    const cbtId = cbtConnections[selectedLog.id];
    return (
      <LogPreview
        log={selectedLog}
        onClose={() => setSelectedLog(null)}
        connectedCBTId={cbtId}
      />
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
      <View style={styles.wrapper}>
        <WeekCalendar
          date={selectedDate}
          onDateChange={setSelectedDate}
          style={styles.weekCalendar}
          getDotsCount={getDotsCount}
        />
        <Essentials date={selectedDate} />
        <LogsList
          isLoading={isLoading}
          date={selectedDate}
          onCardPress={setSelectedLog}
        />
        {renderCalendarPicker()}
        {renderLogsPreview()}
      </View>
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    wrapper: {
      flex: 1,
      gap: theme.layout.spacing.lg,
    },
    weekCalendar: {
      paddingHorizontal: theme.layout.spacing.lg,
    },
  });
