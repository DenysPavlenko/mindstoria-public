import { TTheme, useTheme } from "@/theme";
import { TTracker } from "@/types";
import { Feather } from "@react-native-vector-icons/feather";
import React, { useMemo } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import { AnimatedCircularProgress } from "react-native-circular-progress";
import { Card } from "../Card/Card";
import { Typography } from "../Typography/Typography";

interface TrackerCardProps {
  tracker: TTracker;
  progress: number;
  hasEntry: boolean;
  onPress?: () => void;
  onAddEntry?: () => void;
  onLongPress?: () => void;
  onEditEntry?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const TrackerCard = ({
  tracker,
  onPress,
  onLongPress,
  onAddEntry,
  onEditEntry,
  style,
  progress,
  hasEntry,
}: TrackerCardProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const onButtonPress = hasEntry ? onEditEntry : onAddEntry;

  const isCompleted = progress === 1;

  return (
    <Card
      containerStyle={style}
      cardStyle={styles.card}
      onPress={onPress}
      onLongPress={onLongPress}
    >
      <View style={styles.cardHeader}>
        <View style={styles.icon}>
          <Feather
            name={tracker.iconName}
            size={theme.layout.size.xl * 0.5}
            color={theme.colors.onPrimary}
          />
        </View>
        <View style={styles.info}>
          <Typography variant="h4" numberOfLines={1} ellipsizeMode="tail">
            {tracker.name}
          </Typography>
          {tracker.description && (
            <Typography
              variant="tiny"
              color="outline"
              numberOfLines={1}
              ellipsizeMode="tail"
              style={styles.description}
            >
              {tracker.description}
            </Typography>
          )}
        </View>
        <Pressable
          style={[styles.button, isCompleted && styles.buttonCompleted]}
          onPress={onButtonPress}
        >
          <AnimatedCircularProgress
            size={theme.layout.size.xl}
            width={3}
            fill={progress * 100}
            tintColor={theme.colors.primary}
            backgroundColor={theme.colors.primaryContainer}
            rotation={0}
          />
          <Feather
            name={isCompleted ? "check" : "plus"}
            size={28}
            color={isCompleted ? theme.colors.onPrimary : theme.colors.primary}
            style={styles.buttonIcon}
          />
        </Pressable>
      </View>
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    card: {
      overflow: "hidden",
    },
    cardHeader: {
      flexDirection: "row",
      alignItems: "center",
    },
    progress: {
      position: "absolute",
      bottom: 0,
      left: 0,
      right: 0,
    },
    icon: {
      width: theme.layout.size.xl,
      height: theme.layout.size.xl,
      borderRadius: theme.layout.borderRadius.lg,
      backgroundColor: theme.colors.primary,
      justifyContent: "center",
      alignItems: "center",
    },
    info: {
      flex: 1,
      paddingHorizontal: theme.layout.spacing.md,
    },
    description: {
      marginTop: theme.layout.spacing.xxs,
    },
    button: {
      justifyContent: "center",
      alignItems: "center",
      borderRadius: theme.layout.size.xl / 2,
    },
    buttonCompleted: {
      backgroundColor: theme.colors.primary,
    },
    buttonIcon: {
      position: "absolute",
    },
  });

export default TrackerCard;
