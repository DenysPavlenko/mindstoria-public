import {
  DISABLED_ALPHA,
  TOUCHABLE_ACTIVE_OPACITY,
  TTheme,
  useTheme,
} from "@/theme";
import { TSentimentCategory, TSentimentType } from "@/types";
import { getSentimentColor } from "@/utils";
import Feather, { FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  TouchableOpacity,
  View,
  ViewStyle,
} from "react-native";
import { Badge } from "../Badge/Badge";
import { IconBox } from "../IconBox/IconBox";
import { Typography } from "../Typography/Typography";

interface SentimentIconButtonProps {
  title: string;
  icon?: string | FeatherIconName;
  category?: TSentimentCategory;
  counter?: number;
  type?: TSentimentType;
  onPress?: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  isArchived?: boolean;
  style?: StyleProp<ViewStyle>;
}

export const SentimentIconButton = ({
  title,
  icon,
  isSelected,
  onPress,
  onLongPress,
  category,
  counter,
  style,
  type,
  isArchived,
}: SentimentIconButtonProps) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderSelectedBadge = () => {
    if (isSelected && type && !counter) {
      const color = getSentimentColor(type, theme);
      return (
        <Badge
          customValue={
            <Feather name="check" size={14} color={theme.colors.surface} />
          }
          style={{ backgroundColor: color }}
          position={{ top: -4, right: -4 }}
        />
      );
    }
    return null;
  };

  const renderCounterBadge = () => {
    if (counter && type && !isSelected) {
      const color = getSentimentColor(type, theme);
      return (
        <Badge
          value={counter}
          style={{ backgroundColor: color }}
          position={{ top: -4, right: -4 }}
        />
      );
    }
    return null;
  };

  const renderIcon = () => {
    const iconProp =
      category === "emotion"
        ? {
            customContent: (
              <Typography style={{ fontSize: 24, lineHeight: 30 }}>
                {icon}
              </Typography>
            ),
          }
        : { icon: icon as FeatherIconName };
    return <IconBox {...iconProp} size="xl" iconScale={0.35} radius="lg" />;
  };

  const renderContent = () => {
    return (
      <>
        <View>
          {renderIcon()}
          {renderSelectedBadge()}
          {renderCounterBadge()}
        </View>
        <View style={{ width: "100%" }}>
          <Typography variant="smallBold" align="center">
            {title}
          </Typography>
        </View>
      </>
    );
  };

  if (onPress || onLongPress) {
    return (
      <TouchableOpacity
        style={[
          styles.impactItem,
          { opacity: isArchived ? DISABLED_ALPHA : 1 },
          style,
        ]}
        onPress={onPress}
        onLongPress={onLongPress}
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        disabled={isArchived}
      >
        {renderContent()}
      </TouchableOpacity>
    );
  }

  return (
    <View
      style={[
        styles.impactItem,
        { opacity: isArchived ? DISABLED_ALPHA : 1 },
        style,
      ]}
    >
      {renderContent()}
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    impactItem: {
      alignItems: "center",
      gap: theme.layout.spacing.xs,
    },
  });
