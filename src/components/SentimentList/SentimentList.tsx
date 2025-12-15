import { TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SentimentIconButton } from "../SentimentIconButton/SentimentIconButton";

interface SentimentListProps<T> {
  data: T[];
  style?: StyleProp<ViewStyle>;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
  renderItem: ListRenderItem<T>;
  keyExtractor?: (item: T, index: number) => string;
  searchQuery?: string;
  onAddPress?: () => void;
}

export const SentimentList = <T,>({
  data,
  ListEmptyComponent,
  renderItem,
  style,
  searchQuery,
  onAddPress,
  keyExtractor,
}: SentimentListProps<T>) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderListEmpty = () => {
    if (ListEmptyComponent) {
      return ListEmptyComponent;
    }

    return (
      <SentimentIconButton
        title={`${t("common:add")} "${searchQuery}"`}
        icon="plus"
        style={styles.item}
        onPress={onAddPress}
      />
    );
  };

  return (
    <FlatList
      data={data}
      numColumns={3}
      contentContainerStyle={style}
      keyExtractor={keyExtractor}
      ListEmptyComponent={renderListEmpty()}
      showsVerticalScrollIndicator={false}
      renderItem={(props) => {
        return <View style={styles.item}>{renderItem(props)}</View>;
      }}
    />
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    item: {
      width: `${100 / 3}%`,
      paddingHorizontal: theme.layout.spacing.xs,
      paddingTop: theme.layout.spacing.md,
      paddingBottom: theme.layout.spacing.sm,
    },
  });
