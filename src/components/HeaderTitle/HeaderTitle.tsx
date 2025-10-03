import { StyleProp, TextStyle } from "react-native";
import { Typography } from "../Typography/Typography";

export interface HeaderTitleProps {
  children: React.ReactNode;
  tintColor?: string;
  style?: StyleProp<TextStyle>;
}

export const HeaderTitle = ({
  children,
  tintColor,
  style,
}: HeaderTitleProps) => (
  <Typography
    variant="bodyBold"
    style={[{ color: tintColor }, style]}
    numberOfLines={1}
  >
    {children}
  </Typography>
);
