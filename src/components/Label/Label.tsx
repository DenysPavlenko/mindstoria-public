import { useTheme } from "@/providers";
import { Typography, TypographyProps } from "../Typography/Typography";

interface LabelProps {
  label: string;
  style?: TypographyProps["style"];
}

export const Label = ({ label, style }: LabelProps) => {
  const { theme } = useTheme();
  return (
    <Typography
      variant="smallBold"
      style={[style, { marginBottom: theme.layout.spacing.xs }]}
    >
      {label}
    </Typography>
  );
};

export default Label;
