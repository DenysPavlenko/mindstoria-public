import { useTheme } from "@/providers";
import { DISABLED_ALPHA, TOUCHABLE_ACTIVE_OPACITY, TTheme } from "@/theme";
import { TColorKey } from "@/types/common";
import Feather, { FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { CustomPressable } from "../CustomPressable/CustomPressable";
import { Typography } from "../Typography/Typography";

interface PillProps {
  label: string;
  icon?: FeatherIconName;
  bgColor?: TColorKey;
  textColor?: TColorKey;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
  disabled?: boolean;
}

export const Pill = ({
  label,
  icon,
  onPress,
  bgColor = "surfaceContainerHighest",
  textColor = "onSurface",
  disabled,
  style,
}: PillProps) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const content = (
    <>
      {icon && (
        <Feather
          name={icon}
          size={theme.layout.size.xxs - 2}
          color={theme.colors[textColor]}
        />
      )}
      <Typography variant="tinySemibold" color={textColor}>
        {label}
      </Typography>
    </>
  );

  if (onPress) {
    return (
      <CustomPressable
        onPress={onPress}
        style={[
          styles.container,
          { backgroundColor: theme.colors[bgColor] },
          disabled && { opacity: DISABLED_ALPHA },
          style,
        ]}
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      >
        {content}
      </CustomPressable>
    );
  }

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: theme.colors[bgColor] },
        disabled && { opacity: DISABLED_ALPHA },
        style,
      ]}
    >
      {content}
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      borderRadius: theme.layout.borderRadius.lg,
      paddingVertical: theme.layout.spacing.xs,
      paddingHorizontal: theme.layout.spacing.sm,
      flexDirection: "row",
      alignItems: "center",
      gap: theme.layout.spacing.xs,
    },
  });
