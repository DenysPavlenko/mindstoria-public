import { Typography } from "@/components";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TCBTLog } from "@/types";
import { getRelativeDayTitle } from "@/utils";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { SectionList, StyleSheet } from "react-native";
import { LogListItem } from "./LogListItem";

interface LogsSectionListProps {
  logs: TCBTLog[];
  onCardPress: (log: TCBTLog) => void;
  onDelete: (log: TCBTLog) => void;
  placeholder: React.ReactElement;
  paddingBottom: number;
}

export const LogsSectionList = ({
  logs,
  onCardPress,
  onDelete,
  placeholder,
  paddingBottom,
}: LogsSectionListProps) => {
  const { theme } = useTheme();

  const { t, i18n } = useTranslation();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const sortedLogs = useMemo(() => {
    return [...logs].slice().sort((a, b) => {
      return dayjs(b.timestamp).diff(dayjs(a.timestamp));
    });
  }, [logs]);

  const sections = useMemo(() => {
    const grouped: { title: string; data: TCBTLog[] }[] = [];
    let currentDate = "";

    sortedLogs.forEach((log) => {
      const logDate = dayjs(log.timestamp).format("YYYY-MM-DD");
      if (logDate !== currentDate) {
        currentDate = logDate;
        grouped.push({
          title: getRelativeDayTitle(dayjs(log.timestamp), t, i18n.language),
          data: [log],
        });
      } else {
        const lastGroup = grouped[grouped.length - 1];
        if (lastGroup) {
          lastGroup.data.push(log);
        }
      }
    });

    return grouped;
  }, [sortedLogs, t, i18n.language]);

  return (
    <>
      <SectionList
        sections={sections}
        keyExtractor={(item) => item.id}
        contentContainerStyle={[styles.logsList, { paddingBottom }]}
        ListEmptyComponent={placeholder}
        renderItem={({ item }) => (
          <LogListItem log={item} onPress={onCardPress} onDelete={onDelete} />
        )}
        renderSectionHeader={({ section: { title } }) => (
          <Typography variant="smallBold">{title}</Typography>
        )}
        showsVerticalScrollIndicator={false}
        stickySectionHeadersEnabled={false}
      />
    </>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    logsList: {
      flexGrow: 1,
      paddingTop: theme.layout.spacing.lg,
      paddingHorizontal: theme.layout.spacing.lg,
      gap: theme.layout.spacing.sm,
    },
  });
