import { TOUCHABLE_ACTIVE_OPACITY, TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { CustomPressable } from "../CustomPressable/CustomPressable";

interface SelectableItemProps {
  children: React.ReactNode;
  isSelected?: boolean;
  onPress: () => void;
  style?: object;
  disabled?: boolean;
}

export const SelectableItem = ({
  children,
  isSelected = false,
  onPress,
  style,
  disabled,
}: SelectableItemProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <CustomPressable
      onPress={onPress}
      style={[
        styles.container,
        isSelected && styles.selected,
        { opacity: disabled ? 0.5 : 1 },
        style,
      ]}
      disabled={disabled}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
    >
      {children}
    </CustomPressable>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      padding: theme.layout.spacing.lg,
      backgroundColor: theme.colors.surfaceContainer,
      borderRadius: theme.layout.borderRadius.xl,
    },
    selected: {
      backgroundColor: theme.colors.primaryContainer,
    },
  });
