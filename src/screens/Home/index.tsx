import {
  CalendarPicker,
  Header,
  IconButton,
  LogPreview,
  Typography,
  WeekCalendar,
} from "@/components";
import { useAppDispatch } from "@/store";
import {
  fetchLogsThunk,
  fetchMedLogsThunk,
  fetchSleepLogsThunk,
} from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TLog } from "@/types";
import dayjs from "dayjs";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Essentials } from "./components/Essentials";
import { LogsList } from "./components/LogsList";

export const Home = () => {
  const { theme } = useTheme();
  const { t, i18n } = useTranslation();
  const [selectedDate, setSelectedDate] = useState(dayjs());
  const dispatch = useAppDispatch();
  const [showCalendarPicker, setShowCalendarPicker] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedLog, setSelectedLog] = useState<TLog | null>(null);

  const fetchData = useCallback(() => {
    setIsLoading(true);
    Promise.all([
      dispatch(fetchLogsThunk()),
      dispatch(fetchSleepLogsThunk()),
      dispatch(fetchMedLogsThunk()),
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

  const renderHeader = () => {
    return (
      <Header
        leftContent={<Typography variant="h4">{title}</Typography>}
        rightContent={
          <IconButton
            icon="calendar"
            size="md"
            onPress={() => setShowCalendarPicker(true)}
          />
        }
      />
    );
  };

  const renderLogsPreview = () => {
    if (!selectedLog) return null;
    return (
      <LogPreview log={selectedLog} onClose={() => setSelectedLog(null)} />
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
