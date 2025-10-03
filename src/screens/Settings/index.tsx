import GBIcon from "@/assets/images/flags/gb.svg";
import UaIcon from "@/assets/images/flags/ua.svg";
import {
  HeaderTitle,
  HeaderTitleProps,
  IconButton,
  SafeView,
  SlideInModal,
  Typography,
} from "@/components";
import { useThemedSnackbar } from "@/hooks";
import { usePremium } from "@/hooks/usePremium";
import { setAppLanguage } from "@/i18n";
import { useAppDispatch, useAppSelector } from "@/store";
import { importTrackersDataThunk } from "@/store/slices";
import { TOUCHABLE_ACTIVE_OPACITY, TTheme, useTheme } from "@/theme";
import { exportTrackersAsJSON, importTrackerAsJSON } from "@/utils";
import { useNavigation } from "expo-router";
import { JSX, useCallback, useLayoutEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import {
  FlatList,
  StyleSheet,
  Switch,
  TouchableOpacity,
  View,
} from "react-native";
import { LanguageList, TLanguageListItem } from "./components/LanguageList";

interface SettingItem {
  key: string;
  renderItem: () => JSX.Element;
}

const ICONS_MAP = {
  en: GBIcon,
  ua: UaIcon,
} as const;

const TITLE_MAP = {
  en: "English",
  ua: "Українська",
} as const;

export const Settings = () => {
  const { t, i18n } = useTranslation();
  const navigation = useNavigation();
  const { theme, isDark, toggleTheme } = useTheme();
  const snackbar = useThemedSnackbar();
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const trackersData = useAppSelector((state) => state.trackersData);
  const { checkPremiumFeature } = usePremium();
  const dispatch = useAppDispatch();
  const currentLanguage = i18n.language;
  const languageResources = Object.keys(i18n.store.data);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const languages: TLanguageListItem[] = useMemo(() => {
    return languageResources.map((code) => ({
      code,
      label: TITLE_MAP[code as keyof typeof TITLE_MAP] || code.toUpperCase(),
      icon: ICONS_MAP[code as keyof typeof ICONS_MAP] || GBIcon,
    }));
  }, [languageResources]);

  const hasDataToExport = useMemo(() => {
    return Object.keys(trackersData.trackers).length > 0;
  }, [trackersData]);

  const renderHeaderTitle = useCallback(
    ({ tintColor }: HeaderTitleProps) => {
      return (
        <HeaderTitle tintColor={tintColor}>{t("settings.title")}</HeaderTitle>
      );
    },
    [t]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: renderHeaderTitle,
    });
  }, [navigation, renderHeaderTitle]);

  const handleDataImport = useCallback(() => {
    checkPremiumFeature(async () => {
      try {
        const data = await importTrackerAsJSON();
        if (data) {
          dispatch(importTrackersDataThunk(data));
          snackbar.success(t("common.import_success"));
        }
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t("common.import_failure");
        snackbar.error(message);
      }
    });
  }, [dispatch, snackbar, t, checkPremiumFeature]);

  const handleDataExport = useCallback(async () => {
    if (!hasDataToExport) return;
    checkPremiumFeature(async () => {
      try {
        await exportTrackersAsJSON(trackersData);
      } catch (error) {
        const message =
          error instanceof Error ? error.message : t("common.export_failure");
        snackbar.error(message);
      }
    });
  }, [checkPremiumFeature, snackbar, t, hasDataToExport, trackersData]);

  const renderThemeSetting = useCallback(() => {
    return (
      <View style={styles.settingItem}>
        <Typography variant="h5" style={styles.settingTitle}>
          {t("settings.dark_theme")}
        </Typography>
        <View style={styles.settingAction}>
          <Switch
            value={isDark}
            onValueChange={toggleTheme}
            trackColor={{
              false: theme.colors.primaryContainer,
              true: theme.colors.primaryContainer,
            }}
            thumbColor={theme.colors.primary}
            ios_backgroundColor={theme.colors.primaryContainer}
          />
        </View>
      </View>
    );
  }, [styles, t, isDark, toggleTheme, theme]);

  const renderLanguageSetting = useCallback(() => {
    const Icon = ICONS_MAP[currentLanguage as keyof typeof ICONS_MAP];
    return (
      <View style={styles.settingItem}>
        <Typography variant="h5" style={styles.settingTitle}>
          {t("settings.language")}
        </Typography>
        <TouchableOpacity
          style={styles.langIcon}
          onPress={() => setShowLanguageModal(true)}
          activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
        >
          {Icon && (
            <Icon width={32} height={32} fill={theme.colors.onBackground} />
          )}
        </TouchableOpacity>
      </View>
    );
  }, [styles, currentLanguage, t, theme]);

  const renderImportSetting = useCallback(() => {
    return (
      <View style={styles.settingItem}>
        <Typography variant="h5" style={styles.settingTitle}>
          {t("settings.import_data")}
        </Typography>
        <View style={styles.settingAction}>
          <IconButton
            onPress={handleDataImport}
            icon="download"
            variant="text"
            iconColor="onBackground"
            autoSize
            size="lg"
          />
        </View>
      </View>
    );
  }, [styles, handleDataImport, t]);

  const renderExportSetting = useCallback(() => {
    return (
      <View style={styles.settingItem}>
        <Typography variant="h5" style={styles.settingTitle}>
          {t("settings.export_data")}
        </Typography>
        <View style={styles.settingAction}>
          <IconButton
            onPress={handleDataExport}
            icon="upload"
            variant="text"
            iconColor="onBackground"
            disabled={!hasDataToExport}
            autoSize
            size="lg"
          />
        </View>
      </View>
    );
  }, [styles, handleDataExport, hasDataToExport, t]);

  const settingsList: SettingItem[] = useMemo(
    () => [
      {
        key: "theme",
        renderItem: renderThemeSetting,
      },
      {
        key: "language",
        renderItem: renderLanguageSetting,
      },
      {
        key: "export",
        renderItem: renderExportSetting,
      },
      {
        key: "import",
        renderItem: renderImportSetting,
      },
    ],
    [
      renderThemeSetting,
      renderLanguageSetting,
      renderImportSetting,
      renderExportSetting,
    ]
  );

  const renderList = () => (
    <FlatList
      data={settingsList}
      renderItem={({ item }) => item.renderItem()}
      keyExtractor={(item) => item.key}
      showsVerticalScrollIndicator={false}
      style={styles.sectionList}
    />
  );

  const renderLanguageModal = () => {
    return (
      <SlideInModal
        visible={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
        hideCloseButton
      >
        <LanguageList
          languages={languages}
          onSelect={(code) => {
            setAppLanguage(code);
            setShowLanguageModal(false);
          }}
        />
      </SlideInModal>
    );
  };

  return (
    <SafeView style={styles.container}>
      {renderList()}
      {renderLanguageModal()}
    </SafeView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: theme.layout.spacing.lg,
    },
    sectionList: {
      flex: 1,
    },
    settingItem: {
      paddingHorizontal: theme.layout.spacing.lg,
      paddingVertical: theme.layout.spacing.lg,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      height: theme.layout.size.xl,
    },
    settingTitle: {
      flex: 1,
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

export default Settings;
