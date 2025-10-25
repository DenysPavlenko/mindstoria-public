// In snackbar.ts
import { useTheme } from "@/theme";
import { useMemo } from "react";
import Snackbar from "react-native-snackbar";

// TODO: Replace with toasts because the font-family doesn't apply here
export const useThemedSnackbar = () => {
  const { theme } = useTheme();

  return useMemo(
    () => ({
      success: (message: string) =>
        Snackbar.show({
          text: message,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: theme.colors.primary,
          textColor: theme.colors.onPrimary,
        }),
      error: (message: string) =>
        Snackbar.show({
          text: message,
          duration: Snackbar.LENGTH_LONG,
          backgroundColor: theme.colors.error,
          textColor: theme.colors.onError,
        }),
      warning: (message: string) =>
        Snackbar.show({
          text: message,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: theme.colors.tertiary,
          textColor: theme.colors.onTertiary,
        }),
      info: (message: string) =>
        Snackbar.show({
          text: message,
          duration: Snackbar.LENGTH_SHORT,
          backgroundColor: theme.colors.secondary,
          textColor: theme.colors.onSecondary,
        }),
      action: (message: string, actionText: string, onAction: () => void) =>
        Snackbar.show({
          text: message,
          duration: Snackbar.LENGTH_INDEFINITE,
          backgroundColor: theme.colors.surface,
          textColor: theme.colors.onSurface,
          action: {
            text: actionText,
            textColor: theme.colors.primary,
            onPress: onAction,
          },
        }),
    }),
    [theme]
  );
};
