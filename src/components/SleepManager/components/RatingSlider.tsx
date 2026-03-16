import { useTheme } from "@/providers";
import { getRatingLevelColor, getRatingLevelLabel } from "@/utils";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { IconButton } from "../../IconButton/IconButton";
import { SlideInModal } from "../../SlideInModal/SlideInModal";
import { SliderAlt } from "../../SliderAlt/SliderAlt";
import { Typography } from "../../Typography/Typography";

interface RatingSliderProps {
  onClose: (withData: boolean) => void;
  onSave: (value: number, source: "overlay" | "button") => void;
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
  const { t } = useTranslation();

  const color = sleepQuality
    ? getRatingLevelColor(sleepQuality, theme)
    : undefined;

  const title =
    sleepQuality === null
      ? t("sleep.how_well_did_you_sleep")
      : getRatingLevelLabel(sleepQuality, t);

  const renderModalTitle = () => {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "flex-end",
          gap: theme.layout.spacing.sm,
        }}
      >
        {quality && (
          <IconButton
            icon="trash-2"
            size="md"
            color="errorContainer"
            iconColor="onErrorContainer"
            onPress={onDelete}
          />
        )}
        <IconButton
          icon="save"
          size="md"
          disabled={sleepQuality === null}
          onPress={() => {
            const withData = sleepQuality !== null;
            if (withData) {
              onSave(sleepQuality, "button");
            }
            onClose(withData);
          }}
        />
      </View>
    );
  };

  return (
    <SlideInModal
      visible
      onClose={() => {
        const withData = sleepQuality !== null;
        if (withData) {
          onSave(sleepQuality, "overlay");
        }
        onClose(withData);
      }}
      hideCloseButton
      title={renderModalTitle()}
    >
      <View
        style={{
          padding: theme.layout.spacing.lg,
          paddingTop: 0,
          gap: theme.layout.spacing.xl,
        }}
      >
        <Typography variant="h2" align="center">
          {title}
        </Typography>
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
