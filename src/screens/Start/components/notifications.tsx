import { APP_NAME, NOTIFICATION_SETTINGS } from "@/appConstants";
import { Button, SafeView, Typography } from "@/components";
import { useTheme } from "@/providers";
import { NotificationService } from "@/services/notifications";
import { useAppDispatch } from "@/store";
import {
  enableNotifications,
  setNotificationsSetupShown,
} from "@/store/slices";
import Feather from "@react-native-vector-icons/feather";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface NotificationsProps {
  onNext?: () => void;
}

export const Notifications = ({ onNext }: NotificationsProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { theme } = useTheme();

  const scheduleNotifications = async () => {
    await NotificationService.scheduleNotifications({
      enabled: NOTIFICATION_SETTINGS.enabled,
      times: NOTIFICATION_SETTINGS.times,
      selectedDays: NOTIFICATION_SETTINGS.selectedDays,
      title: APP_NAME,
      body: t("notifications.notification_body"),
    });
  };

  const handleEnableNotifications = async () => {
    const granted = await NotificationService.requestPermissions();
    if (granted) {
      await scheduleNotifications();
      // Make sure notifications are enabled in the store
      dispatch(enableNotifications());
    }
    dispatch(setNotificationsSetupShown());
    onNext?.();
  };

  const handleSkip = () => {
    dispatch(setNotificationsSetupShown());
    onNext?.();
  };

  return (
    <SafeView
      direction="vertical"
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: theme.layout.spacing.lg,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: theme.layout.spacing.xxl,
        }}
      >
        <View
          style={{
            marginBottom: theme.layout.spacing.lg,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <Feather name="bell" size={120} color={theme.colors.outline} />
        </View>
        <Typography
          variant="h1"
          align="center"
          style={{ marginBottom: theme.layout.spacing.sm }}
        >
          {t("notifications.title")}
        </Typography>
        <Typography variant="body" align="center" style={{ maxWidth: 350 }}>
          {t("notifications.description")}
        </Typography>
      </View>
      <Button
        fullWidth
        onPress={handleEnableNotifications}
        style={{ marginBottom: theme.layout.spacing.xs }}
      >
        {t("notifications.enable_notifications")}
      </Button>
      <Button fullWidth onPress={handleSkip} variant="text">
        {t("common.skip")}
      </Button>
    </SafeView>
  );
};
