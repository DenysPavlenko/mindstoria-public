import { useTheme } from "@/providers";
import { TColorKey, TSizeKey } from "@/types/common";
import { ReactNode } from "react";
import { StyleProp, View, ViewStyle } from "react-native";
import { Typography } from "../Typography/Typography";

interface BadgeProps {
  value?: string | number;
  customValue?: ReactNode;
  size?: TSizeKey | number;
  bgColor?: TColorKey;
  textColor?: TColorKey;
  absolute?: boolean;
  position?: {
    top?: number;
    right?: number;
    bottom?: number;
    left?: number;
  };
  style?: StyleProp<ViewStyle>;
}

export const Badge = ({
  value,
  customValue,
  size = "xs",
  bgColor = "primary",
  absolute = true,
  textColor = "onPrimary",
  position,
  style,
}: BadgeProps) => {
  const { theme } = useTheme();

  const badgeSize = typeof size === "number" ? size : theme.layout.size[size];

  const containerStyle: ViewStyle = {
    minWidth: badgeSize,
    height: badgeSize,
    position: absolute ? "absolute" : "relative",
    backgroundColor: theme.colors[bgColor],
    paddingHorizontal: theme.layout.spacing.xs,
    borderRadius: badgeSize / 2,
    justifyContent: "center",
    alignItems: "center",
    ...position,
  };

  const renderValue = () => {
    if (customValue) {
      return customValue;
    }
    return (
      <Typography variant="tinyBold" color={textColor} align="center">
        {value}
      </Typography>
    );
  };

  return <View style={[containerStyle, style]}>{renderValue()}</View>;
};
