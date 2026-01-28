import { useTheme } from "@/providers";
import { useAppSelector } from "@/store";
import { TTheme } from "@/theme";
import { TCBTLog } from "@/types";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { IconButton } from "../IconButton/IconButton";
import { LogPreviewContent } from "../LogPreview/LogPreviewContent";
import { Pill } from "../Pill/Pill";
import { SlideInModal } from "../SlideInModal/SlideInModal";
import { SwitchSelector } from "../SwitchSelector/SwitchSelector";
import { CBTLogPreviewContent } from "./CBTLogPreviewContent";

interface CBTLogPreviewProps {
  log: TCBTLog;
  onClose: () => void;
}

export const CBTLogPreview = ({ log, onClose }: CBTLogPreviewProps) => {
  const { theme } = useTheme();
  const router = useRouter();
  const { t } = useTranslation();
  const [tab, setTab] = useState<"wellbeing" | "thought">("thought");
  const wellbeingLogs = useAppSelector((state) => state.logs.items);

  const wellbeingLog = useMemo(() => {
    if (!log.wellbeingLogId) return null;
    return wellbeingLogs[log.wellbeingLogId];
  }, [log.wellbeingLogId, wellbeingLogs]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const formattedTime = useMemo(() => {
    return dayjs(log.timestamp).format("HH:mm");
  }, [log.timestamp]);

  const handleEdit = () => {
    onClose();
    router.navigate({
      pathname: "/cbt-log-manager",
      params: { logId: log.id },
    });
  };

  const renderSwitch = () => {
    if (!wellbeingLog) return null;
    return (
      <SwitchSelector
        selectedValue={tab}
        onChange={setTab}
        options={[
          { label: t("common.thought"), value: "thought" },
          { label: t("wellbeing.title"), value: "wellbeing" },
        ]}
      />
    );
  };

  const renderLog = () => {
    if (!wellbeingLog) return null;
    return <LogPreviewContent log={wellbeingLog} />;
  };

  const renderCBTLog = () => {
    return <CBTLogPreviewContent log={log} />;
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

  const renderContent = () => {
    if (tab === "thought") {
      return renderCBTLog();
    }
    return renderLog();
  };

  return (
    <SlideInModal visible onClose={onClose} title={renderTitle()}>
      {renderContent()}
    </SlideInModal>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    list: {
      paddingHorizontal: theme.layout.spacing.lg,
      gap: theme.layout.spacing.sm,
    },
    titleContainer: {
      flex: 1,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      gap: theme.layout.spacing.sm,
      paddingRight: theme.layout.spacing.sm,
    },
  });
