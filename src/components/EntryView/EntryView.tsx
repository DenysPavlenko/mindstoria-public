import { TOUCHABLE_ACTIVE_OPACITY, TTheme, useTheme } from "@/theme";
import { TEntry, TTrackerMetric } from "@/types";
import { getDisplayValue } from "@/utils";
import React, { useMemo } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Card } from "../Card/Card";
import { Checkbox } from "../Checkbox/Checkbox";
import { Typography } from "../Typography/Typography";

interface EntryViewProps {
  entry: TEntry;
  metrics: TTrackerMetric[];
  onValuePress: (index: number) => void;
  style?: StyleProp<ViewStyle>;
}

export const EntryView = ({
  entry,
  metrics,
  style,
  onValuePress,
}: EntryViewProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderItem = ({
    item,
    index,
  }: {
    item: TTrackerMetric;
    index: number;
  }) => {
    const value = entry.values[item.id]!;
    const displayValue = getDisplayValue(value, item, t);
    const checked = value !== null && value !== undefined;
    return (
      <TouchableOpacity
        key={item.id}
        style={styles.metricItem}
        onPress={() => onValuePress(index)}
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      >
        <Checkbox
          checked={checked}
          onChange={() => onValuePress(index)}
          size="lg"
          style={styles.checkbox}
        />
        <View style={styles.metricInfo}>
          <Typography variant="h5">{item.label}</Typography>
          {displayValue !== null && (
            <Typography
              variant="small"
              color="outline"
              style={styles.metricValue}
            >
              {displayValue}
            </Typography>
          )}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <Card cardStyle={style} noVerticalPadding>
      <FlatList
        data={metrics}
        style={style}
        renderItem={renderItem}
        contentContainerStyle={styles.flatListContent}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
      />
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    flatListContent: {
      paddingVertical: theme.layout.spacing.md,
    },
    metricItem: {
      marginBottom: theme.layout.spacing.xxs,
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.layout.spacing.md,
    },
    checkbox: {
      marginRight: theme.layout.spacing.md,
    },
    metricInfo: {
      flex: 1,
    },
    metricValue: {
      marginTop: theme.layout.spacing.xxs,
    },
  });

export default EntryView;
