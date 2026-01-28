import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { TAB_BAR_LOG_BUTTON_PRESS } from "@/appConstants";
import {
  Card,
  ConfirmationDialog,
  Placeholder,
  TAB_BAR_HEIGHT,
  Typography,
} from "@/components";
import { useTheme } from "@/providers";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  removeLogThunk,
  selectCBTConnectionsMap,
  selectLogs,
} from "@/store/slices";
import { TTheme } from "@/theme";
import { TLog } from "@/types";
import { trackEvent } from "@/utils";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeviceEventEmitter, FlatList, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogListItem } from "./LogListItem";

interface LogsListProps {
  date: Dayjs;
  isLoading: boolean;
  onCardPress: (log: TLog) => void;
}

export const LogsList = ({ date, isLoading, onCardPress }: LogsListProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const logs = useAppSelector(selectLogs);
  const cbtConnections = useAppSelector(selectCBTConnectionsMap);
  const [logToDelete, setLogToDelete] = useState<TLog | null>(null);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const todayLogs = useMemo(() => {
    return logs.filter((log) => dayjs(log.timestamp).isSame(date, "day"));
  }, [logs, date]);

  const sortedLogs = useMemo(() => {
    return todayLogs.slice().sort((a, b) => {
      return dayjs(a.timestamp).diff(dayjs(b.timestamp));
    });
  }, [todayLogs]);

  const paddingBottom = useMemo(() => {
    return insets.bottom + TAB_BAR_HEIGHT + theme.layout.spacing.lg;
  }, [insets.bottom, theme.layout.spacing.lg]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      TAB_BAR_LOG_BUTTON_PRESS,
      () => {
        router.navigate({
          pathname: "/log-manager",
          params: { date: date.toISOString() },
        });
        trackEvent(ANALYTICS_EVENTS.MOOD_LOG_STARTED, { mode: "create" });
      },
    );
    return () => subscription.remove();
  }, [router, date]);

  const handleDeleteLog = (log: TLog) => {
    dispatch(removeLogThunk(log));
    setLogToDelete(null);
  };

  const renderHeader = () => {
    if (sortedLogs.length === 0) return null;
    return (
      <View style={styles.header}>
        <Typography variant="h4">{t("wellbeing.wellbeing_log")}</Typography>
      </View>
    );
  };

  const renderConfirmDelete = () => {
    if (!logToDelete) return null;
    return (
      <ConfirmationDialog
        visible
        title={t("common.confirm_delete")}
        content={t("common.log_confirm_delete")}
        onConfirm={() => handleDeleteLog(logToDelete)}
        onClose={() => setLogToDelete(null)}
      />
    );
  };

  const renderPlaceholder = () => {
    if (isLoading) return null;
    return (
      <View style={styles.placeholder}>
        <Placeholder title={t("wellbeing.add_log")} />
      </View>
    );
  };

  const renderList = () => {
    return (
      <FlatList
        data={sortedLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.logsList, { paddingBottom }]}
        ListEmptyComponent={renderPlaceholder()}
        renderItem={({ item }) => (
          <LogListItem
            key={item.id}
            log={item}
            onPress={onCardPress}
            onDelete={setLogToDelete}
            hasConnectedCBT={!!cbtConnections[item.id]}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    );
  };

  return (
    <Card style={styles.container} noPadding>
      {renderHeader()}
      {renderList()}
      {renderConfirmDelete()}
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: theme.layout.spacing.lg,
      borderBottomLeftRadius: theme.layout.borderRadius.xxl,
      borderBottomRightRadius: theme.layout.borderRadius.xxl,
    },
    placeholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    header: {
      marginBottom: theme.layout.spacing.lg,
      paddingHorizontal: theme.layout.spacing.lg,
      paddingLeft: theme.layout.spacing.lg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    logsList: {
      flexGrow: 1,
      paddingHorizontal: theme.layout.spacing.lg,
      gap: theme.layout.spacing.sm,
    },
  });
