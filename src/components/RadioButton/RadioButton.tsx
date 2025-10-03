import { TOUCHABLE_ACTIVE_OPACITY, TTheme, useTheme } from "@/theme";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Label } from "../Label/Label";

interface RadioButtonProps {
  selected: boolean;
  onPress: () => void;
  label: string;
  disabled?: boolean;
}

export const RadioButton: React.FC<RadioButtonProps> = ({
  selected,
  onPress,
  label,
  disabled = false,
}) => {
  const { theme } = useTheme();
  const styles = createStyles(theme);

  return (
    <TouchableOpacity
      style={[styles.container, disabled && styles.disabled]}
      onPress={onPress}
      disabled={disabled}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
    >
      <View style={[styles.radio, selected && styles.radioSelected]}>
        {selected && <View style={styles.radioInner} />}
      </View>
      <Label style={styles.label} label={label} />
    </TouchableOpacity>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flexDirection: "row",
      alignItems: "center",
      paddingVertical: theme.layout.spacing.sm,
      paddingHorizontal: theme.layout.spacing.md,
    },
    disabled: {
      opacity: 0.5,
    },
    radio: {
      width: 20,
      height: 20,
      borderRadius: 10,
      borderWidth: 2,
      borderColor: theme.colors.primary,
      marginRight: theme.layout.spacing.md,
      justifyContent: "center",
      alignItems: "center",
    },
    radioSelected: {
      borderColor: theme.colors.primary,
    },
    radioInner: {
      width: 10,
      height: 10,
      borderRadius: 5,
      backgroundColor: theme.colors.primary,
    },
    label: {
      fontSize: 16,
      flex: 1,
    },
  });

export default RadioButton;
