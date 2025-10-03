import { StyleSheet } from "react-native";
import { Input, InputProps } from "../Input/Input";

export const FullScreenInput = ({
  style,
  inputContainerStyle,
  inputStyle,
  ...props
}: InputProps) => {
  return (
    <Input
      multiline
      style={[styles.container, style]}
      inputContainerStyle={[styles.inputContainer, inputContainerStyle]}
      inputStyle={[styles.input, inputStyle]}
      {...props}
    />
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingBottom: 16,
  },
  inputContainer: {
    flex: 1,
    borderRadius: 0,
    borderWidth: 0,
    paddingTop: 0,
    paddingHorizontal: 0,
    backgroundColor: "transparent",
  },
  input: {
    flex: 1,
    padding: 0,
  },
});
