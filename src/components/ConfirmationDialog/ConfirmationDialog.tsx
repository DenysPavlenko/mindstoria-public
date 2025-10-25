import { TTheme, useTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Button, ButtonProps } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { Typography } from "../Typography/Typography";

export interface ConfirmationDialogProps {
  visible: boolean;
  title: React.ReactNode;
  content: React.ReactNode;
  onClose: () => void;
  onConfirm: () => void;
  actionText?: React.ReactNode;
  actionProps?: Partial<ButtonProps>;
  style?: StyleProp<ViewStyle>;
}

export const ConfirmationDialog = ({
  visible,
  title,
  content,
  onClose,
  onConfirm,
  actionText,
  actionProps,
}: ConfirmationDialogProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Modal visible={visible} onClose={onClose} maxWidth={300}>
      <Typography variant="h3" style={styles.title}>
        {title}
      </Typography>
      <Typography style={styles.content}>{content}</Typography>
      <View style={styles.actions}>
        <Button variant="text" onPress={onClose} style={styles.cancelButton}>
          {t("common.cancel")}
        </Button>
        <Button
          variant="contained"
          buttonColor="error"
          textColor="onError"
          onPress={onConfirm}
          {...actionProps}
        >
          {actionText || t("common.delete")}
        </Button>
      </View>
    </Modal>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    title: {
      marginBottom: theme.layout.spacing.lg,
    },
    content: {
      marginBottom: theme.layout.spacing.xl,
    },
    actions: {
      flexDirection: "row",
      justifyContent: "flex-end",
    },
    cancelButton: {
      marginRight: theme.layout.spacing.sm,
    },
  });
