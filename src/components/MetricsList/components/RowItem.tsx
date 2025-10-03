import { TTheme, useTheme } from "@/theme";
import { TTrackerMetric } from "@/types";
import { getMetricTypeLabel } from "@/utils";
import { useMemo, useRef } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import SwipeableItem, {
  SwipeableItemImperativeRef,
} from "react-native-swipeable-item";
import { Card } from "../../Card/Card";
import { Typography } from "../../Typography/Typography";
import { UnderlayButton } from "../../UnderlayButton/UnderlayButton";

interface RowItemProps {
  item: TTrackerMetric;
  drag: () => void;
  onEdit: (metric: TTrackerMetric) => void;
  onDelete: (metric: TTrackerMetric) => void;
}

const SNAP_POINTS = [60];
const OVERSWIPE_DIST = 20;
const ICON_WIDTH = SNAP_POINTS[0]!;

export const RowItem = ({ item, drag, onEdit, onDelete }: RowItemProps) => {
  const { t } = useTranslation();
  const itemRef = useRef<SwipeableItemImperativeRef>(null);
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const closeSwipeable = () => {
    itemRef.current?.close();
  };

  const handleDelete = () => {
    closeSwipeable();
    onDelete(item);
  };

  const handleEdit = () => {
    closeSwipeable();
    onEdit(item);
  };

  return (
    <ScaleDecorator activeScale={1.05}>
      <View style={styles.row}>
        <SwipeableItem
          key={item.id}
          item={item}
          ref={itemRef}
          overSwipe={OVERSWIPE_DIST}
          renderUnderlayLeft={() => (
            <UnderlayButton
              iconName="trash"
              iconColor="onError"
              backgroundColor="error"
              onPress={handleDelete}
              width={ICON_WIDTH}
              position="right"
            />
          )}
          renderUnderlayRight={() => (
            <UnderlayButton
              iconName="edit-2"
              iconColor="onPrimary"
              backgroundColor="primary"
              onPress={handleEdit}
              width={ICON_WIDTH}
              position="left"
            />
          )}
          snapPointsLeft={SNAP_POINTS}
          snapPointsRight={SNAP_POINTS}
        >
          <Card onLongPress={drag}>
            <View style={styles.rowContent}>
              <Typography
                variant="bodyBold"
                numberOfLines={1}
                ellipsizeMode="tail"
                style={styles.metricLabel}
              >
                {item.label}
              </Typography>
              <Typography variant="bodyBold">
                {getMetricTypeLabel(item.type, t)}
              </Typography>
            </View>
          </Card>
        </SwipeableItem>
      </View>
    </ScaleDecorator>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    row: {
      flex: 1,
      borderRadius: theme.layout.borderRadius.xl,
      marginHorizontal: theme.layout.spacing.lg,
      marginBottom: theme.layout.spacing.xs,
    },
    rowContent: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    metricLabel: {
      maxWidth: "50%",
      marginRight: theme.layout.spacing.md,
    },
  });
