import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export const useKeyboard = () => {
  const [rawKeyboardHeight, setRawKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(
      showEvent,
      (e: KeyboardEvent) => {
        setRawKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const hideSubscription = Keyboard.addListener(
      hideEvent,
      (e: KeyboardEvent) => {
        setRawKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  // Adjust keyboard height for iOS safe area
  const keyboardHeight =
    rawKeyboardHeight > 0 && Platform.OS === "ios"
      ? rawKeyboardHeight - insets.bottom
      : rawKeyboardHeight;

  return {
    keyboardHeight,
    isKeyboardVisible,
  };
};
