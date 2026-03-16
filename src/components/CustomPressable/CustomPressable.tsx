import { useHaptics } from "@/hooks";
import {
  GestureResponderEvent,
  TouchableOpacity,
  TouchableOpacityProps,
} from "react-native";

export interface CustomPressableProps extends TouchableOpacityProps {
  withHaptics?: boolean;
}

export const CustomPressable = ({
  withHaptics = true,
  onPress,
  disabled,
  ...props
}: CustomPressableProps) => {
  const { triggerImpact } = useHaptics();

  const handlePress = (e: GestureResponderEvent) => {
    if (disabled) return;
    if (withHaptics) {
      triggerImpact();
    }
    onPress?.(e);
  };

  return (
    <TouchableOpacity
      onPress={handlePress}
      disabled={disabled}
      activeOpacity={1}
      {...props}
    />
  );
};
