import { RANGE_MAX_LEVEL, RANGE_MIN_LEVEL } from "@/appConstants";
import { IconButton } from "@/components/IconButton/IconButton";
import { SliderAlt } from "@/components/SliderAlt/SliderAlt";
import { Typography } from "@/components/Typography/Typography";
import { useTheme } from "@/theme";
import { TImpactDefinition, TSentimentLevel } from "@/types";
import { getSentimentColor } from "@/utils";
import { useMemo, useState } from "react";
import { View } from "react-native";
import { SlideInModal } from "../../SlideInModal/SlideInModal";

interface RatingSliderProps {
  impact: TImpactDefinition;
  onClose: () => void;
  onSave: (level: TSentimentLevel) => void;
}

export const RatingSlider = ({
  impact,
  onClose,
  onSave,
}: RatingSliderProps) => {
  const { theme } = useTheme();
  const [impactLevel, seTSentimentLevel] = useState<TSentimentLevel | null>(
    null
  );

  const handleClose = () => {
    if (impactLevel && impactLevel > 0) {
      onSave(impactLevel as TSentimentLevel);
    }
    onClose();
  };

  const impactColor = useMemo(() => {
    if (impactLevel === null) return undefined;
    return getSentimentColor(impact.type, impactLevel, theme);
  }, [impact.type, theme, impactLevel]);

  const renderTitle = () => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
          gap: theme.layout.spacing.sm,
        }}
      >
        <Typography variant="h4">{impact.name}</Typography>
        <IconButton
          icon="save"
          size="md"
          disabled={impactLevel === null}
          onPress={() => {
            if (impactLevel !== null) {
              onSave(impactLevel);
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
      onClose={handleClose}
      title={renderTitle()}
      hideCloseButton
    >
      <View
        style={{
          padding: theme.layout.spacing.lg,
          paddingTop: theme.layout.spacing.md,
        }}
      >
        <SliderAlt
          value={impactLevel}
          min={RANGE_MIN_LEVEL}
          max={RANGE_MAX_LEVEL}
          onChange={seTSentimentLevel}
          customThumbColor={impactColor}
          activeMarkColor="surface"
        />
      </View>
    </SlideInModal>
  );
};
