import { TTheme, useTheme, withAlpha } from "@/theme";
import { TSizeKeys } from "@/types";
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
  minHeight?: TSizeKeys;
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
  left?: React.ReactNode;
  right?: React.ReactNode;
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
  minHeight = "lg",
  style,
  inputContainerStyle,
  inputStyle,
  testID,
  ref,
  left,
  right,
  ...rest
}: InputProps) => {
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const getInputContainerStyle = () => {
    return StyleSheet.flatten([
      styles.inputContainer,
      {
        minHeight: theme.layout.size[minHeight],
        borderRadius: theme.layout.size[minHeight] / 2,
      },
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
      multiline && styles.inputMultiline,
      inputStyle,
    ]);
  };

  return (
    <View style={style} testID={testID}>
      {label && <Label style={styles.label} label={label} />}

      <View style={getInputContainerStyle()}>
        {left}
        <TextInput
          ref={ref}
          style={getInputStyle()}
          placeholderTextColor={withAlpha(theme.colors.onSurfaceVariant, 0.5)}
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
        {right}
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

const createStyles = (theme: TTheme) => {
  return StyleSheet.create({
    label: {
      marginBottom: theme.layout.spacing.xs,
    },
    inputContainer: {
      borderWidth: 1,
      backgroundColor: theme.colors.surfaceVariant,
      borderColor: theme.colors.surfaceVariant,
      paddingHorizontal: theme.layout.spacing.md,
      alignItems: "center",
      flexDirection: "row",
      gap: theme.layout.spacing.sm,
    },
    input: {
      flex: 1,
      fontSize: 16,
      color: theme.colors.onSurfaceVariant,
      padding: 0,
    },
    inputError: {
      borderColor: theme.colors.error,
    },
    inputDisabled: {
      opacity: 0.6,
    },
    inputMultiline: {
      minHeight: 90,
      borderRadius: theme.layout.borderRadius.lg,
    },
    inputMultilineText: {
      paddingVertical: theme.layout.spacing.sm,
      textAlignVertical: "top",
    },
    errorText: {
      marginTop: theme.layout.spacing.xs,
      color: theme.colors.error,
    },
  });
};
