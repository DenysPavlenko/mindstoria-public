import { ReactNode } from "react";
import { Keyboard, Pressable, ViewProps } from "react-native";

interface DismissKeyboardViewProps extends ViewProps {
  children: ReactNode;
  skip?: boolean;
}

export const DismissKeyboardView = ({
  children,
  skip,
  ...restProps
}: DismissKeyboardViewProps) => {
  const dismissKeyboard = () => {
    Keyboard.dismiss();
  };

  if (skip) {
    return children;
  }

  return (
    <Pressable onPress={dismissKeyboard} accessible={false} {...restProps}>
      {children}
    </Pressable>
  );
};
