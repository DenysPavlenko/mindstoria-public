import { useTheme } from "@/providers";
import { TOUCHABLE_ACTIVE_OPACITY } from "@/theme";
import { TSizeKey } from "@/types";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { CustomPressable } from "../CustomPressable/CustomPressable";
import { IconBox } from "../IconBox/IconBox";
import { Typography } from "../Typography/Typography";

interface SentimentChipProps {
  label: string;
  icon: FeatherIconName;
  isSelected?: boolean;
  onPress?: () => void;
  size?: TSizeKey;
}

export const SentimentChip = ({
  label,
  icon,
  isSelected,
  onPress,
  size = "sm",
}: SentimentChipProps) => {
  const { theme } = useTheme();

  return (
    <CustomPressable
      onPress={onPress}
      style={{
        padding: theme.layout.spacing.xxs,
        paddingRight: theme.layout.spacing.md,
        gap: theme.layout.spacing.xs,
        backgroundColor: theme.colors.surfaceVariant,
        borderRadius: theme.layout.borderRadius.xl,
        flexDirection: "row",
        alignItems: "center",
      }}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
    >
      <IconBox
        icon={icon}
        size={size}
        color={isSelected ? "primary" : "surface"}
        iconColor={isSelected ? "onPrimary" : "onSurface"}
      />
      <Typography
        variant="tinySemibold"
        numberOfLines={1}
        style={{ flexShrink: 1 }}
      >
        {label}
      </Typography>
    </CustomPressable>
  );
};
