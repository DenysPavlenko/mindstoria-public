import { useTheme } from "@/theme";
import { getRatingLevelColor } from "@/utils";
import { useState } from "react";
import { View } from "react-native";
import { IconButton } from "../../IconButton/IconButton";
import { SleepText } from "../../SleepText/SleepText";
import { SlideInModal } from "../../SlideInModal/SlideInModal";
import { SliderAlt } from "../../SliderAlt/SliderAlt";

interface RatingSliderProps {
  onClose: () => void;
  onSave: (value: number) => void;
  onDelete: () => void;
  quality: number | null;
}

export const RatingSlider = ({
  quality,
  onClose,
  onSave,
  onDelete,
}: RatingSliderProps) => {
  const { theme } = useTheme();
  const [sleepQuality, setSleepQuality] = useState<number | null>(quality);

  const color = sleepQuality
    ? getRatingLevelColor(sleepQuality, theme)
    : undefined;

  const renderTitle = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          flex: 1,
          gap: theme.layout.spacing.sm,
        }}
      >
        {quality && (
          <IconButton
            icon="trash-2"
            size="md"
            backgroundColor="errorContainer"
            iconColor="onErrorContainer"
            onPress={onDelete}
          />
        )}
        <IconButton
          icon="save"
          size="md"
          disabled={sleepQuality === null}
          onPress={() => {
            if (sleepQuality !== null) {
              onSave(sleepQuality);
            }
            onClose();
          }}
        />
      </View>
    );
  };

  return (
    <SlideInModal
      visible
      onClose={() => {
        onClose();
        if (sleepQuality !== null) {
          onSave(sleepQuality);
        }
      }}
      hideCloseButton
      title={renderTitle()}
    >
      <View style={{ padding: theme.layout.spacing.lg, paddingTop: 0 }}>
        <SleepText sleepQuality={sleepQuality} />
        <SliderAlt
          value={sleepQuality}
          min={1}
          max={5}
          onChange={setSleepQuality}
          customThumbColor={color}
          activeMarkColor="surface"
        />
      </View>
    </SlideInModal>
  );
};
