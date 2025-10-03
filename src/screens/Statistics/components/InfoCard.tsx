import { Card, Typography } from "@/components";
import { TTheme, useTheme } from "@/theme";
import { Feather, FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";

interface InfoCardProps {
  label: string;
  value: string | number;
  iconName: FeatherIconName;
}

export const InfoCard = ({ label, value, iconName }: InfoCardProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Card>
      <View style={styles.infoCardIcon}>
        <Feather name={iconName} color={theme.colors.onPrimary} size={20} />
      </View>
      <View>
        <Typography variant="h4">{value}</Typography>
        <Typography>{label}</Typography>
      </View>
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    infoCardIcon: {
      marginLeft: "auto",
      padding: theme.layout.spacing.sm,
      backgroundColor: theme.colors.primary,
      borderRadius: theme.layout.borderRadius.xl,
      marginBottom: theme.layout.spacing.md,
    },
  });
