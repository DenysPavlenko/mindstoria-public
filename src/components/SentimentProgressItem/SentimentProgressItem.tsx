import { RANGE_MAX_LEVEL } from "@/appConstants";
import { DISABLED_ALPHA, TTheme, useTheme } from "@/theme";
import { TSentimentCategory, TSentimentLevel, TSentimentType } from "@/types";
import { getSentimentColor } from "@/utils";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { IconBox } from "../IconBox/IconBox";
import { ProgressBar } from "../ProgressBar/ProgressBar";
import { Typography } from "../Typography/Typography";

interface SentimentProgressItemProps {
  name: string;
  category: TSentimentCategory;
  type: TSentimentType;
  level: TSentimentLevel;
  icon: string | FeatherIconName;
  count: number;
  isArchived?: boolean;
}

export const SentimentProgressItem = ({
  name,
  category,
  icon,
  count,
  type,
  level,
  isArchived,
}: SentimentProgressItemProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  // Create theme-aware styles (memoized for performance)
  const styles = useMemo(() => createStyles(theme), [theme]);

  const iconBoxProps =
    category === "emotion"
      ? { customContent: <Typography>{icon}</Typography> }
      : { icon: icon as FeatherIconName };

  const color = getSentimentColor(type, level, theme);

  const progress = Math.min(level / RANGE_MAX_LEVEL, 1);

  return (
    <View
      key={name}
      style={[styles.container, isArchived && { opacity: DISABLED_ALPHA }]}
    >
      <IconBox {...iconBoxProps} radius="lg" />
      <View style={styles.content}>
        <View style={styles.header}>
          <View style={styles.nameContainer}>
            <Typography variant="smallBold" numberOfLines={1}>
              {isArchived ? `(${t("common.archived")})` : ""} {name}
            </Typography>
          </View>
          <Typography variant="smallBold" color="outline">
            {t("common.entry_count", { count: count })}
          </Typography>
        </View>
        <ProgressBar
          backgroundColor="surfaceVariant"
          progressStyle={{ backgroundColor: color }}
          progress={progress}
        />
      </View>
    </View>
  );
};

const createStyles = (theme: TTheme) => {
  return StyleSheet.create({
    container: {
      flex: 1,
      gap: theme.layout.spacing.md,
      flexDirection: "row",
      alignItems: "center",
    },
    content: {
      flex: 1,
      gap: theme.layout.spacing.sm,
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.layout.spacing.sm,
    },
    nameContainer: {
      flex: 1,
    },
  });
};
