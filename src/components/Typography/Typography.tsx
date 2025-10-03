import { TTheme, typography, useTheme } from "@/theme";
import React from "react";
import { Text, TextProps, TextStyle } from "react-native";

export interface TypographyProps extends TextProps {
  variant?: keyof typeof typography;
  color?: keyof TTheme["colors"];
  align?: TextStyle["textAlign"];
}

export const Typography = ({
  children,
  variant = "body",
  color = "onBackground",
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
        },
        style,
      ]}
      {...otherProps}
    >
      {children}
    </Text>
  );
};

export default Typography;
