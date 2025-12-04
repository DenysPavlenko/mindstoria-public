import { TTheme, useTheme } from "@/theme";
import { TLog } from "@/types";
import {
  getRatingLevelColor,
  getRatingLevelLabel,
  getWellbeingIcon,
} from "@/utils";
import Feather from "@react-native-vector-icons/feather";
import dayjs from "dayjs";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Card } from "../Card/Card";
import { IconBox } from "../IconBox/IconBox";
import { Pill } from "../Pill/Pill";
import { Typography } from "../Typography/Typography";

interface LogCardProps {
  log: TLog;
  onPress: () => void;
  hasConnectedCBT?: boolean;
}

export const LogCard = ({ log, onPress, hasConnectedCBT }: LogCardProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const { timestamp, values } = log;
  const { wellbeing, impacts, emotions } = values;

  const styles = useMemo(() => createStyles(theme), [theme]);

  const formattedTime = useMemo(() => {
    return dayjs(timestamp).format("HH:mm");
  }, [timestamp]);

  const color = getRatingLevelColor(wellbeing, theme);

  const Icon = getWellbeingIcon(wellbeing);

  const iconSize = theme.layout.size.lg;

  const renderInfo = () => {
    let text = "";
    if (impacts.length > 0) {
      text = t("impacts.impact", { count: impacts.length });
    }
    if (emotions.length > 0) {
      if (text.length > 0) {
        text += ", ";
      }
      text += t("emotions.emotion", { count: emotions.length });
    }
    if (text.length === 0) return null;
    return (
      <Typography variant="smallBold" color="outline" numberOfLines={1}>
        {text} {t("common.logged").toLowerCase()}
      </Typography>
    );
  };

  return (
    <Card bgColor="surface" onPress={onPress}>
      <View style={styles.container}>
        <IconBox
          size="lg"
          customContent={
            Icon && (
              <Icon
                height={iconSize}
                width={iconSize}
                fill={theme.colors.surface}
              />
            )
          }
          radius="lg"
          style={{ backgroundColor: color }}
        />
        <View style={{ flex: 1 }}>
          <Typography variant="h5" numberOfLines={1}>
            {t("common.i_feel")} {getRatingLevelLabel(wellbeing, t)}
          </Typography>
          {renderInfo()}
        </View>
        <View
          style={{
            flexDirection: "row",
            marginLeft: "auto",
            alignItems: "center",
            gap: theme.layout.spacing.lg,
          }}
        >
          <View style={styles.divider} />
          <View style={styles.rightSection}>
            <Pill label={formattedTime} />
            {hasConnectedCBT && (
              <Feather
                name="link-2"
                size={theme.layout.size.xxs}
                color={theme.colors.primary}
              />
            )}
          </View>
        </View>
      </View>
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.layout.spacing.md,
      flexDirection: "row",
      alignItems: "center",
    },
    iconContainer: {
      borderRadius: theme.layout.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
    },
    divider: {
      width: 1,
      height: theme.layout.size.lg,
      backgroundColor: theme.colors.surfaceVariant,
    },
    rightSection: {
      alignItems: "center",
      gap: theme.layout.spacing.xxs,
    },
  });
