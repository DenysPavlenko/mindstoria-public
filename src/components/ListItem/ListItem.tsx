import { useTheme } from "@/providers";
import { TOUCHABLE_ACTIVE_OPACITY, TTheme } from "@/theme";
import { useMemo } from "react";
import { StyleSheet } from "react-native";
import { CustomPressable } from "../CustomPressable/CustomPressable";
import { Typography } from "../Typography/Typography";

interface ListItemProps {
  title: string;
  onPress: () => void;
  isLast?: boolean;
}

export const ListItem = ({ title, onPress, isLast = false }: ListItemProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme, isLast), [theme, isLast]);

  return (
    <CustomPressable
      style={styles.item}
      onPress={onPress}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
    >
      <Typography variant="body">{title}</Typography>
    </CustomPressable>
  );
};

const createStyles = (theme: TTheme, isLast: boolean) =>
  StyleSheet.create({
    item: {
      paddingHorizontal: theme.layout.spacing.lg,
      paddingVertical: theme.layout.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      borderBottomWidth: isLast ? 0 : 1,
      borderBottomColor: theme.colors.outlineVariant,
    },
  });
