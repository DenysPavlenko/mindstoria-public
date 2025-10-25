import {
  DISABLED_ALPHA,
  TOUCHABLE_ACTIVE_OPACITY,
  TTheme,
  useTheme,
} from "@/theme";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { ReactNode, useMemo } from "react";
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

interface SelectableIconButtonProps {
  title: string;
  icon?: FeatherIconName;
  customContent?: ReactNode;
  onPress: () => void;
  onLongPress?: () => void;
  isSelected?: boolean;
  isArchived?: boolean;
  level?: number;
  levelColor?: string;
  style?: StyleProp<ViewStyle>;
}

export const SelectableIconButton = ({
  title,
  icon,
  customContent,
  isSelected,
  level,
  levelColor,
  onPress,
  onLongPress,
  style,
  isArchived,
}: SelectableIconButtonProps) => {
  const { theme } = useTheme();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <TouchableOpacity
      style={[
        style,
        styles.impactItem,
        { opacity: isArchived ? DISABLED_ALPHA : 1 },
      ]}
      onPress={onPress}
      onLongPress={onLongPress}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
      disabled={isArchived}
    >
      <View>
        <IconBox
          icon={icon}
          customContent={customContent}
          size="xl"
          backgroundColor={isSelected ? "primary" : "surfaceVariant"}
          iconColor={isSelected ? "onPrimary" : "onSurfaceVariant"}
          iconScale={0.35}
          radius="lg"
        />
        {level && (
          <Badge
            value={level}
            position={{
              top: -10,
              right: -10,
            }}
            style={{ backgroundColor: levelColor }}
          />
        )}
      </View>
      <Typography variant="smallBold" numberOfLines={1}>
        {title}
      </Typography>
    </TouchableOpacity>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    impactItem: {
      alignItems: "center",
      gap: theme.layout.spacing.xs,
    },
  });
