import { DISABLED_ALPHA, TOUCHABLE_ACTIVE_OPACITY } from "@/theme";
import React from "react";
import {
  CustomPressable,
  CustomPressableProps,
} from "../CustomPressable/CustomPressable";
import { IconBox, IconBoxProps } from "../IconBox/IconBox";

export interface IconButtonProps
  extends IconBoxProps, Omit<CustomPressableProps, "style"> {
  containerStyle?: CustomPressableProps["style"];
}

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  disabled,
  icon,
  customIcon,
  size,
  radius,
  variant,
  iconColor,
  color,
  iconScale,
  accessibilityLabel,
  autoSize,
  style,
  containerStyle,
  edge,
  ...touchableProps
}) => {
  return (
    <CustomPressable
      style={[{ opacity: disabled ? DISABLED_ALPHA : 1 }, containerStyle]}
      onPress={disabled ? undefined : onPress}
      disabled={disabled}
      activeOpacity={disabled ? 1 : TOUCHABLE_ACTIVE_OPACITY}
      accessibilityRole="button"
      accessibilityState={{ disabled }}
      {...touchableProps}
    >
      <IconBox
        icon={icon}
        customIcon={customIcon}
        size={size}
        radius={radius}
        variant={variant}
        iconColor={iconColor}
        color={color}
        iconScale={iconScale}
        accessibilityLabel={accessibilityLabel}
        autoSize={autoSize}
        edge={edge}
        style={style}
      />
    </CustomPressable>
  );
};
