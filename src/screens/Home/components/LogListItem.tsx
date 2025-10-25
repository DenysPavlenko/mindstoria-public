import { LogCard, UnderlayButton } from "@/components";
import { TLog } from "@/types";
import { useRef } from "react";
import SwipeableItem, {
  SwipeableItemImperativeRef,
} from "react-native-swipeable-item";

interface RowItemProps {
  log: TLog;
  onPress: (log: TLog) => void;
  onDelete: (log: TLog) => void;
}

const SNAP_POINTS = [80];
const OVERSWIPE_DIST = 20;
const ICON_WIDTH = SNAP_POINTS[0]!;

export const LogListItem = ({ log, onPress, onDelete }: RowItemProps) => {
  const itemRef = useRef<SwipeableItemImperativeRef>(null);

  const closeSwipeable = () => {
    itemRef.current?.close();
  };

  const handleDelete = () => {
    closeSwipeable();
    onDelete(log);
  };

  return (
    <SwipeableItem
      key={log.id}
      item={log}
      ref={itemRef}
      overSwipe={OVERSWIPE_DIST}
      renderUnderlayLeft={() => (
        <UnderlayButton
          iconName="trash-2"
          iconColor="onErrorContainer"
          backgroundColor="errorContainer"
          onPress={handleDelete}
          width={ICON_WIDTH}
          position="right"
        />
      )}
      snapPointsLeft={SNAP_POINTS}
    >
      <LogCard
        key={log.id}
        log={log}
        onPress={() => {
          onPress(log);
        }}
      />
    </SwipeableItem>
  );
};
