import { useTheme } from "@/providers";
import { DISABLED_ALPHA, TOUCHABLE_ACTIVE_OPACITY, TTheme } from "@/theme";
import Feather, { FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { CustomPressable } from "../CustomPressable/CustomPressable";
import { Typography } from "../Typography/Typography";

interface SettingsItemProps {
  icon: FeatherIconName;
  title: string;
  action?: React.ReactNode;
  onPress?: () => void;
  disabled?: boolean;
  withHaptics?: boolean;
}

export const SettingsItem = ({
  icon,
  title,
  action,
  onPress,
  disabled,
  withHaptics = false,
}: SettingsItemProps) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderedAction = () => {
    if (!action) return null;
    return <View style={styles.settingAction}>{action}</View>;
  };

  const Component = onPress ? CustomPressable : View;

  return (
    <Component
      style={[styles.settingItem, disabled && { opacity: DISABLED_ALPHA }]}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      onPress={onPress}
      disabled={disabled}
      withHaptics={withHaptics}
    >
      <View style={styles.settingTitle}>
        <Feather
          name={icon}
          size={theme.layout.size.xs}
          color={theme.colors.onBackground}
        />
        <Typography variant="bodyBold">{title}</Typography>
      </View>
      {renderedAction()}
    </Component>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: theme.layout.spacing.lg,
      gap: theme.layout.spacing.lg,
    },
    sections: {
      gap: theme.layout.spacing.lg,
    },
    section: {
      gap: theme.layout.spacing.sm,
    },
    settingItem: {
      paddingVertical: theme.layout.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: theme.layout.size.xl,
    },
    settingTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.layout.spacing.sm,
    },
    settingAction: {
      alignItems: "center",
      justifyContent: "center",
    },
    langIcon: {
      width: theme.layout.size.sm,
      height: theme.layout.size.sm,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.layout.size.sm / 2,
      overflow: "hidden",
    },
  });
