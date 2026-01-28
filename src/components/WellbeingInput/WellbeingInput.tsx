import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { RatingLevel } from "@/types";
import {
  getRatingLevelColor,
  getRatingLevelLabel,
  WELLBEING_ICONS,
} from "@/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { IconButton } from "../IconButton/IconButton";
import { Typography } from "../Typography/Typography";

interface WellbeingInputProps {
  value: RatingLevel | null;
  onChange: (value: RatingLevel) => void;
}

export const WellbeingInput = ({ value, onChange }: WellbeingInputProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const iconSize = theme.layout.size.xl * 1.2;

  const renderTitle = () => {
    const title = value === null ? t("common.how_are_you") : t("common.i_feel");
    const subtitle =
      value === null ? t("common.feeling") : getRatingLevelLabel(value, t);
    return (
      <View>
        <Typography
          variant="h3"
          align="center"
          color="outline"
          fontWeight="regular"
        >
          {title}
        </Typography>
        <Typography
          variant="h1"
          align="center"
          style={{ marginBottom: theme.layout.spacing.xl }}
        >
          {subtitle}
        </Typography>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <View style={{ flex: 1, justifyContent: "center" }}>
        {renderTitle()}
        <View
          style={{
            flexDirection: "row",
            gap: theme.layout.spacing.md,
            justifyContent: "center",
            flexWrap: "wrap",
          }}
        >
          {WELLBEING_ICONS.map((Icon, index) => {
            const level = (index + 1) as RatingLevel;
            const isSelected = value === level;
            const color = getRatingLevelColor(level, theme);
            return (
              <IconButton
                key={level}
                radius="lg"
                customContent={
                  <Icon
                    width={iconSize}
                    height={iconSize}
                    fill={
                      isSelected
                        ? theme.colors.onPrimary
                        : theme.colors.onSurface
                    }
                  />
                }
                style={{
                  backgroundColor: isSelected
                    ? color
                    : theme.colors.surfaceVariant,
                }}
                onPress={() => onChange(level)}
                size="xl"
              />
            );
          })}
        </View>
      </View>
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
  });
