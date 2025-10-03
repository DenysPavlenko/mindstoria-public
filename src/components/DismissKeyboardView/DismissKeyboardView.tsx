import { ReactNode } from 'react';
import { TouchableWithoutFeedback, Keyboard, ViewProps } from 'react-native';

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
    <TouchableWithoutFeedback
      onPress={dismissKeyboard}
      accessible={false}
      {...restProps}
    >
      {children}
    </TouchableWithoutFeedback>
  );
};

export default DismissKeyboardView;
