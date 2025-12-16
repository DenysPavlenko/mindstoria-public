import WelcomeIllustration from "@/assets/images/welcome-illustration.svg";
import { Button, SafeView, Typography } from "@/components";
import { TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface CBTConnectProps {
  onClose: () => void;
  onConnectThoughtJournal: () => void;
  hasConnectedLog: boolean;
}

export const CBTConnect = ({
  onClose,
  onConnectThoughtJournal,
  hasConnectedLog,
}: CBTConnectProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const handleConnectJournal = () => {
    onClose();
    onConnectThoughtJournal();
  };

  const iconSize = 240;

  return (
    <SafeView direction="vertical" style={styles.container}>
      <View style={styles.content}>
        <View
          style={{
            width: iconSize,
            height: iconSize,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <WelcomeIllustration
            width={iconSize * 1.5}
            height={iconSize * 1.5}
            fill={theme.colors.outlineVariant}
          />
        </View>
        <View style={styles.textContainer}>
          <Typography variant="h4" style={styles.title}>
            {hasConnectedLog
              ? t("cbt.edit_connection")
              : t("cbt.enhance_your_log")}
          </Typography>
          <Typography variant="body" color="outline" style={styles.description}>
            {hasConnectedLog
              ? t("cbt.edit_connection_description")
              : t("cbt.connect_thought_journal_description")}
          </Typography>
        </View>
      </View>
      <View style={styles.buttons}>
        <Button onPress={handleConnectJournal}>
          {hasConnectedLog
            ? t("cbt.edit_thought_journal")
            : t("cbt.connect_thought_journal")}
        </Button>
        <Button onPress={onClose} variant="text">
          {hasConnectedLog ? t("common.cancel") : t("common.maybe_later")}
        </Button>
      </View>
    </SafeView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.layout.spacing.lg,
    },
    content: {
      flex: 1,
      paddingBottom: theme.layout.spacing.xl,
      gap: theme.layout.spacing.lg,
      alignItems: "center",
      justifyContent: "center",
    },
    textContainer: {
      gap: theme.layout.spacing.sm,
      maxWidth: 500,
    },
    title: {
      textAlign: "center",
    },
    description: {
      textAlign: "center",
      lineHeight: 24,
    },
    buttons: {
      gap: theme.layout.spacing.sm,
    },
  });
