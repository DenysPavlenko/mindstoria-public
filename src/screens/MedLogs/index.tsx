import { Header, MedicationManager, SafeView } from "@/components";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";

interface MedLogsProps {
  date: string;
}

export const MedLogs = ({ date }: MedLogsProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderHeader = () => {
    return <Header title={t("medications.title")} />;
  };

  return (
    <SafeView>
      {renderHeader()}
      <View style={styles.container}>
        <MedicationManager date={date} />
      </View>
    </SafeView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.layout.spacing.lg,
    },
  });
