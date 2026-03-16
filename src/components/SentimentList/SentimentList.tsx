import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { TSentimentDefinition } from "@/types";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  Dimensions,
  FlatList,
  FlatListProps,
  ListRenderItem,
  StyleSheet,
  View,
} from "react-native";
import { SentimentIconButton } from "../SentimentIconButton/SentimentIconButton";

const SCREEN_WIDTH = Dimensions.get("window").width;
const NUM_COLUMNS = SCREEN_WIDTH > 500 ? 5 : 4;

interface SentimentListProps extends Omit<
  FlatListProps<TSentimentDefinition>,
  "renderItem"
> {
  renderItem: ListRenderItem<TSentimentDefinition>;
  searchQuery?: string;
  onAddPress?: () => void;
}

export const SentimentList = ({
  ListEmptyComponent,
  renderItem,
  style,
  searchQuery,
  onAddPress,
  ...listProps
}: SentimentListProps) => {
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
      numColumns={NUM_COLUMNS}
      contentContainerStyle={[styles.container, style]}
      ListEmptyComponent={renderListEmpty()}
      showsVerticalScrollIndicator={false}
      renderItem={(props) => {
        return <View style={styles.item}>{renderItem(props)}</View>;
      }}
      {...listProps}
    />
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      gap: theme.layout.spacing.sm,
      marginHorizontal: -theme.layout.spacing.xxs,
    },
    item: {
      width: `${100 / NUM_COLUMNS}%`,
      paddingHorizontal: theme.layout.spacing.xs,
    },
  });
