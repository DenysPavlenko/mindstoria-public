import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TSentimentDefinition, TSentimentType } from "@/types";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { FlatList, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Chip } from "../Chip/Chip";
import { Divider } from "../Divider/Divider";
import { SelectionGridCard } from "../SelectionGridCard/SelectionGridCard";
import { Typography } from "../Typography/Typography";

const CTA_HEIGHT = 68;

interface SentimentSelectionCardProps {
  title: string;
  items: TSentimentDefinition[];
  topItems: TSentimentDefinition[];
  sentimentType: TSentimentType;
  onButtonPress: (id: string) => void;
  selectedMap: Record<string, boolean>;
  onAddPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export function SentimentSelectionCard({
  title,
  items,
  topItems,
  onButtonPress,
  onAddPress,
  selectedMap,
  style,
  sentimentType,
}: SentimentSelectionCardProps) {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const showTopSelection = topItems.length > 0;

  const renderTopSelectionItem = useCallback(
    ({ item }: { item: TSentimentDefinition }) => {
      const iconProp =
        sentimentType === "emotion"
          ? {
              customIcon: (
                <Typography style={{ fontSize: 16, lineHeight: 24 }}>
                  {item.icon}
                </Typography>
              ),
            }
          : { icon: item.icon as FeatherIconName };
      return (
        <Chip
          label={t(item.name)}
          disabled={item.isArchived}
          onPress={() => onButtonPress(item.id)}
          {...iconProp}
        />
      );
    },
    [sentimentType, onButtonPress, t],
  );

  const renderFooter = () => {
    if (!showTopSelection) return null;
    return (
      <View>
        <Divider />
        <FlatList
          data={topItems}
          horizontal
          showsHorizontalScrollIndicator={false}
          keyExtractor={(item) => item.id}
          renderItem={renderTopSelectionItem}
          contentContainerStyle={styles.topSelectionList}
        />
      </View>
    );
  };

  return (
    <SelectionGridCard
      sentimentType={sentimentType}
      items={items}
      selectedMap={selectedMap}
      onItemPress={(item) => onButtonPress(item.id)}
      showAddButton
      addButtonTitle={t("common.add")}
      onAddPress={onAddPress}
      header={<Typography variant="h5">{title}</Typography>}
      headerStyle={styles.header}
      footer={renderFooter()}
      style={[
        styles.container,
        { paddingBottom: showTopSelection ? 0 : theme.layout.spacing.lg },
        style,
      ]}
    />
  );
}

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.layout.spacing.lg,
      overflow: "hidden",
    },
    header: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    topSelectionList: {
      flexDirection: "row",
      padding: theme.layout.spacing.lg,
      gap: theme.layout.spacing.sm,
    },
    buttonContainer: {
      height: CTA_HEIGHT,
      justifyContent: "center",
      paddingHorizontal: theme.layout.spacing.lg,
    },
  });
