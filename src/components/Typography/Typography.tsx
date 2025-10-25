import { fonts, typography, useTheme } from "@/theme";
import { TColorKeys } from "@/types/common";
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

export interface TypographyProps extends TextProps {
  variant?: keyof typeof typography;
  color?: TColorKeys;
  align?: TextStyle["textAlign"];
  fontWeight?: keyof typeof fonts;
}

export const Typography = ({
  children,
  variant = "body",
  color = "onBackground",
  fontWeight,
  align,
  style,
  ...otherProps
}: TypographyProps) => {
  const theme = useTheme();
  return (
    <Text
      style={[
        {
          ...typography[variant],
          color: theme.theme.colors[color],
          ...(align && { textAlign: align }),
          ...(fontWeight && { fontFamily: fonts[fontWeight] }),
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </Text>
  );
};
