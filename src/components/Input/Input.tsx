import { DISABLED_ALPHA, TTheme, useTheme, withAlpha } from "@/theme";
import { useMemo } from "react";
import {
  StyleProp,
  StyleSheet,
  TextInput,
  TextInputProps,
  TextStyle,
  View,
  ViewStyle,
} from "react-native";
import { Label } from "../Label/Label";
import { Typography } from "../Typography/Typography";

export interface InputProps extends Omit<TextInputProps, "style"> {
  label?: string;
  placeholder?: string;
  onChangeText?: (text: string) => void;
  error?: string;
  disabled?: boolean;
  multiline?: boolean;
  numberOfLines?: number;
  keyboardType?: TextInputProps["keyboardType"];
  autoCapitalize?: TextInputProps["autoCapitalize"];
  autoCorrect?: boolean;
  secureTextEntry?: boolean;
  maxLength?: number;
  style?: StyleProp<ViewStyle>;
  inputStyle?: StyleProp<TextStyle>;
  inputContainerStyle?: StyleProp<ViewStyle>;
  testID?: string;
  ref?: React.Ref<TextInput>;
}

export const Input = ({
  label,
  error,
  disabled = false,
  multiline = false,
  numberOfLines = 1,
  keyboardType = "default",
  autoCapitalize = "sentences",
  autoCorrect = true,
  secureTextEntry = false,
  style,
  inputContainerStyle,
  inputStyle,
  testID,
  ref,
  ...rest
}: InputProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const getInputContainerStyle = () => {
    return StyleSheet.flatten([
      styles.inputContainer,
      error && styles.inputError,
      disabled && styles.inputDisabled,
      multiline && styles.inputMultiline,
      inputContainerStyle,
    ]);
  };

  const getInputStyle = () => {
    return StyleSheet.flatten([
      styles.input,
      multiline && styles.inputMultilineText,
      inputStyle,
    ]);
  };

  return (
    <View style={style} testID={testID}>
      {label && <Label style={styles.label} label={label} />}

      <View style={getInputContainerStyle()}>
        <TextInput
          ref={ref}
          style={getInputStyle()}
          placeholderTextColor={withAlpha(
            theme.colors.onSurface,
            DISABLED_ALPHA
          )}
          editable={!disabled}
          multiline={multiline}
          numberOfLines={numberOfLines}
          keyboardType={keyboardType}
          autoCapitalize={autoCapitalize}
          autoCorrect={autoCorrect}
          secureTextEntry={secureTextEntry}
          testID={testID ? `${testID}-input` : undefined}
          {...rest}
        />
      </View>

      {error && (
        <Typography
          variant="small"
          style={styles.errorText}
          testID={testID ? `${testID}-error` : undefined}
        >
          {error}
        </Typography>
      )}
    </View>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    label: {
      marginBottom: theme.layout.spacing.xs,
    },
    inputContainer: {
      borderWidth: 1,
      borderRadius: theme.layout.borderRadius.xl,
      backgroundColor: theme.colors.surfaceContainerHighest,
      borderColor: theme.colors.surfaceContainerHighest,
      minHeight: theme.layout.size.lg,
      paddingHorizontal: theme.layout.spacing.md,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.onSurface,
      padding: 0,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    inputDisabled: {
      opacity: 0.6,
    },
    inputMultiline: {
      minHeight: 80,
      paddingTop: theme.layout.spacing.sm,
    },
    inputMultilineText: {
      textAlignVertical: "top",
    },
    errorText: {
      marginTop: theme.layout.spacing.xs,
      color: theme.colors.error,
    },
  });

export default Input;
