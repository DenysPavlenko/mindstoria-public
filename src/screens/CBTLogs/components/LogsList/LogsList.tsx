import { TAB_BAR_CBT_LOG_BUTTON_PRESS } from "@/appConstants";
import {
  Card,
  ConfirmationDialog,
  Placeholder,
  TAB_BAR_HEIGHT,
} from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import { removeCBTLogThunk, selectCBTLogs } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TCBTLog, TCBTScreenView } from "@/types";
import { Dayjs } from "dayjs";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { LogsFlatList } from "./LogsFlatList";
import { LogsSectionList } from "./LogsSectionList";

interface LogsListProps {
  date?: Dayjs;
  onCardPress: (log: TCBTLog) => void;
  viewType: TCBTScreenView;
}

export const LogsList = ({ date, onCardPress, viewType }: LogsListProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const insets = useSafeAreaInsets();
  const logs = useAppSelector(selectCBTLogs);
  const [logToDelete, setLogToDelete] = useState<TCBTLog | null>(null);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const paddingBottom = useMemo(() => {
    return insets.bottom + TAB_BAR_HEIGHT + theme.layout.spacing.lg;
  }, [insets.bottom, theme.layout.spacing.lg]);

  useEffect(() => {
    const subscription = DeviceEventEmitter.addListener(
      TAB_BAR_CBT_LOG_BUTTON_PRESS,
      () => {
        router.navigate({
          pathname: "/cbt-log-manager",
          params: { date: date?.toISOString() },
        });
      },
    );
    return () => subscription.remove();
  }, [router, date]);

  const handleDeleteLog = (log: TCBTLog) => {
    dispatch(removeCBTLogThunk(log));
    setLogToDelete(null);
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
    return (
      <View style={styles.placeholder}>
        <Placeholder title={t("cbt.add_log")} />
      </View>
    );
  };

  const renderFlatList = () => {
    if (!date) return null;
    return (
      <LogsFlatList
        logs={logs}
        date={date}
        onCardPress={onCardPress}
        onDelete={setLogToDelete}
        placeholder={renderPlaceholder()}
        paddingBottom={paddingBottom}
      />
    );
  };

  const renderSectionList = () => {
    return (
      <LogsSectionList
        logs={logs}
        onCardPress={onCardPress}
        onDelete={setLogToDelete}
        placeholder={renderPlaceholder()}
        paddingBottom={paddingBottom}
      />
    );
  };

  return (
    <Card style={styles.container} noPadding>
      {viewType === "calendar" ? renderFlatList() : renderSectionList()}
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
