import { EULA_URL, PRIVACY_POLICY_URL } from "@/appConstants";
import {
  Card,
  ConfirmationDialog,
  Header,
  ListItem,
  Modal,
  SettingsItem,
  Switch,
  TAB_BAR_HEIGHT,
  Typography,
} from "@/components";
import { useThemedSnackbar } from "@/hooks";
import { setAppLanguage } from "@/i18n";
import { useRevenueCat } from "@/services";
import { useAppDispatch, useAppSelector } from "@/store";
import { importDataThunk } from "@/store/slices";
import { selectDataToBackUp } from "@/store/slices/backUpData/backUpDataSelectors";
import { TTheme, useTheme } from "@/theme";
import {
  buildFeedbackUrl,
  buildRateAppUrl,
  exportDataAsJSON,
  getAppVariant,
  getErrorMessage,
  hasBackUpData,
  importDataAsJSON,
  openLink,
} from "@/utils";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const IS_IOS = Platform.OS === "ios";

const TITLE_MAP = {
  en: "English",
  ua: "Українська",
} as const;

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const insets = useSafeAreaInsets();
  const snackbar = useThemedSnackbar();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { subscriptionActive, setShowPaywall, checkPremiumFeature } =
    useRevenueCat();
  const dispatch = useAppDispatch();
  const backUpData = useAppSelector(selectDataToBackUp);
  const [showImportConfirmation, setShowImportConfirmation] = useState(false);

  const paddingBottom = useMemo(() => {
    return insets.bottom + TAB_BAR_HEIGHT + theme.layout.spacing.lg;
  }, [insets.bottom, theme.layout.spacing.lg]);

  const currentLanguage = i18n.language;
  const languageResources = Object.keys(i18n.store.data);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const appVariant = useMemo(() => getAppVariant(), []);
  const showDevScreen =
    appVariant === "development" || appVariant === "preview";

  const languages = useMemo(() => {
    return languageResources.map((code) => ({
      code,
      label: TITLE_MAP[code as keyof typeof TITLE_MAP] || code.toUpperCase(),
    }));
  }, [languageResources]);

  const hasData = useMemo(() => {
    return hasBackUpData(backUpData);
  }, [backUpData]);

  const handleDataImportPress = () => {
    checkPremiumFeature(async () => {
      setShowImportConfirmation(true);
    });
  };

  const handleDataImport = async () => {
    try {
      const data = await importDataAsJSON();
      if (data) {
        await dispatch(importDataThunk(data));
        snackbar.success(t("common.import_success"));
      }
    } catch (error) {
      const message = getErrorMessage(error, t("common.import_failure"));
      snackbar.error(message);
    }
  };

  const handleDataExport = async () => {
    if (!hasData) return;
    checkPremiumFeature(async () => {
      try {
        await exportDataAsJSON(backUpData);
      } catch (error) {
        const message = getErrorMessage(error, t("common.export_failure"));
        snackbar.error(message);
      }
    });
  };

  const handleSendFeedback = async () => {
    try {
      const feedbackUrl = await buildFeedbackUrl(t);
      await openLink(feedbackUrl);
    } catch (error) {
      const message = getErrorMessage(error, t("common.something_went_wrong"));
      snackbar.error(message);
    }
  };

  const handleRateApp = async () => {
    try {
      const url = buildRateAppUrl();
      await openLink(url);
    } catch (error) {
      const message = getErrorMessage(error, t("common.something_went_wrong"));
      snackbar.error(message);
    }
  };

  const renderPremium = () => {
    if (subscriptionActive) return null;
    return (
      <Card>
        <SettingsItem
          icon="star"
          title={t("paywall.subscribe_to_premium")}
          onPress={() => setShowPaywall(true)}
        />
      </Card>
    );
  };

  const renderThemeSetting = () => {
    return (
      <SettingsItem
        icon="moon"
        title={t("settings.dark_theme")}
        action={<Switch value={isDark} onChange={toggleTheme} />}
      />
    );
  };

  const renderLanguageSetting = () => {
    return (
      <SettingsItem
        icon="globe"
        title={t("settings.language")}
        onPress={() => setShowLanguageModal(true)}
        action={
          <Typography variant="body" style={styles.settingTitle}>
            {TITLE_MAP[currentLanguage as keyof typeof TITLE_MAP]}
          </Typography>
        }
      />
    );
  };

  const renderNotifications = () => {
    return (
      <SettingsItem
        icon="bell"
        title={t("notifications.title")}
        onPress={() => {
          router.navigate("/notifications");
        }}
      />
    );
  };

  const renderImportSetting = () => {
    return (
      <SettingsItem
        icon="download"
        title={t("settings.import_data")}
        onPress={handleDataImportPress}
      />
    );
  };

  const renderExportSetting = () => {
    return (
      <SettingsItem
        icon="upload"
        title={t("settings.export_data")}
        onPress={handleDataExport}
      />
    );
  };

  const renderFeedback = () => {
    return (
      <SettingsItem
        icon="message-circle"
        title={t("settings.send_feedback")}
        onPress={handleSendFeedback}
      />
    );
  };

  const renderRating = () => {
    return (
      <SettingsItem
        icon="heart"
        title={t("settings.rate_app")}
        onPress={handleRateApp}
      />
    );
  };

  const renderPrivacyPolicy = () => {
    return (
      <SettingsItem
        icon="lock"
        title={t("settings.privacy_policy")}
        onPress={() => {
          openLink(PRIVACY_POLICY_URL);
        }}
      />
    );
  };

  const renderTermsOfService = () => {
    if (!IS_IOS) return null;
    return (
      <SettingsItem
        icon="file-text"
        title={t("settings.terms_of_service")}
        onPress={() => {
          openLink(EULA_URL);
        }}
      />
    );
  };

  const renderDevScreenButton = () => {
    if (!showDevScreen) return null;
    return (
      <View>
        <Typography variant="smallBold">Developer</Typography>
        <Card>
          <SettingsItem
            icon="settings"
            title="Developer screen"
            onPress={() => {
              router.navigate("/dev-screen");
            }}
          />
        </Card>
      </View>
    );
  };

  const renderLanguageModal = () => {
    return (
      <Modal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        style={{ paddingVertical: theme.layout.spacing.sm }}
      >
        {languages.map((lang, index) => {
          const isLast = index === languages.length - 1;
          return (
            <ListItem
              key={lang.code}
              isLast={isLast}
              onPress={() => {
                setAppLanguage(lang.code);
                setShowLanguageModal(false);
              }}
              title={lang.label}
            />
          );
        })}
      </Modal>
    );
  };

  const renderHeader = () => {
    return (
      <Header
        leftContent={
          <Typography variant="h4">{t("settings.title")}</Typography>
        }
      />
    );
  };

  const renderImportConfirmation = () => {
    return (
      <ConfirmationDialog
        visible={showImportConfirmation}
        onClose={() => setShowImportConfirmation(false)}
        onConfirm={() => {
          setShowImportConfirmation(false);
          // There is a conflict between the file picker and the dialog closing animation.
          setTimeout(() => {
            handleDataImport();
          }, 500);
        }}
        title={t("settings.import_data")}
        content={t("settings.import_data_warning")}
        actionText={t("common.import")}
        actionProps={{
          buttonColor: "primary",
          textColor: "onPrimary",
        }}
      />
    );
  };

  const sections = [
    {
      title: t("settings.general"),
      items: [renderThemeSetting, renderLanguageSetting, renderNotifications],
    },
    {
      title: t("settings.data"),
      items: [renderImportSetting, renderExportSetting],
    },
    {
      title: t("settings.support"),
      items: [renderFeedback, renderRating],
    },
    {
      title: t("settings.about"),
      items: [renderPrivacyPolicy, renderTermsOfService],
    },
  ];

  return (
    <>
      {renderHeader()}
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        <View style={[styles.content, { paddingBottom }]}>
          {renderPremium()}
          <View style={styles.sections}>
            {sections.map((section) => (
              <View key={section.title} style={styles.section}>
                <Typography variant="smallBold">{section.title}</Typography>
                <Card>
                  {section.items.map((renderFn, i) => (
                    <View key={i}>{renderFn()}</View>
                  ))}
                </Card>
              </View>
            ))}
          </View>
          {renderDevScreenButton()}
        </View>
      </ScrollView>
      {renderLanguageModal()}
      {renderImportConfirmation()}
    </>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
    },
    content: {
      padding: theme.layout.spacing.lg,
      gap: theme.layout.spacing.lg,
    },
    sections: {
      gap: theme.layout.spacing.lg,
    },
    section: {
      gap: theme.layout.spacing.sm,
    },
    settingItem: {
      paddingVertical: theme.layout.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: theme.layout.size.xl,
    },
    settingTitle: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.layout.spacing.sm,
    },
    settingAction: {
      alignItems: "center",
      justifyContent: "center",
    },
    langIcon: {
      width: theme.layout.size.sm,
      height: theme.layout.size.sm,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.layout.size.sm / 2,
      overflow: "hidden",
    },
  });
