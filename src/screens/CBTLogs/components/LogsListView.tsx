import { CBTLogPreview, Header, IconButton, Typography } from "@/components";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TCBTLog } from "@/types";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { LogsList } from "./LogsList/LogsList";

export const LogsListView = () => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const [selectedLog, setSelectedLog] = useState<TCBTLog | null>(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderHeader = () => {
    return (
      <Header
        leftContent={
          <Typography variant="h4">{t("cbt.main_title")}</Typography>
        }
        rightContent={
          <IconButton
            icon="settings"
            variant="text"
            edge={["end"]}
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

  return (
    <View style={styles.container}>
      {renderHeader()}
      <View style={styles.wrapper}>
        <LogsList onCardPress={setSelectedLog} viewType="list" />
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
