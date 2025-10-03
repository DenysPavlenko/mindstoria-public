import {
  Calendar,
  ConfirmationDialog,
  EntryView,
  HeaderIconWrapper,
  IconButton,
  Placeholder,
  SafeView,
  Typography,
} from "@/components";
import { usePremium } from "@/hooks/usePremium";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  deleteEntryThunk,
  selectEntriesByTrackerId,
  selectEntryByDate,
  selectMetricsByTrackerId,
} from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { CALENDAR_DATE_FORMAT } from "@/utils";
import dayjs from "dayjs";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { MarkedDates } from "react-native-calendars/src/types";

interface TrackerProps {
  trackerId: string;
}

export const Tracker = ({ trackerId }: TrackerProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const router = useRouter();
  const { theme } = useTheme();
  const { checkPremiumFeature } = usePremium();
  const { trackers } = useAppSelector((state) => state.trackersData);
  const dispatch = useAppDispatch();
  // State for selected date
  const [selectedDate, setSelectedDate] = useState(() =>
    dayjs().format(CALENDAR_DATE_FORMAT)
  );
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  const selectedTracker = trackers[trackerId];
  const selectedEntries = useAppSelector((state) => {
    return selectEntriesByTrackerId(state, trackerId);
  });
  const metrics = useAppSelector((state) =>
    selectMetricsByTrackerId(state, trackerId)
  );
  const selectedEntry = useAppSelector((state) => {
    return selectEntryByDate(state, trackerId, selectedDate);
  });

  // Create theme-aware styles (memoized for performance)
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleStatisticsPress = useCallback(() => {
    if (!selectedTracker) return;
    checkPremiumFeature(() => {
      router.navigate({
        pathname: "/statistics/[trackerId]",
        params: { trackerId },
      });
    });
  }, [router, trackerId, selectedTracker, checkPremiumFeature]);

  const renderHeaderRightButton = useCallback(
    () => (
      <HeaderIconWrapper>
        <IconButton
          icon="bar-chart"
          variant="text"
          iconColor="onBackground"
          autoSize
          size="lg"
          onPress={handleStatisticsPress}
        />
      </HeaderIconWrapper>
    ),
    [handleStatisticsPress]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      title: selectedTracker?.name,
      headerRight: renderHeaderRightButton,
    });
  }, [navigation, selectedTracker?.name, renderHeaderRightButton]);

  // Map entries to marked dates for calendar, and mark selected day with accent color
  const markedDates = useMemo(() => {
    const marks: MarkedDates = {};
    selectedEntries.forEach((entry) => {
      if (entry.date) {
        const formatted = dayjs(entry.date).format(CALENDAR_DATE_FORMAT);
        marks[formatted] = {
          marked: true,
          selected: true,
          dotColor: "transparent",
          selectedColor: theme.colors.primaryContainer,
          selectedTextColor: theme.colors.onPrimaryContainer,
        };
      }
    });
    // Mark the selected day with accent color
    marks[selectedDate] = {
      ...(marks[selectedDate] || { marked: true }),
      selected: true,
      dotColor: "transparent",
      selectedColor: theme.colors.primary,
      selectedTextColor: theme.colors.onPrimary,
    };
    // Show a dot for today if not already marked
    const today = dayjs().format(CALENDAR_DATE_FORMAT);
    marks[today] = {
      ...(marks[today] || {}),
      marked: true,
      dotColor: theme.colors.tertiary,
    };

    return marks;
  }, [selectedEntries, theme, selectedDate]);

  const handleDayPress = (day: { dateString: string }) => {
    setSelectedDate(day.dateString);
  };

  const handleEntryValuePress = (index: number) => {
    if (!selectedEntry) return;
    router.navigate({
      pathname: `/tracker/[trackerId]/entry`,
      params: { trackerId, entryId: selectedEntry.id, page: index },
    });
  };

  const handleAddEntry = () => {
    router.navigate({
      pathname: "/tracker/[trackerId]/entry",
      params: { trackerId, date: dayjs(selectedDate).toString() },
    });
  };

  const handleDeleteEntry = () => {
    if (!selectedEntry) return;
    dispatch(deleteEntryThunk(selectedEntry));
    setShowConfirmDialog(false);
  };

  const renderContent = () => {
    if (!selectedEntry) {
      return (
        <View style={styles.content}>
          <Placeholder
            style={styles.placeholder}
            title={t("common.no_data")}
            content={t("entries.no_entry_yet")}
            action={{ onPress: handleAddEntry }}
          />
        </View>
      );
    }
    return (
      <View style={styles.content}>
        <View style={styles.contentHeader}>
          <Typography variant="h4">
            {dayjs(selectedEntry.date).format("dddd")}
          </Typography>
          <IconButton
            icon="trash"
            onPress={() => setShowConfirmDialog(true)}
            iconColor="error"
            variant="text"
            autoSize
            size="lg"
          />
        </View>
        <View style={styles.entryViewContainer}>
          <EntryView
            onValuePress={handleEntryValuePress}
            entry={selectedEntry}
            metrics={metrics}
          />
        </View>
      </View>
    );
  };

  const renderConfirmationDialog = () => {
    if (!showConfirmDialog) return null;
    return (
      <ConfirmationDialog
        visible={showConfirmDialog}
        title={t("common.confirm_deletion")}
        content={t("entries.delete_confirmation")}
        onClose={() => setShowConfirmDialog(false)}
        onConfirm={handleDeleteEntry}
      />
    );
  };

  return (
    <SafeView>
      <View style={styles.container}>
        <Calendar
          markedDates={markedDates}
          onDayPress={handleDayPress}
          selectedDate={selectedDate}
        />
        {renderContent()}
        {renderConfirmationDialog()}
      </View>
    </SafeView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.layout.spacing.lg,
    },
    content: {
      flex: 1,
      marginTop: theme.layout.spacing.xl,
    },
    contentHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.layout.spacing.lg,
    },
    entryViewContainer: {
      flex: 1,
    },
    placeholder: {
      flex: 1,
    },
    actionMarginRight: {
      marginRight: theme.layout.spacing.lg,
    },
  });

export default Tracker;
