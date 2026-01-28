import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { useTheme } from "@/providers";
import { useAppSelector } from "@/store";
import { TTheme } from "@/theme";
import { TLog } from "@/types";
import { trackEvent } from "@/utils";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { CBTLogPreviewContent } from "../CBTLogPreview/CBTLogPreviewContent";
import { IconButton } from "../IconButton/IconButton";
import { Pill } from "../Pill/Pill";
import { SlideInModal } from "../SlideInModal/SlideInModal";
import { SwitchSelector } from "../SwitchSelector/SwitchSelector";
import { LogPreviewContent } from "./LogPreviewContent";

interface LogPreviewProps {
  log: TLog;
  onClose: () => void;
  connectedCBTId?: string;
}

export const LogPreview = ({
  log,
  onClose,
  connectedCBTId,
}: LogPreviewProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const router = useRouter();
  const cbtLogs = useAppSelector((state) => state.cbtLogs.items);
  const [tab, setTab] = useState<"wellbeing" | "thought">("wellbeing");

  const cbtLog = useMemo(() => {
    if (!connectedCBTId) return null;
    return cbtLogs[connectedCBTId];
  }, [connectedCBTId, cbtLogs]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const formattedTime = useMemo(() => {
    return dayjs(log.timestamp).format("HH:mm");
  }, [log.timestamp]);

  const handleEdit = (metricId?: string) => {
    onClose();
    router.navigate({
      pathname: "/log-manager",
      params: {
        logId: log.id,
        metricId,
      },
    });
    trackEvent(ANALYTICS_EVENTS.MOOD_LOG_STARTED, { mode: "edit" });
  };

  const renderSwitch = () => {
    if (!cbtLog) return null;
    return (
      <SwitchSelector
        selectedValue={tab}
        onChange={setTab}
        options={[
          { label: t("wellbeing.title"), value: "wellbeing" },
          { label: t("common.thought"), value: "thought" },
        ]}
      />
    );
  };

  const renderTitle = () => {
    return (
      <View style={styles.titleContainer}>
        <Pill label={formattedTime} />
        {renderSwitch()}
        <IconButton size="md" icon="edit-2" onPress={() => handleEdit()} />
      </View>
    );
  };

  const renderLog = () => {
    return <LogPreviewContent log={log} />;
  };

  const renderCBTLog = () => {
    if (!cbtLog) return null;
    return <CBTLogPreviewContent log={cbtLog} />;
  };

  const renderContent = () => {
    if (tab === "wellbeing") {
      return renderLog();
    }
    return renderCBTLog();
  };

  return (
    <SlideInModal visible onClose={onClose} title={renderTitle()}>
      {renderContent()}
    </SlideInModal>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    titleContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.layout.spacing.sm,
      paddingRight: theme.layout.spacing.sm,
    },
  });
