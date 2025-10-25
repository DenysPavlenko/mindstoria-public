import { TAB_BAR_BUTTON_PRESS } from "@/appConstants";
import {
  Card,
  ConfirmationDialog,
  Placeholder,
  TAB_BAR_HEIGHT,
  Typography,
} from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import { removeLogThunk, selectLogs } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TLog } from "@/types";
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
  const [impactToDelete, setLogToDelete] = useState<TLog | null>(null);

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
      TAB_BAR_BUTTON_PRESS,
      () => {
        router.push({
          pathname: "/log-manager",
          params: { date: date.toISOString() },
        });
      }
    );
    return () => subscription.remove();
  }, [router, date]);

  const handleDeleteImpact = (log: TLog) => {
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
    if (!impactToDelete) return null;
    return (
      <ConfirmationDialog
        visible
        title={t("common.confirm_delete")}
        content={t("impacts.confirm_delete")}
        onConfirm={() => handleDeleteImpact(impactToDelete)}
        onClose={() => setLogToDelete(null)}
      />
    );
  };

  const renderPlaceholder = () => {
    if (isLoading) return null;
    return (
      <View style={styles.placeholder}>
        <Placeholder content={t("wellbeing.add_log")} />
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
