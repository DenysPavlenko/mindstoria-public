import { SelectableItem, SlideInModal, Typography } from "@/components";
import { TTheme, useTheme } from "@/theme";
import { TEntryValues, TTrackerMetric } from "@/types";
import { isNil } from "lodash";
import { useMemo } from "react";
import { FlatList, StyleSheet, View } from "react-native";

interface EntryNavigationProps {
  visible: boolean;
  onClose: () => void;
  metrics: TTrackerMetric[];
  values: TEntryValues;
  onItemPress: (index: number) => void;
  activeIndex: number;
}

export const EntryNavigation = ({
  onClose,
  visible,
  metrics,
  values,
  onItemPress,
  activeIndex,
}: EntryNavigationProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderItem = ({
    item,
    index,
  }: {
    item: TTrackerMetric;
    index: number;
  }) => {
    const isSelected = index === activeIndex;
    const metricId = metrics[index]?.id;
    const value = metricId ? values[metricId] : null;
    const hasValue = !isNil(value);
    return (
      <SelectableItem
        onPress={() => onItemPress(index)}
        isSelected={isSelected}
        isFilled={hasValue}
        key={item.id}
        style={styles.listItem}
      >
        <Typography variant="bodyBold">{item.label}</Typography>
      </SelectableItem>
    );
  };

  return (
    <SlideInModal visible={visible} onClose={onClose}>
      <View style={styles.container}>
        <FlatList
          data={metrics}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SlideInModal>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      paddingHorizontal: theme.layout.spacing.lg,
    },
    listItem: {
      marginBottom: theme.layout.spacing.md,
    },
    listItemWithValue: {
      backgroundColor: theme.colors.secondaryContainer,
    },
    listItemSelected: {
      borderWidth: 1,
      borderColor: theme.colors.primary,
    },
    listItemSelectedWithValue: {
      backgroundColor: theme.colors.secondaryContainer,
      borderColor: theme.colors.primary,
    },
  });
