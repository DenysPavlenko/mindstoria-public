import { Typography } from "@/components/Typography/Typography";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TCBTLog } from "@/types";
import dayjs, { Dayjs } from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleSheet, View } from "react-native";
import { LogListItem } from "./LogListItem";

interface LogsFlatListProps {
  logs: TCBTLog[];
  date: Dayjs;
  onCardPress: (log: TCBTLog) => void;
  onDelete: (log: TCBTLog) => void;
  placeholder: React.ReactElement;
  paddingBottom: number;
}

export const LogsFlatList = ({
  logs,
  date,
  onCardPress,
  onDelete,
  placeholder,
  paddingBottom,
}: LogsFlatListProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const todayLogs = useMemo(() => {
    return logs.filter((log) => dayjs(log.timestamp).isSame(date, "day"));
  }, [logs, date]);

  const sortedLogs = useMemo(() => {
    return todayLogs.slice().sort((a, b) => {
      return dayjs(a.timestamp).diff(dayjs(b.timestamp));
    });
  }, [todayLogs]);

  const renderHeader = () => {
    if (sortedLogs.length === 0) return null;
    return (
      <View style={styles.header}>
        <Typography variant="h4">{t("cbt.main_title")}</Typography>
      </View>
    );
  };

  return (
    <>
      {renderHeader()}
      <FlatList
        data={sortedLogs}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.logsList, { paddingBottom }]}
        ListEmptyComponent={placeholder}
        renderItem={({ item }) => (
          <LogListItem
            key={item.id}
            log={item}
            onPress={onCardPress}
            onDelete={onDelete}
          />
        )}
        showsVerticalScrollIndicator={false}
      />
    </>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
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
