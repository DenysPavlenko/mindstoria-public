import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { ReactNode, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Card } from "../Card/Card";
import { Typography } from "../Typography/Typography";

interface InfoCardProps {
  title: string;
  icon: ReactNode;
  onPress?: () => void;
  children: React.ReactNode;
}

export const INFO_CARD_HEIGHT = 120;

export const InfoCard = ({ title, icon, onPress, children }: InfoCardProps) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Card style={styles.container} onPress={onPress}>
      <Typography variant="h6" numberOfLines={1}>
        {title}
      </Typography>
      {icon}
      {children}
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      height: INFO_CARD_HEIGHT,
      paddingVertical: theme.layout.spacing.lg,
      justifyContent: "flex-end",
      overflow: "hidden",
      gap: theme.layout.spacing.xs,
    },
  });
