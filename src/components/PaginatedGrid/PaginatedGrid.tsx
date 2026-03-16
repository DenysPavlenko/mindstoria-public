import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { useCallback, useMemo, useRef, useState } from "react";
import {
  FlatList,
  LayoutChangeEvent,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

interface PaginatedGridProps<T> {
  data: T[];
  cols?: number;
  rows?: number;
  renderItem: ({ item, index }: { item: T; index: number }) => React.ReactNode;
  keyExtractor: (item: T) => string;
  containerWidth?: number;
  style?: StyleProp<ViewStyle>;
  ListEmptyComponent?: React.ComponentType<any> | React.ReactElement | null;
}

function chunkArray<T>(arr: T[], size: number): T[][] {
  const chunks: T[][] = [];
  for (let i = 0; i < arr.length; i += size) {
    chunks.push(arr.slice(i, i + size));
  }
  return chunks;
}

export function PaginatedGrid<T>({
  data,
  cols = 4,
  rows = 2,
  renderItem,
  keyExtractor,
  style,
  ListEmptyComponent,
}: PaginatedGridProps<T>) {
  const { theme } = useTheme();
  const [activeIndex, setActiveIndex] = useState(0);
  const [containerWidth, setContainerWidth] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const itemsPerPage = cols * rows;

  const pages = useMemo(
    () => chunkArray(data, itemsPerPage),
    [data, itemsPerPage],
  );
  const styles = useMemo(() => createStyles(theme, cols), [theme, cols]);

  const viewabilityConfig = useRef({
    viewAreaCoveragePercentThreshold: 50,
  }).current;

  const onViewableItemsChanged = useCallback(
    ({ viewableItems }: { viewableItems: { index: number | null }[] }) => {
      const firstIndex = viewableItems[0]?.index;
      if (typeof firstIndex === "number") {
        setActiveIndex(firstIndex);
      }
    },
    [],
  );

  const handleLayout = useCallback(
    (event: LayoutChangeEvent) => {
      const { width } = event.nativeEvent.layout;
      setContainerWidth(width);
    },
    [setContainerWidth],
  );

  const renderPage = useCallback(
    ({ item: page }: { item: T[] }) => (
      <View style={[styles.page, { width: containerWidth }]}>
        {page.map((item, index) => (
          <View key={keyExtractor(item)} style={styles.cell}>
            {renderItem({ item, index })}
          </View>
        ))}
      </View>
    ),
    [containerWidth, keyExtractor, renderItem, styles],
  );

  if (containerWidth === 0) {
    return <View style={{ flex: 1 }} onLayout={handleLayout} />;
  }

  return (
    <View style={style}>
      <FlatList
        ref={flatListRef}
        data={pages}
        horizontal
        pagingEnabled
        contentContainerStyle={styles.container}
        ListEmptyComponent={ListEmptyComponent}
        showsHorizontalScrollIndicator={false}
        renderItem={renderPage}
        keyExtractor={(_, index) => `page-${index}`}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({
          length: containerWidth,
          offset: containerWidth * index,
          index,
        })}
        decelerationRate={0.9}
      />
      <View style={styles.pagination}>
        {pages.map((_, index) => (
          <View
            key={`dot-${index}`}
            style={[styles.dot, index === activeIndex && styles.activeDot]}
          />
        ))}
      </View>
    </View>
  );
}

const createStyles = (theme: TTheme, cols: number) =>
  StyleSheet.create({
    container: {
      flexGrow: 1,
    },
    page: {
      flexDirection: "row",
      flexWrap: "wrap",
      alignItems: "flex-start",
      marginVertical: -theme.layout.spacing.sm,
    },
    cell: {
      width: `${100 / cols}%`,
      paddingHorizontal: theme.layout.spacing.sm,
      paddingVertical: theme.layout.spacing.sm,
    },
    pagination: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      paddingTop: theme.layout.spacing.xl,
      gap: theme.layout.spacing.xs,
    },
    dot: {
      width: theme.layout.spacing.xs,
      height: theme.layout.spacing.xs,
      borderRadius: theme.layout.spacing.xs / 2,
      backgroundColor: theme.colors.outlineVariant,
    },
    activeDot: {
      backgroundColor: theme.colors.outline,
      width: theme.layout.spacing.sm,
      height: theme.layout.spacing.sm,
      borderRadius: theme.layout.spacing.sm / 2,
    },
  });
