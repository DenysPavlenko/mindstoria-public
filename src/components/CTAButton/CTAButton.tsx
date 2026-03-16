import { useTheme } from "@/providers";
import { TOUCHABLE_ACTIVE_OPACITY } from "@/theme";
import { Card, CardProps } from "../Card/Card";
import { Typography } from "../Typography/Typography";

interface CTAButtonProps extends Pick<
  CardProps,
  "onPress" | "style" | "disabled"
> {
  label: React.ReactNode;
}

export const CTAButton = ({
  label,
  disabled,
  style,
  onPress,
}: CTAButtonProps) => {
  const { theme } = useTheme();
  return (
    <Card
      disabled={disabled}
      onPress={onPress}
      bgColor="secondaryContainer"
      noPadding
      style={[
        {
          borderRadius: theme.layout.borderRadius.md,
          padding: theme.layout.spacing.md,
          minHeight: theme.layout.size.lg,
          alignItems: "center",
          justifyContent: "center",
        },
        style,
      ]}
      activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
    >
      <Typography
        variant="smallSemibold"
        align="center"
        color="onSurfaceVariant"
      >
        {label}
      </Typography>
    </Card>
  );
};
