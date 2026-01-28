import { Header, SafeView, Typography } from "@/components";
import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

export const CBTInfo = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderHeader = () => {
    return <Header />;
  };

  return (
    <SafeView>
      {renderHeader()}
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          <View
            style={{
              gap: theme.layout.spacing.sm,
              marginBottom: theme.layout.spacing.xl,
            }}
          >
            <Typography variant="h4">{t("cbt.what_is_cbt")}</Typography>
            <Typography>{t("cbt.cbt_definition")}</Typography>
          </View>
          <View
            style={{
              gap: theme.layout.spacing.sm,
              marginBottom: theme.layout.spacing.xl,
            }}
          >
            <Typography variant="h4">{t("cbt.why_this_matters")}</Typography>
            <Typography>{t("cbt.about_description")}</Typography>
            <Typography style={{ marginTop: theme.layout.spacing.sm }}>
              {t("cbt.about_example")}
            </Typography>
          </View>
          <Typography
            variant="h4"
            style={{ marginBottom: theme.layout.spacing.sm }}
          >
            {t("cbt.how_to_use_flow")}
          </Typography>
          <View
            style={{
              gap: theme.layout.spacing.md,
              marginBottom: theme.layout.spacing.xl,
            }}
          >
            <Typography>
              1. <Typography fontWeight="bold">{t("cbt.situation")}</Typography>{" "}
              – {t("cbt.step_1_situation")}
            </Typography>
            <Typography>
              2.{" "}
              <Typography fontWeight="bold">
                {t("cbt.automatic_thought")}
              </Typography>{" "}
              – {t("cbt.step_2_automatic_thought")}
            </Typography>
            <Typography>
              3. <Typography fontWeight="bold">{t("cbt.behavior")}</Typography>{" "}
              – {t("cbt.step_3_behavior")}
            </Typography>
            <Typography>
              4. <Typography fontWeight="bold">{t("cbt.emotions")}</Typography>{" "}
              – {t("cbt.step_4_emotions")}
            </Typography>
            <Typography>
              5.{" "}
              <Typography fontWeight="bold">
                {t("cbt.cognitive_distortions")}
              </Typography>{" "}
              – {t("cbt.step_5_cognitive_distortions")}
            </Typography>
            <Typography>
              6.{" "}
              <Typography fontWeight="bold">
                {t("cbt.alternative_thought")}
              </Typography>{" "}
              – {t("cbt.step_6_alternative_thought")}
            </Typography>
          </View>
          <Typography style={{ marginBottom: theme.layout.spacing.xl }}>
            {t("cbt.awareness_goal")}
          </Typography>
          <Typography
            variant="smallBold"
            style={{ marginBottom: theme.layout.spacing.lg }}
          >
            * {t("cbt.reminder_text")}
          </Typography>
        </ScrollView>
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
