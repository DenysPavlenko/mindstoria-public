import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import { Button, ButtonProps } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { Typography } from "../Typography/Typography";

export interface InfoModalProps {
  visible: boolean;
  title: React.ReactNode;
  content: React.ReactNode;
  onClose: () => void;
  buttonText?: React.ReactNode;
  actionProps?: Partial<ButtonProps>;
}

export const InfoModal = ({
  visible,
  title,
  content,
  onClose,
  buttonText,
  actionProps,
}: InfoModalProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderContent = () => {
    if (typeof content === "string") {
      return <Typography>{content}</Typography>;
    }
    return content;
  };

  return (
    <Modal visible={visible} onClose={onClose}>
      <Typography variant="h3" style={styles.title}>
        {title}
      </Typography>
      <View style={styles.content}>{renderContent()}</View>
      <View style={styles.actions}>
        <Button variant="text" onPress={onClose} {...actionProps}>
          {buttonText || t("common.got_it")}
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
