import { useTheme } from "@/providers";
import { TOUCHABLE_ACTIVE_OPACITY, TTheme } from "@/theme";
import { Feather } from "@expo/vector-icons";
import { useMemo } from "react";
import { StyleProp, StyleSheet, ViewStyle } from "react-native";
import { CustomPressable } from "../CustomPressable/CustomPressable";

export interface CheckboxProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  size?: "sm" | "md" | "lg";
  style?: StyleProp<ViewStyle>;
}

export const Checkbox = ({
  checked,
  onChange,
  disabled = false,
  size = "md",
  style,
}: CheckboxProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const sizeConfig = useMemo(() => {
    let containerSize: number = theme.layout.size.xs;
    switch (size) {
      case "sm":
        containerSize = theme.layout.size.xxs;
        return { containerSize, iconSize: containerSize * 0.6 };
      case "lg":
        containerSize = theme.layout.size.sm;
        return { containerSize, iconSize: containerSize * 0.6 };
      default:
        return { containerSize, iconSize: containerSize * 0.6 };
    }
  }, [size, theme.layout.size]);

  const containerStyle = useMemo(
    () => ({
      width: sizeConfig.containerSize,
      height: sizeConfig.containerSize,
      backgroundColor: checked
        ? theme.colors.primary
        : theme.colors.surfaceVariant,
      borderRadius: sizeConfig.containerSize / 2,
      opacity: disabled ? 0.5 : 1,
    }),
    [checked, theme.colors, disabled, sizeConfig.containerSize],
  );

  const handlePress = () => {
    if (!disabled && onChange) {
      onChange(!checked);
    }
  };

  return (
    <CustomPressable
      style={[styles.container, containerStyle, style]}
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
    >
      {checked && (
        <Feather
          name="check"
          size={sizeConfig.iconSize}
          color={theme.colors.onPrimary}
        />
      )}
    </CustomPressable>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      alignItems: "center",
      justifyContent: "center",
    },
  });
