import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TCBTLog } from "@/types";
import Feather from "@react-native-vector-icons/feather";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Card } from "../Card/Card";
import { IconBox } from "../IconBox/IconBox";
import { Pill } from "../Pill/Pill";
import { Typography } from "../Typography/Typography";

interface CBTCardProps {
  log: TCBTLog;
  onPress: () => void;
}

export const CBTCard = ({ log, onPress }: CBTCardProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { timestamp, values } = log;
  const { situation } = values;

  const styles = useMemo(() => createStyles(theme), [theme]);

  const formattedTime = useMemo(() => {
    return dayjs(timestamp).format("HH:mm");
  }, [timestamp]);

  return (
    <Card onPress={onPress} style={{ overflow: "hidden" }}>
      <View style={styles.container}>
        <IconBox size="lg" icon="feather" />
        <View style={styles.content}>
          <View style={styles.header}>
            <Typography variant="h5">{t("cbt.situation")}</Typography>
            <View style={styles.rightSection}>
              {log.wellbeingLogId && (
                <Feather
                  name="link-2"
                  size={theme.layout.size.xxs}
                  color={theme.colors.primary}
                />
              )}
              <Pill label={formattedTime} />
            </View>
          </View>
          <Typography variant="smallSemibold" numberOfLines={3}>
            {situation}
          </Typography>
        </View>
      </View>
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      gap: theme.layout.spacing.md,
    },
    content: {
      flex: 1,
      gap: theme.layout.spacing.xs,
    },
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      gap: theme.layout.spacing.md,
    },
    rightSection: {
      alignItems: "center",
      gap: theme.layout.spacing.sm,
      flexDirection: "row",
    },
  });
