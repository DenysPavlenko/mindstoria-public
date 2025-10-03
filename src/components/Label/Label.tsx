import { Typography } from '../Typography/Typography';
import { StyleProp, ViewStyle } from 'react-native';

interface LabelProps {
  label: string;
  style?: StyleProp<ViewStyle>;
}

export const Label = ({ label, style }: LabelProps) => {
  return (
    <Typography variant="small" style={style}>
      {label}
    </Typography>
  );
};

export default Label;
