import { TrackerCard, UnderlayButton } from "@/components";
import { useAppSelector } from "@/store";
import { selectEntryByDate } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TTracker } from "@/types";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { isNil } from "lodash";
import { useMemo, useRef } from "react";
import { StyleSheet, View } from "react-native";
import { ScaleDecorator } from "react-native-draggable-flatlist";
import SwipeableItem, {
  SwipeableItemImperativeRef,
} from "react-native-swipeable-item";

interface RowItemProps {
  trackerId: string;
  item: TTracker;
  drag: () => void;
  onEdit: (item: TTracker) => void;
  onDelete: (item: TTracker) => void;
}

const SNAP_POINTS = [80];
const OVERSWIPE_DIST = 20;
const ICON_WIDTH = SNAP_POINTS[0]!;

const today = dayjs().toString();

export const RowItem = ({
  item,
  trackerId,
  drag,
  onEdit,
  onDelete,
}: RowItemProps) => {
  const itemRef = useRef<SwipeableItemImperativeRef>(null);
  const router = useRouter();
  const { theme } = useTheme();
  const todayEntry = useAppSelector((state) => {
    return selectEntryByDate(state, trackerId, today);
  });

  const styles = useMemo(() => createStyles(theme), [theme]);

  const progress = useMemo(() => {
    if (!todayEntry) return 0;
    const total = item.metrics.length;
    const withValues = Object.values(todayEntry.values).filter((v) => {
      return !isNil(v);
    }).length;
    return withValues / total;
  }, [todayEntry, item]);

  const lastEmptyEntry = useMemo(() => {
    if (!todayEntry) return 0;
    const index = item.metrics.findIndex((metric) => {
      const val = todayEntry.values[metric.id];
      return isNil(val) || val === "";
    });
    return index === -1 ? item.metrics.length - 1 : index;
  }, [todayEntry, item]);

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
          <TrackerCard
            tracker={item}
            onPress={() => {
              closeSwipeable();
              router.navigate(`/tracker/${item.id}`);
            }}
            progress={progress}
            hasEntry={!!todayEntry}
            onEditEntry={() => {
              if (!todayEntry) return;
              closeSwipeable();
              router.navigate({
                pathname: `/tracker/[trackerId]/entry`,
                params: {
                  trackerId: item.id,
                  entryId: todayEntry.id,
                  page: lastEmptyEntry,
                },
              });
            }}
            onAddEntry={() => {
              closeSwipeable();
              router.navigate({
                pathname: `/tracker/[trackerId]/entry`,
                params: { trackerId: item.id },
              });
            }}
            onLongPress={drag}
          />
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
      marginBottom: theme.layout.spacing.md,
    },
  });
