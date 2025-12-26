import { DISABLED_ALPHA, TOUCHABLE_ACTIVE_OPACITY } from "@/theme";
import React from "react";
import {
  CustomPressable,
  CustomPressableProps,
} from "../CustomPressable/CustomPressable";
import { IconBox, IconBoxProps } from "../IconBox/IconBox";

export interface IconButtonProps
  extends IconBoxProps,
    Omit<CustomPressableProps, "style"> {
  containerStyle?: CustomPressableProps["style"];
}

export const IconButton: React.FC<IconButtonProps> = ({
  onPress,
  disabled,
  icon,
  customContent,
  size,
  radius,
  variant,
  iconColor,
  backgroundColor,
  iconScale,
  accessibilityLabel,
  autoSize,
  style,
  containerStyle,
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
        customContent={customContent}
        size={size}
        radius={radius}
        variant={variant}
        iconColor={iconColor}
        backgroundColor={backgroundColor}
        iconScale={iconScale}
        accessibilityLabel={accessibilityLabel}
        autoSize={autoSize}
        style={style}
      />
    </CustomPressable>
  );
};
