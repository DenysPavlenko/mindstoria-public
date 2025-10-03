import { TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

interface SelectableItemProps {
  children: React.ReactNode;
  isSelected?: boolean;
  isFilled?: boolean;
  onPress: () => void;
  style?: object;
}

export const SelectableItem = ({
  children,
  isSelected = false,
  isFilled = false,
  onPress,
  style,
}: SelectableItemProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      onPress={onPress}
      style={[
        styles.container,
        isSelected && styles.selected,
        isFilled && styles.filled,
        style,
      ]}
    >
      {children}
    </TouchableOpacity>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      padding: theme.layout.spacing.lg,
      borderWidth: 2,
      borderColor: theme.colors.secondaryContainer,
      borderRadius: theme.layout.borderRadius.xl,
    },
    filled: {
      backgroundColor: theme.colors.secondaryContainer,
    },
    selected: {
      borderColor: theme.colors.primary,
    },
  });
