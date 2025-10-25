import { TTheme, useTheme } from "@/theme";
import { ReactNode, useMemo } from "react";
import { StyleSheet } from "react-native";
import { Card } from "../Card/Card";
import { Typography } from "../Typography/Typography";

interface InfoCardProps {
  title: string;
  cardColor?: string;
  icon: ReactNode;
  onPress?: () => void;
  children: React.ReactNode;
}

export const INFO_CARD_HEIGHT = 120;

export const InfoCard = ({
  title,
  icon,
  onPress,
  children,
  cardColor,
}: InfoCardProps) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Card
      style={[styles.container, cardColor && { backgroundColor: cardColor }]}
      onPress={onPress}
    >
      <Typography
        variant="bodyBold"
        color={cardColor ? "surface" : "onSurface"}
        numberOfLines={1}
      >
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
    },
  });
