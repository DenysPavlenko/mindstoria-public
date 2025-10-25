import { useTheme } from "@/theme";
import { StyleProp, View, ViewStyle } from "react-native";
import { Card } from "../Card/Card";
import { Typography } from "../Typography/Typography";

interface StatInfoCardProps {
  label: string;
  value: string | number;
  style?: StyleProp<ViewStyle>;
}

export const StatInfoCard = ({ label, value, style }: StatInfoCardProps) => {
  const { theme } = useTheme();
  return (
    <Card style={[{ flex: 1 }, style]}>
      <View
        style={{
          gap: theme.layout.spacing.lg,
        }}
      >
        <Typography variant="smallBold">{label}</Typography>
        <Typography variant="h5">{value}</Typography>
      </View>
    </Card>
  );
};
