import { useTheme } from "@/theme";
import { View } from "react-native";
import { Typography } from "../Typography/Typography";

interface InfoTextProps {
  text: string;
}

export const InfoText = ({ text }: InfoTextProps) => {
  const { theme } = useTheme();
  return (
    <View
      style={{
        borderLeftWidth: 1,
        borderLeftColor: theme.colors.surfaceVariant,
        paddingLeft: theme.layout.spacing.lg,
      }}
    >
      <Typography variant="small" color="outline">
        {text}
      </Typography>
    </View>
  );
};
