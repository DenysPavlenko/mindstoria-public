import { FullScreenInput } from "@/components";
import { Platform, TextInput, TouchableOpacity } from "react-native";

const IS_IOS = Platform.OS === "ios";

interface FullScreenInputWrapperProps {
  onPress: () => void;
  ref: React.Ref<TextInput>;
  value: string;
  autoFocus?: boolean;
  onChangeText: (text: string) => void;
  placeholder: string;
  isKeyboardVisible: boolean;
}

export const FullScreenInputWrapper = ({
  ref,
  onPress,
  onChangeText,
  value,
  placeholder,
  autoFocus,
  isKeyboardVisible,
}: FullScreenInputWrapperProps) => {
  const renderInput = () => {
    return (
      <FullScreenInput
        ref={ref}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        pointerEvents={IS_IOS ? (isKeyboardVisible ? "auto" : "none") : "auto"}
        autoFocus={autoFocus}
      />
    );
  };

  // Workaround for iOS to prevent keyboard issues with FullScreenInput
  if (IS_IOS) {
    return (
      <TouchableOpacity style={{ flex: 1 }} onPress={onPress} activeOpacity={1}>
        {renderInput()}
      </TouchableOpacity>
    );
  }

  return renderInput();
};
