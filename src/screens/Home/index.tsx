import { ANALYTICS_EVENTS } from "@/analytics-constants";
import {
  Header,
  IconButton,
  LogPreview,
  Typography,
  WeekCalendar,
} from "@/components";
import { useTheme } from "@/providers";
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
import { TTheme } from "@/theme";
import { TLog } from "@/types";
import { CALENDAR_DATE_FORMAT, getRelativeDayTitle, trackEvent } from "@/utils";
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
    return getRelativeDayTitle(selectedDate, t, i18n.language);
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
        leftContent={<Typography variant="h4">{title}</Typography>}
        rightContent={
          <IconButton
            icon="pie-chart"
            size="md"
            variant="text"
            edge={["end"]}
            onPress={() => {
              router.navigate("/statistics");
              trackEvent(ANALYTICS_EVENTS.MOOD_STATISTICS_OPENED);
            }}
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
