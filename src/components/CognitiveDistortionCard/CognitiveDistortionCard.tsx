import { TTheme, useTheme } from "@/theme";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import { StyleSheet, View } from "react-native";
import { Card } from "../Card/Card";
import { IconBox } from "../IconBox/IconBox";
import { Typography } from "../Typography/Typography";

interface CognitiveDistortionCardProps {
  name: string;
  description: string;
  icon: FeatherIconName;
  isSelected: boolean;
  onPress?: () => void;
}

export const CognitiveDistortionCard = ({
  name,
  description,
  icon,
  isSelected,
  onPress,
}: CognitiveDistortionCardProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Card
      bgColor={isSelected ? "primary" : "surfaceContainer"}
      onPress={onPress}
      style={styles.card}
    >
      <View style={styles.container}>
        <IconBox
          icon={icon}
          size="md"
          backgroundColor="surface"
          iconColor="onSurface"
          radius="lg"
        />
        <View style={styles.textContainer}>
          <Typography
            variant="h5"
            color={isSelected ? "onPrimary" : "onSurface"}
            fontWeight="semibold"
          >
            {name}
          </Typography>
          <Typography
            variant="small"
            color={isSelected ? "onPrimary" : "outline"}
          >
            {description}
          </Typography>
        </View>
      </View>
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    card: {
      paddingVertical: theme.layout.spacing.md,
    },
    container: {
      flexDirection: "row",
      alignItems: "flex-start",
      gap: theme.layout.spacing.md,
    },
    textContainer: {
      flex: 1,
      gap: theme.layout.spacing.xs,
    },
  });
