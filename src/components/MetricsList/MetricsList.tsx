import { TTheme, useTheme } from "@/theme";
import { TTrackerMetric } from "@/types";
import React, { useCallback, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { IconButton } from "../IconButton/IconButton";
import { Placeholder } from "../Placeholder/Placeholder";
import { Typography } from "../Typography/Typography";
import { RowItem } from "./components/RowItem";

interface MetricsListProps {
  metrics: TTrackerMetric[];
  onDeleteMetric: (metric: TTrackerMetric) => void;
  onEditMetric: (metric: TTrackerMetric) => void;
  onDragEnd: (data: TTrackerMetric[]) => void;
  onAddMetric: () => void;
  style?: StyleProp<ViewStyle>;
}

export const MetricsList = ({
  metrics,
  onDeleteMetric,
  onEditMetric,
  onDragEnd,
  onAddMetric,
  style,
}: MetricsListProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderPlaceholder = () => (
    <Placeholder
      title={t("metrics.no_metrics_yet")}
      content={t("metrics.tap_to_define")}
      style={styles.placeholder}
      action={{ onPress: onAddMetric }}
    />
  );

  const handleEdit = useCallback(
    (metric: TTrackerMetric) => {
      onEditMetric(metric);
    },
    [onEditMetric]
  );

  const handleDelete = useCallback(
    (metric: TTrackerMetric) => {
      onDeleteMetric(metric);
    },
    [onDeleteMetric]
  );

  const renderHeader = () => {
    return (
      <View style={styles.header}>
        <Typography variant="h4" style={styles.title}>
          {t("metrics.metrics")}
        </Typography>
        <IconButton
          icon="plus"
          size="lg"
          variant="text"
          iconColor="onBackground"
          onPress={onAddMetric}
          autoSize
        />
      </View>
    );
  };

  const renderList = () => {
    return (
      <DraggableFlatList
        data={metrics}
        keyExtractor={(item) => item.id}
        renderItem={({ item, drag }) => {
          return (
            <RowItem
              item={item}
              drag={drag}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          );
        }}
        activationDistance={20}
        showsVerticalScrollIndicator={false}
        containerStyle={styles.listContainer}
        onDragEnd={({ data }) => onDragEnd(data)}
      />
    );
  };

  const renderContent = () => {
    if (metrics.length === 0) {
      return renderPlaceholder();
    }
    return (
      <>
        {renderHeader()}
        {renderList()}
      </>
    );
  };

  return <View style={[styles.container, style]}>{renderContent()}</View>;
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    header: {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      marginBottom: theme.layout.spacing.lg,
      paddingHorizontal: theme.layout.spacing.lg,
    },
    title: {
      flex: 1,
      paddingRight: theme.layout.spacing.md,
    },
    container: {
      flex: 1,
    },
    listContainer: {
      flex: 1,
    },
    placeholder: {
      flex: 1,
      padding: theme.layout.spacing.md,
      alignItems: "center",
    },
  });
