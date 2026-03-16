import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import {
  TEmotionStatsItem,
  TImpactStatsItem,
  TSentimentType,
} from "@/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Placeholder } from "../Placeholder/Placeholder";
import { SentimentIconButton } from "../SentimentIconButton/SentimentIconButton";
import { Typography } from "../Typography/Typography";

interface SentimentRatingListProps {
  data: TImpactStatsItem[] | TEmotionStatsItem[];
  sentimentType: TSentimentType;
  style?: StyleProp<ViewStyle>;
  listStyle?: StyleProp<ViewStyle>;
}

export const SentimentRatingList = ({
  sentimentType,
  data,
  style,
  listStyle,
}: SentimentRatingListProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme), [theme]);
  const renderPlaceholder = () => (
    <View style={styles.placeholder}>
      <Placeholder content={t("common.no_data")} />
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <FlatList
        data={data}
        contentContainerStyle={[
          styles.listContent,
          !data.length && { flexGrow: 1 },
          listStyle,
        ]}
        keyExtractor={(item) => item.id}
        ListEmptyComponent={renderPlaceholder()}
        showsVerticalScrollIndicator={false}
        renderItem={({ item, index }) => {
          return (
            <View style={styles.item}>
              <View style={styles.itemText}>
                <Typography variant="h6">{index + 1}</Typography>
              </View>
              <SentimentIconButton
                title={t(item.name)}
                icon={item.icon}
                isArchived={item.isArchived}
                counter={item.count}
                sentimentType={sentimentType}
                layout="horizontal"
              />
            </View>
          );
        }}
      />
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingLeft: theme.layout.spacing.md,
    },
    listContent: {
      gap: theme.layout.spacing.lg,
      paddingVertical: theme.layout.spacing.lg,
    },
    placeholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: theme.layout.spacing.xl,
    },
    item: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.layout.spacing.xs,
    },
    itemText: {
      width: theme.layout.size.sm,
      alignItems: "center",
    },
  });
