import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TEmotionStats, TImpactStats, TSentimentType } from "@/types";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Placeholder } from "../Placeholder/Placeholder";
import { SentimentIconButton } from "../SentimentIconButton/SentimentIconButton";
import { Typography } from "../Typography/Typography";

interface SentimentStatsCardProps {
  title: string;
  stats: TImpactStats | TEmotionStats;
  style?: StyleProp<ViewStyle>;
  sentimentType: TSentimentType;
}

export const SentimentStatsCard = ({
  title,
  stats,
  style,
  sentimentType,
}: SentimentStatsCardProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const data = useMemo(() => {
    return stats.data.slice(0, 6);
  }, [stats]);

  const hasData = data.length > 0;

  const handleViewAllPress = () => {
    router.push({
      pathname: "/sentiment-stats",
      params: { sentimentType },
    });
  };

  const renderPlaceholder = () => {
    return (
      <View style={styles.placeholder}>
        <Placeholder hideIcon content={t("common.not_enough_data")} />
      </View>
    );
  };

  const renderList = () => {
    if (!hasData) {
      return renderPlaceholder();
    }
    return (
      <View style={styles.listContainer}>
        {data.map((item) => {
          return (
            <View key={item.id} style={styles.listItemContainer}>
              <View key={item.id} style={styles.listItem}>
                <SentimentIconButton
                  title={t(item.name)}
                  sentimentType={sentimentType}
                  icon={item.icon}
                  counter={item.count}
                  isArchived={item.isArchived}
                />
              </View>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <Card style={style}>
      <View style={styles.header}>
        <Typography variant="h5">{title}</Typography>
        {hasData && (
          <Button
            color="secondaryContainer"
            textColor="onSecondaryContainer"
            onPress={handleViewAllPress}
            size="sm"
          >
            {t("common.view_all")}
          </Button>
        )}
      </View>
      {renderList()}
    </Card>
  );
};

const createStyles = (theme: TTheme) => {
  return StyleSheet.create({
    header: {
      marginBottom: theme.layout.spacing.lg,
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    placeholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.layout.spacing.xl,
    },
    listContainer: {
      flexDirection: "row",
      flexWrap: "wrap",
      margin: -theme.layout.spacing.xs,
    },
    listItemContainer: {
      width: `${100 / 3}%`,
      flexGrow: 1,
      padding: theme.layout.spacing.xs,
    },
    listItem: {
      backgroundColor: theme.colors.surfaceContainerHigh,
      padding: theme.layout.spacing.md,
      borderRadius: theme.layout.borderRadius.md,
      flex: 1,
    },
  });
};
