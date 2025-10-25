import React from "react";
import { KeyboardAvoidingView, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface KeyboardAwareViewProps {
  children: React.ReactNode;
  behavior?: "height" | "position" | "padding";
  keyboardVerticalOffset?: number;
  style?: any;
}

export const KeyboardAwareView: React.FC<KeyboardAwareViewProps> = ({
  children,
  behavior,
  keyboardVerticalOffset,
  style,
}) => {
  const insets = useSafeAreaInsets();

  // Calculate dynamic keyboard offset based on safe area insets
  const defaultOffset = Platform.OS === "ios" ? insets.bottom : 0; // 44 is typical navigation header height
  const finalOffset = keyboardVerticalOffset ?? defaultOffset;

  return (
    <KeyboardAvoidingView
      style={style}
      behavior={behavior || (Platform.OS === "ios" ? "padding" : "height")}
      keyboardVerticalOffset={finalOffset}
    >
      {children}
    </KeyboardAvoidingView>
  );
};
