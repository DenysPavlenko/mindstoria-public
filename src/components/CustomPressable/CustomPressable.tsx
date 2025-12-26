import * as Haptics from "expo-haptics";
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
  const handlePress = (e: GestureResponderEvent) => {
    if (disabled) return;
    if (withHaptics) {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
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
