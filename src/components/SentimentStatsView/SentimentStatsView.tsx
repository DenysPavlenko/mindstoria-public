import { TTheme, useTheme } from "@/theme";
import {
  TEmotionStatsItem,
  TImpactStatsItem,
  TSentimentCategory,
  TSentimentType,
} from "@/types";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Button } from "../Button/Button";
import { Card } from "../Card/Card";
import { Placeholder } from "../Placeholder/Placeholder";
import { SentimentIconButton } from "../SentimentIconButton/SentimentIconButton";
import { SentimentList } from "../SentimentList/SentimentList";
import { SentimentStatsFilter } from "../SentimentStatsFilter/SentimentStatsFilter";
import { Typography } from "../Typography/Typography";

interface SentimentStatsViewProps {
  title: string;
  data: (TImpactStatsItem | TEmotionStatsItem)[];
  style?: StyleProp<ViewStyle>;
  category: TSentimentCategory;
}

const MAX_VISIBLE_ITEMS = 6;

export const SentimentStatsView = ({
  title,
  data,
  style,
  category,
}: SentimentStatsViewProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const [type, setType] = useState<TSentimentType | null>(null);
  const router = useRouter();

  // Create theme-aware styles (memoized for performance)
  const styles = useMemo(() => createStyles(theme), [theme]);

  const dataToRender = useMemo(() => {
    return data.filter((item) => (type ? item.type === type : true));
  }, [type, data]);

  const handleShowMore = () => {
    if (category === "emotion") {
      router.navigate("/emotions-stats");
    } else if (category === "impact") {
      router.navigate("/impacts-stats");
    }
  };

  const renderPlaceholder = () => {
    return (
      <View style={styles.placeholder}>
        <Placeholder hideIcon content={t("common.not_enough_data")} />
      </View>
    );
  };

  const renderItem = ({
    item,
  }: {
    item: TImpactStatsItem | TEmotionStatsItem;
  }) => {
    return (
      <SentimentIconButton
        title={t(item.name)}
        category={category}
        icon={item.icon}
        isArchived={item.isArchived}
        counter={item.count}
        type={item.type}
      />
    );
  };

  const renderList = () => {
    return (
      <SentimentList
        data={dataToRender.slice(0, MAX_VISIBLE_ITEMS)}
        renderItem={renderItem}
        ListEmptyComponent={renderPlaceholder}
        keyExtractor={(item) => item.id}
      />
    );
  };

  const renderShowMoreButton = () => {
    if (dataToRender.length === 0) return null;
    return (
      <View style={styles.showMoreButton}>
        <Button variant="text" textColor="primary" onPress={handleShowMore}>
          {t("common.show_more")}
        </Button>
      </View>
    );
  };

  const renderFilter = () => {
    return (
      <SentimentStatsFilter
        type={type}
        onTypeChange={setType}
        style={styles.filter}
        hideSearch
      />
    );
  };

  return (
    <Card style={style}>
      <Typography variant="h5" style={styles.title}>
        {title}
      </Typography>
      {renderFilter()}
      {renderList()}
      {renderShowMoreButton()}
    </Card>
  );
};

const createStyles = (theme: TTheme) => {
  return StyleSheet.create({
    title: {
      marginBottom: theme.layout.spacing.md,
    },
    filter: {
      marginBottom: theme.layout.spacing.md,
    },
    placeholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.layout.spacing.xl,
    },
    showMoreButton: {
      paddingTop: theme.layout.spacing.md,
      alignItems: "flex-start",
    },
    itemContainer: {
      flex: 1,
      gap: theme.layout.spacing.md,
      flexDirection: "row",
      alignItems: "center",
    },
    itemContent: {
      flex: 1,
      gap: theme.layout.spacing.sm,
    },
    itemHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      gap: theme.layout.spacing.sm,
    },
    itemNameContainer: {
      flex: 1,
    },
    switchLabelContainer: {
      alignItems: "center",
      flexDirection: "row",
      justifyContent: "center",
      gap: theme.layout.spacing.xs,
    },
    switchIndicator: {
      height: 8,
      width: 8,
      borderRadius: 4,
    },
  });
};
