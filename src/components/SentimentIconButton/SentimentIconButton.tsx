import { useTheme } from "@/providers";
import { DISABLED_ALPHA, TOUCHABLE_ACTIVE_OPACITY, TTheme } from "@/theme";
import { TColorKey, TSentimentType } from "@/types";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { CustomPressable } from "../CustomPressable/CustomPressable";
import { IconBox, IconBoxProps } from "../IconBox/IconBox";
import { Typography } from "../Typography/Typography";

interface SentimentIconButtonProps {
  title: string;
  icon?: string | FeatherIconName;
  sentimentType?: TSentimentType;
  counter?: number;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  isArchived?: boolean;
  style?: StyleProp<ViewStyle>;
  layout?: "vertical" | "horizontal";
  iconProps?: Partial<IconBoxProps>;
  textColor?: TColorKey;
}

export const SentimentIconButton = ({
  title,
  icon,
  isSelected,
  onPress,
  onLongPress,
  sentimentType,
  counter,
  style,
  isArchived,
  layout = "vertical",
  textColor = "onSurface",
  iconProps,
}: SentimentIconButtonProps) => {
  const { theme } = useTheme();

  const isVertical = layout === "vertical";

  const styles = useMemo(
    () => createStyles(theme, isVertical),
    [theme, isVertical],
  );

  const renderIcon = () => {
    const iconProp =
      sentimentType === "emotion"
        ? {
            customIcon: (
              <Typography style={{ fontSize: 16, lineHeight: 24 }}>
                {icon}
              </Typography>
            ),
          }
        : { icon: icon as FeatherIconName };
    return (
      <IconBox
        {...iconProp}
        color={isSelected ? "primary" : "secondaryContainer"}
        iconColor={isSelected ? "onPrimary" : "onSecondaryContainer"}
        {...iconProps}
      />
    );
  };

  const renderInfo = () => {
    const hasCounter = typeof counter === "number";
    const textAlign = isVertical ? "center" : "left";
    return (
      <View style={{ paddingHorizontal: theme.layout.spacing.sm }}>
        <Typography
          variant={isVertical ? "tinySemibold" : "smallBold"}
          align={textAlign}
          color={textColor}
          numberOfLines={hasCounter ? 1 : 2}
        >
          {title}
        </Typography>
        {hasCounter && (
          <Typography
            color={textColor}
            variant={isVertical ? "tinySemibold" : "smallBold"}
            align={textAlign}
            numberOfLines={2}
          >
            x{counter}
          </Typography>
        )}
      </View>
    );
  };

  const renderContent = () => {
    return (
      <>
        {renderIcon()}
        {renderInfo()}
      </>
    );
  };

  if (onPress || onLongPress) {
    return (
      <CustomPressable
        style={[
          styles.item,
          { opacity: isArchived ? DISABLED_ALPHA : 1 },
          style,
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      >
        {renderContent()}
      </CustomPressable>
    );
  }

  return (
    <View
      style={[styles.item, { opacity: isArchived ? DISABLED_ALPHA : 1 }, style]}
    >
      {renderContent()}
    </View>
  );
};

const createStyles = (theme: TTheme, isVertical: boolean) => {
  const gap = isVertical ? theme.layout.spacing.xs : theme.layout.spacing.sm;
  return StyleSheet.create({
    item: {
      flexDirection: isVertical ? "column" : "row",
      alignItems: "center",
      gap,
    },
  });
};
