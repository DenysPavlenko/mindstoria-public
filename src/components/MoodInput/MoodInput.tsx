import { RATING_VALUES } from "@/appConstants";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { RatingLevel } from "@/types";
import { getRatingLevelLabel } from "@/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import Animated, { FadeIn, FadeOut } from "react-native-reanimated";
import { CustomPressable } from "../CustomPressable/CustomPressable";
import { MoodIcon } from "../MoodIcon/MoodIcon";
import { Typography } from "../Typography/Typography";

export const MOOD_INPUT_ANIMATION_DURATION = 300;

export interface MoodInputProps {
  value: RatingLevel | null;
  onChange: (value: RatingLevel | null) => void;
}

export const MoodInput = ({ value, onChange }: MoodInputProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderTitle = () => {
    let title = t("common.how_are_you_feeling");
    if (value !== null) {
      title = getRatingLevelLabel(value, t);
    }
    return (
      <Animated.View
        key={title}
        entering={FadeIn.duration(MOOD_INPUT_ANIMATION_DURATION / 2)}
        exiting={FadeOut.duration(MOOD_INPUT_ANIMATION_DURATION / 2)}
      >
        <Typography variant="h2" align="center">
          {title}
        </Typography>
      </Animated.View>
    );
  };

  return (
    <View style={styles.container}>
      {renderTitle()}
      <View style={styles.iconContainer}>
        {RATING_VALUES.map((level) => {
          const isSelected = value === level;
          return (
            <View key={level}>
              <CustomPressable
                onPress={() => {
                  onChange(level);
                }}
                style={styles.iconButton}
              >
                <MoodIcon
                  size="xl"
                  level={level}
                  isSelected={value === null ? undefined : isSelected}
                />
                {/* <Typography variant="smallSemibold" align="center">
                  {label}
                </Typography> */}
              </CustomPressable>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      marginHorizontal: "auto",
      width: "100%",
      maxWidth: 360,
      gap: theme.layout.spacing.lg,
    },
    iconContainer: {
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      flexWrap: "wrap",
    },
    iconButton: {
      position: "relative",
      overflow: "hidden",
      alignItems: "center",
      gap: theme.layout.spacing.xs,
      zIndex: 1,
    },
  });
