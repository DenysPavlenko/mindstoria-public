import { Card, Input, InputProps, Typography } from "@/components";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

export const NotesInput = ({
  style,
  inputContainerStyle,
  inputStyle,
  ...props
}: InputProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme), [theme]);

  return (
    <Card>
      <View style={styles.header}>
        <Typography variant="h6">{t("notes.title")}</Typography>
      </View>
      <Input
        multiline
        placeholder={t("notes.add_note")}
        style={[style]}
        {...props}
      />
    </Card>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    header: {
      marginBottom: theme.layout.spacing.lg,
    },
  });
