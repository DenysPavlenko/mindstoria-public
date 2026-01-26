import {
  Card,
  Header,
  ListItem,
  Modal,
  SafeView,
  SettingsItem,
  Typography,
} from "@/components";
import { useThemedSnackbar } from "@/hooks";
import { useRevenueCat } from "@/services";
import { useAppDispatch, useAppSelector } from "@/store";
import { selectCBTLogs, setCbtScreenView } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TCBTScreenView } from "@/types/settings";
import { exportCBTAsCSV, getErrorMessage } from "@/utils";
import { useRouter } from "expo-router";
import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";

type TListViewItem = {
  label: string;
  value: TCBTScreenView;
};

const LIST_VIEW_MAP = {
  list: "common.list",
  calendar: "common.calendar",
};

const LIST_VIEWS: TListViewItem[] = [
  { label: LIST_VIEW_MAP.list, value: "list" },
  { label: LIST_VIEW_MAP.calendar, value: "calendar" },
];

export const CBTSettings = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const snackbar = useThemedSnackbar();
  const { cbtScreenView } = useAppSelector((state) => state.settings);
  const { checkPremiumFeature } = useRevenueCat();
  const [showViewModal, setShowViewModal] = useState(false);
  const logs = useAppSelector(selectCBTLogs);
  const emotionDefs = useAppSelector((state) => state.emotionDefinitions.items);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const hasDataToExport = logs.length > 0;

  const handleChangeCbtView = (view: TCBTScreenView) => {
    setShowViewModal(false);
    dispatch(setCbtScreenView(view));
  };

  const handleCSVExportPress = () => {
    if (!hasDataToExport) return;
    checkPremiumFeature(async () => {
      try {
        await exportCBTAsCSV(logs, emotionDefs, t);
      } catch (error) {
        const message = getErrorMessage(error, t("common.export_failure"));
        snackbar.error(message);
      }
    });
  };

  const renderListSetting = () => {
    return (
      <SettingsItem
        icon="table"
        title={t("cbt.screen_view")}
        onPress={() => setShowViewModal(true)}
        action={
          <Typography variant="body" style={styles.settingTitle}>
            {t(LIST_VIEW_MAP[cbtScreenView])}
          </Typography>
        }
      />
    );
  };

  const renderExportSetting = () => {
    return (
      <SettingsItem
        icon="download"
        title={t("common.export_csv")}
        onPress={handleCSVExportPress}
        disabled={!hasDataToExport}
      />
    );
  };

  const renderCbtInfoSetting = () => {
    return (
      <SettingsItem
        icon="info"
        title={t("cbt.what_is_cbt")}
        onPress={() => router.navigate("/cbt-info")}
      />
    );
  };

  const renderList = () => {
    return (
      <Card>
        {renderListSetting()}
        {renderExportSetting()}
        {renderCbtInfoSetting()}
      </Card>
    );
  };

  const renderLanguageModal = () => {
    return (
      <Modal
        visible={showViewModal}
        onClose={() => setShowViewModal(false)}
        style={{ paddingVertical: theme.layout.spacing.sm }}
      >
        {LIST_VIEWS.map((lang, index) => {
          const isLast = index === LIST_VIEWS.length - 1;
          return (
            <ListItem
              key={lang.value}
              isLast={isLast}
              onPress={() => {
                handleChangeCbtView(lang.value);
              }}
              title={t(lang.label)}
            />
          );
        })}
      </Modal>
    );
  };

  return (
    <SafeView>
      <Header title={t("settings.title")} />
      <View style={styles.container}>
        <ScrollView showsVerticalScrollIndicator={false}>
          {renderList()}
        </ScrollView>
        {renderLanguageModal()}
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
  });
