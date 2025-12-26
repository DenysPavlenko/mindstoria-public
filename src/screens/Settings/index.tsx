import { EULA_URL, PRIVACY_POLICY_URL } from "@/appConstants";
import {
  Card,
  ConfirmationDialog,
  CustomPressable,
  Header,
  Modal,
  SafeView,
  Switch,
  Typography,
} from "@/components";
import { useThemedSnackbar } from "@/hooks";
import { setAppLanguage } from "@/i18n";
import { useRevenueCat } from "@/services";
import { useAppDispatch, useAppSelector } from "@/store";
import { importDataThunk } from "@/store/slices";
import { selectDataToBackUp } from "@/store/slices/backUpData/backUpDataSelectors";
import {
  DISABLED_ALPHA,
  TOUCHABLE_ACTIVE_OPACITY,
  TTheme,
  useTheme,
} from "@/theme";
import {
  exportDataAsJSON,
  getAppVariant,
  hasBackUpData,
  importDataAsJSON,
  openLink,
} from "@/utils";
import Feather from "@react-native-vector-icons/feather";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { LanguageList, TLanguageListItem } from "./components/LanguageList";

const IS_IOS = Platform.OS === "ios";

const TITLE_MAP = {
  en: "English",
  ua: "Українська",
} as const;

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const { theme, isDark, toggleTheme } = useTheme();
  const snackbar = useThemedSnackbar();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const { checkPremiumFeature } = useRevenueCat();
  const dispatch = useAppDispatch();
  const backUpData = useAppSelector(selectDataToBackUp);
  const [showImportConfirmation, setShowImportConfirmation] = useState(false);

  const currentLanguage = i18n.language;
  const languageResources = Object.keys(i18n.store.data);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const appVariant = useMemo(() => getAppVariant(), []);
  const showDevScreen =
    appVariant === "development" || appVariant === "preview";

  const languages: TLanguageListItem[] = useMemo(() => {
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
      const message =
        error instanceof Error ? error.message : t("common.import_failure");
      snackbar.error(message);
    }
  };

  const handleDataExport = async () => {
    if (!hasData) return;
    checkPremiumFeature(async () => {
      try {
        await exportDataAsJSON(backUpData);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t("common.export_failure");
        snackbar.error(message);
      }
    });
  };

  const renderThemeSetting = () => {
    return (
      <View style={styles.settingItem}>
        <View style={styles.settingTitle}>
          <Feather name="moon" size={20} color={theme.colors.onBackground} />
          <Typography variant="bodyBold">{t("settings.dark_theme")}</Typography>
        </View>
        <View style={styles.settingAction}>
          <Switch value={isDark} onChange={toggleTheme} />
        </View>
      </View>
    );
  };

  const renderLanguageSetting = () => {
    return (
      <CustomPressable
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        style={styles.settingItem}
        onPress={() => setShowLanguageModal(true)}
        withHaptics={false}
      >
        <View style={styles.settingTitle}>
          <Feather name="globe" size={20} color={theme.colors.onBackground} />
          <Typography variant="bodyBold" style={styles.settingTitle}>
            {t("settings.language")}
          </Typography>
        </View>
        <Typography variant="body" style={styles.settingTitle}>
          {TITLE_MAP[currentLanguage as keyof typeof TITLE_MAP]}
        </Typography>
      </CustomPressable>
    );
  };

  const renderNotifications = () => {
    return (
      <CustomPressable
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        style={styles.settingItem}
        onPress={() => {
          router.navigate("/notifications");
        }}
        withHaptics={false}
      >
        <View style={styles.settingTitle}>
          <Feather name="bell" size={20} color={theme.colors.onBackground} />
          <Typography variant="bodyBold" style={styles.settingTitle}>
            {t("notifications.title")}
          </Typography>
        </View>
      </CustomPressable>
    );
  };

  const renderImportSetting = () => {
    return (
      <CustomPressable
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        style={styles.settingItem}
        onPress={handleDataImportPress}
        withHaptics={false}
      >
        <View style={styles.settingTitle}>
          <Feather
            name="download"
            size={20}
            color={theme.colors.onBackground}
          />
          <Typography variant="bodyBold" style={styles.settingTitle}>
            {t("settings.import_data")}
          </Typography>
        </View>
      </CustomPressable>
    );
  };

  const renderExportSetting = () => {
    return (
      <CustomPressable
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        style={[styles.settingItem, !hasData && { opacity: DISABLED_ALPHA }]}
        onPress={handleDataExport}
        disabled={!hasData}
        withHaptics={false}
      >
        <View style={styles.settingTitle}>
          <Feather name="upload" size={20} color={theme.colors.onBackground} />
          <Typography variant="bodyBold" style={styles.settingTitle}>
            {t("settings.export_data")}
          </Typography>
        </View>
      </CustomPressable>
    );
  };

  const renderPrivacyPolicy = () => {
    if (!showDevScreen) return null;
    return (
      <CustomPressable
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        style={styles.settingItem}
        onPress={() => {
          openLink(PRIVACY_POLICY_URL);
        }}
        withHaptics={false}
      >
        <View style={styles.settingTitle}>
          <Feather name="lock" size={20} color={theme.colors.onBackground} />
          <Typography variant="bodyBold" style={styles.settingTitle}>
            {t("settings.privacy_policy")}
          </Typography>
        </View>
      </CustomPressable>
    );
  };

  const renderTermsOfService = () => {
    if (!IS_IOS) return null;
    return (
      <CustomPressable
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        style={styles.settingItem}
        onPress={() => {
          openLink(EULA_URL);
        }}
        withHaptics={false}
      >
        <View style={styles.settingTitle}>
          <Feather name="file-text" size={20} />
          <Typography variant="bodyBold" style={styles.settingTitle}>
            {t("settings.terms_of_service")}
          </Typography>
        </View>
      </CustomPressable>
    );
  };

  const renderDevScreenButton = () => {
    if (!showDevScreen) return null;
    return (
      <CustomPressable
        activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        style={styles.settingItem}
        onPress={() => {
          router.navigate("/dev-screen");
        }}
        withHaptics={false}
      >
        <View style={styles.settingTitle}>
          <Feather name="settings" size={20} color={theme.colors.error} />
          <Typography
            variant="bodyBold"
            color="error"
            style={styles.settingTitle}
          >
            Developer screen
          </Typography>
        </View>
      </CustomPressable>
    );
  };

  const renderList = () => (
    <Card>
      {renderThemeSetting()}
      {renderLanguageSetting()}
      {renderNotifications()}
      {renderImportSetting()}
      {renderExportSetting()}
      {renderPrivacyPolicy()}
      {renderTermsOfService()}
      {renderDevScreenButton()}
    </Card>
  );

  const renderLanguageModal = () => {
    return (
      <Modal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        style={{ paddingVertical: theme.layout.spacing.sm }}
      >
        <LanguageList
          languages={languages}
          onSelect={(code) => {
            setAppLanguage(code);
            setShowLanguageModal(false);
          }}
        />
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

  return (
    <>
      {renderHeader()}
      <SafeView style={styles.container}>
        {renderList()}
        {renderLanguageModal()}
      </SafeView>
      {renderImportConfirmation()}
    </>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingHorizontal: theme.layout.spacing.lg,
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
