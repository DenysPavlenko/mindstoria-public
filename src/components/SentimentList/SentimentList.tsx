import { TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  ListRenderItem,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { SentimentIconButton } from "../SentimentIconButton/SentimentIconButton";

const SCREEN_WIDTH = Dimensions.get("window").width;
const NUM_COLUMNS = SCREEN_WIDTH > 500 ? 4 : 3;

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
      numColumns={NUM_COLUMNS}
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
      width: `${100 / NUM_COLUMNS}%`,
      paddingHorizontal: theme.layout.spacing.xs,
      paddingTop: theme.layout.spacing.md,
      paddingBottom: theme.layout.spacing.sm,
    },
  });
