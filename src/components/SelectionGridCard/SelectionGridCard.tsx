import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TSentimentDefinition, TSentimentType } from "@/types";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Card } from "../Card/Card";
import { SentimentIconButton } from "../SentimentIconButton/SentimentIconButton";

interface SelectionGridCardProps {
  header?: ReactNode;
  footer?: ReactNode;
  sentimentType: TSentimentType;
  items: TSentimentDefinition[];
  selectedMap: Record<string, boolean>;
  onItemPress: (item: TSentimentDefinition, isSelected: boolean) => void;
  onItemLongPress?: (item: TSentimentDefinition) => void;
  showAddButton?: boolean;
  addButtonTitle?: string;
  onAddPress?: () => void;
  columns?: number;
  style?: StyleProp<ViewStyle>;
  headerStyle?: StyleProp<ViewStyle>;
}

export const SelectionGridCard = ({
  header,
  footer,
  sentimentType,
  items,
  selectedMap,
  onItemPress,
  onItemLongPress,
  showAddButton = false,
  addButtonTitle,
  onAddPress,
  columns = 4,
  style,
  headerStyle,
}: SelectionGridCardProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const styles = useMemo(() => createStyles(theme, columns), [theme, columns]);

  return (
    <Card style={[styles.card, style]} noHorizontalPadding>
      <View style={[styles.header, headerStyle]}>{header}</View>
      <View style={styles.grid}>
        {items.map((item) => {
          const isSelected = Boolean(selectedMap[item.id]);
          return (
            <View key={item.id} style={styles.gridItem}>
              <SentimentIconButton
                title={t(item.name)}
                icon={item.icon}
                sentimentType={sentimentType}
                isSelected={isSelected}
                isArchived={item.isArchived}
                onPress={() => onItemPress(item, isSelected)}
                onLongPress={
                  onItemLongPress ? () => onItemLongPress(item) : undefined
                }
              />
            </View>
          );
        })}
        {showAddButton && (
          <View style={styles.gridItem}>
            <SentimentIconButton
              title={addButtonTitle || t("common.add_new")}
              icon="plus"
              onPress={onAddPress}
              iconProps={{
                color: "surfaceVariant",
                iconColor: "onSurfaceVariant",
              }}
            />
          </View>
        )}
      </View>
      {footer}
    </Card>
  );
};

const createStyles = (theme: TTheme, columns: number) =>
  StyleSheet.create({
    card: {
      gap: theme.layout.spacing.md,
    },
    header: {
      paddingHorizontal: theme.layout.spacing.lg,
    },
    grid: {
      flexDirection: "row",
      flexWrap: "wrap",
      marginVertical: -theme.layout.spacing.sm,
    },
    gridItem: {
      width: `${100 / columns}%`,
      paddingVertical: theme.layout.spacing.sm,
    },
  });
