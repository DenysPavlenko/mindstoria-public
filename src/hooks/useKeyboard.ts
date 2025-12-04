import { useEffect, useState } from "react";
import { Keyboard, KeyboardEvent, Platform } from "react-native";

export const useKeyboard = () => {
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [isKeyboardVisible, setIsKeyboardVisible] = useState(false);

  useEffect(() => {
    const showEvent =
      Platform.OS === "ios" ? "keyboardWillShow" : "keyboardDidShow";
    const hideEvent =
      Platform.OS === "ios" ? "keyboardWillHide" : "keyboardDidHide";

    const showSubscription = Keyboard.addListener(
      showEvent,
      (e: KeyboardEvent) => {
        setKeyboardHeight(e.endCoordinates.height);
        setIsKeyboardVisible(true);
      }
    );

    const hideSubscription = Keyboard.addListener(
      hideEvent,
      (e: KeyboardEvent) => {
        setKeyboardHeight(0);
        setIsKeyboardVisible(false);
      }
    );

    return () => {
      showSubscription?.remove();
      hideSubscription?.remove();
    };
  }, []);

  return {
    keyboardHeight,
    isKeyboardVisible,
  };
};
