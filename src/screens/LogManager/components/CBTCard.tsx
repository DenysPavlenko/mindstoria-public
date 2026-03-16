import { ANALYTICS_EVENTS } from "@/analytics-constants";
import {
  Card,
  CTAButton,
  IconButton,
  InfoModal,
  Typography,
} from "@/components";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { trackEvent } from "@/utils/analytics";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface CBTCardProps {
  date: string;
  cbtLogId: string | null;
  canConnect: boolean;
  onSave: () => string | null;
}

export const CBTCard = ({
  date,
  cbtLogId,
  canConnect,
  onSave,
}: CBTCardProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [showInfoModal, setShowInfoModal] = useState(false);
  const styles = useMemo(() => createStyles(theme), [theme]);
  const router = useRouter();

  const handleConnectJournal = () => {
    if (!canConnect) return;
    const wellbeingLogId = onSave();
    if (!wellbeingLogId) return;
    router.navigate({
      pathname: "/cbt-log-manager",
      params: {
        date,
        wellbeingLogId,
        logId: cbtLogId,
      },
    });
    trackEvent(ANALYTICS_EVENTS.CBT_LOG_STARTED, {
      mode: "create",
      source: "mood_log",
    });
  };

  const renderInfoModal = () => {
    return (
      <InfoModal
        title={t("cbt.enhance_your_log")}
        content={t("cbt.connect_thought_journal_description")}
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
      />
    );
  };

  return (
    <Card style={styles.container}>
      <View style={styles.header}>
        <Typography style={styles.headerTitle} variant="h6">
          {t("cbt.main_title")}
        </Typography>
        <IconButton
          icon="info"
          variant="text"
          size="md"
          edge={["end", "vertical"]}
          onPress={() => setShowInfoModal(true)}
        />
      </View>
      <CTAButton
        disabled={!canConnect}
        onPress={handleConnectJournal}
        label={
          cbtLogId
            ? t("cbt.edit_thought_journal")
            : t("cbt.connect_thought_journal")
        }
      />
      {renderInfoModal()}
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.layout.spacing.lg,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    },
    headerTitle: {
      flex: 1,
    },
  });
