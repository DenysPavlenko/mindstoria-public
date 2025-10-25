import { TTheme, useTheme } from "@/theme";
import { TColorKeys } from "@/types/common";
import { StyleProp, View, ViewStyle } from "react-native";
import { Typography } from "../Typography/Typography";

interface BadgeProps {
  value: string | number;
  size?: keyof TTheme["layout"]["size"] | number;
  bgColor?: TColorKeys;
  textColor?: TColorKeys;
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
    width: badgeSize,
    height: badgeSize,
    position: absolute ? "absolute" : "relative",
    backgroundColor: theme.colors[bgColor],
    borderRadius: badgeSize / 2,
    justifyContent: "center",
    alignItems: "center",
    ...position,
  };

  return (
    <View style={[containerStyle, style]}>
      <Typography variant="tinyBold" color={textColor} align="center">
        {value}
      </Typography>
    </View>
  );
};
