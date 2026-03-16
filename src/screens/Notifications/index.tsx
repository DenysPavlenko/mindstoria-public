import { APP_NAME } from "@/appConstants";
import {
  Button,
  Card,
  Header,
  IconButton,
  Pill,
  SafeView,
  Switch,
  TimePickerModal,
  Typography,
} from "@/components";
import { useTheme } from "@/providers";
import { NotificationService } from "@/services/notifications";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addNotificationTime,
  disableNotifications,
  enableNotifications,
  removeNotificationTime,
  toggleNotificationDay,
  toggleNotifications,
} from "@/store/slices";
import { DISABLED_ALPHA, TTheme } from "@/theme";
import Feather from "@react-native-vector-icons/feather";

import dayjs from "dayjs";
import { PermissionStatus } from "expo-notifications";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { AppState, Linking, StyleSheet, View } from "react-native";

const getTimeString = (hours: number, minutes: number) => {
  return `${hours.toString().padStart(2, "0")}:${minutes
    .toString()
    .padStart(2, "0")}`;
};

const getHoursMinutesFromString = (time: string) => {
  const [hoursStr, minutesStr] = time.split(":");
  return {
    hours: parseInt(hoursStr!, 10),
    minutes: parseInt(minutesStr!, 10),
  };
};

export const Notifications = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const { times, selectedDays, enabled } = useAppSelector((state) => {
    return state.settings.notifications;
  });
  const [editingTime, setEditingTime] = useState(false);
  const [permissionStatus, setPermissionStatus] = useState<PermissionStatus>(
    PermissionStatus.UNDETERMINED,
  );
  const [pickerTime, setPickerTime] = useState<{
    hours: number;
    minutes: number;
  } | null>(null);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const daysOfWeek = useMemo(() => {
    return Array.from({ length: 7 }, (_, i) =>
      dayjs().startOf("isoWeek").add(i, "day").format("dd"),
    );
  }, []);

  const checkPermissionStatus = useCallback(async () => {
    const status = await NotificationService.getPermissionStatus();
    setPermissionStatus(status);
  }, []);

  const handleAppStateChange = useCallback(
    (nextAppState: string) => {
      if (nextAppState === "active") {
        checkPermissionStatus();
      }
    },
    [checkPermissionStatus],
  );

  const scheduleNotifications = useCallback(async () => {
    if (permissionStatus !== "granted") return;
    await NotificationService.scheduleNotifications({
      enabled,
      times,
      selectedDays,
      title: APP_NAME,
      body: t("notifications.notification_body"),
    });
  }, [permissionStatus, enabled, times, selectedDays, t]);

  // Check permission status on mount
  useEffect(() => {
    checkPermissionStatus();
  }, [checkPermissionStatus]);

  // Check permission status when app comes back to foreground
  useEffect(() => {
    const subscription = AppState.addEventListener(
      "change",
      handleAppStateChange,
    );
    return () => subscription?.remove();
  }, [checkPermissionStatus, handleAppStateChange]);

  // Schedule or cancel notifications when settings change
  useEffect(() => {
    scheduleNotifications();
  }, [scheduleNotifications]);

  const handleToggleNotifications = async () => {
    if (!enabled && permissionStatus !== "granted") {
      const granted = await requestNotificationPermission();
      if (!granted) {
        return;
      }
    }
    dispatch(toggleNotifications());
  };

  const requestNotificationPermission = async (): Promise<boolean> => {
    const granted = await NotificationService.requestPermissions();
    if (granted) {
      setPermissionStatus(PermissionStatus.GRANTED);
      return true;
    } else {
      Linking.openSettings();
      return false;
    }
  };

  const handleToggleDay = (dayIndex: number) => {
    dispatch(toggleNotificationDay(dayIndex));
  };

  const handleAddTime = () => {
    setPickerTime({ hours: 9, minutes: 0 });
    setEditingTime(false);
  };

  const handleEditTime = (time: string) => {
    setEditingTime(true);
    setPickerTime({
      ...getHoursMinutesFromString(time),
    });
  };

  const handleRemoveTime = (time: string) => {
    dispatch(removeNotificationTime(time));
    // Auto-disable notifications if this was the last time
    if (times.length === 1) {
      dispatch(disableNotifications());
    }
  };

  const handleTimePickerConfirm = (hours: number, minutes: number) => {
    const timeString = getTimeString(hours, minutes);
    if (editingTime && pickerTime) {
      const oldTime = getTimeString(pickerTime.hours, pickerTime.minutes);
      dispatch(removeNotificationTime(oldTime));
    } else if (times.length === 0) {
      dispatch(enableNotifications());
    }
    dispatch(addNotificationTime(timeString));
    setPickerTime(null);
  };

  const handleTimePickerDelete = () => {
    if (editingTime && pickerTime) {
      const time = getTimeString(pickerTime.hours, pickerTime.minutes);
      handleRemoveTime(time);
      setPickerTime(null);
      setEditingTime(false);
    }
  };

  const renderHeader = () => {
    return <Header title={t("notifications.title")} />;
  };

  const renderPermissionsCard = () => {
    if (permissionStatus === "granted") return null;
    return (
      <Card>
        <Typography
          variant="bodyBold"
          style={{ marginBottom: theme.layout.spacing.xs }}
        >
          {t("notifications.enable_notifications")}
        </Typography>
        <Typography
          variant="body"
          style={{ marginBottom: theme.layout.spacing.md }}
        >
          {t("notifications.notifications_description")}
        </Typography>
        <Button onPress={requestNotificationPermission}>
          {t("common.enable")}
        </Button>
      </Card>
    );
  };

  const renderNotificationsCard = () => {
    return (
      <Card>
        {permissionStatus !== "granted" && <View style={styles.overlay} />}
        <View style={styles.headerRow}>
          <Typography variant="h6">
            {APP_NAME} {t("notifications.title")}
          </Typography>
          <Switch value={enabled} onChange={handleToggleNotifications} />
        </View>
        <View style={styles.sectionHeader}>
          <Feather
            name="calendar"
            size={theme.layout.size.xxs}
            color={theme.colors.onSurfaceVariant}
          />
          <Typography>{t("notifications.days_of_week")}</Typography>
        </View>
        <View style={styles.daysContainer}>
          <View style={styles.daysWrapper}>
            {daysOfWeek.map((day, index) => {
              const isSelected = selectedDays.includes(index);
              return (
                <IconButton
                  key={day}
                  size="md"
                  style={styles.dayButton}
                  color={isSelected ? "primary" : "surface"}
                  onPress={() => handleToggleDay(index)}
                  disabled={!enabled}
                  customIcon={
                    <Typography color={isSelected ? "onPrimary" : "onSurface"}>
                      {t(day)}
                    </Typography>
                  }
                />
              );
            })}
          </View>
        </View>
        <View style={styles.sectionHeader}>
          <Feather
            name="clock"
            size={theme.layout.size.xxs}
            color={theme.colors.onSurfaceVariant}
          />
          <Typography>{t("notifications.notification_times")}</Typography>
        </View>
        <View style={styles.timesContainer}>
          {times.map((time) => (
            <Pill
              key={time}
              label={time}
              onPress={() => handleEditTime(time)}
              disabled={!enabled}
            />
          ))}
          <IconButton
            icon="plus"
            size="sm"
            color="primary"
            iconColor="onPrimary"
            onPress={handleAddTime}
            disabled={!enabled}
          />
        </View>
      </Card>
    );
  };

  const renderTimePickerModal = () => {
    if (!pickerTime) return null;
    return (
      <TimePickerModal
        visible
        onClose={() => {
          setPickerTime(null);
        }}
        onConfirm={handleTimePickerConfirm}
        onDelete={editingTime ? handleTimePickerDelete : undefined}
        hours={pickerTime.hours}
        minutes={pickerTime.minutes}
      />
    );
  };

  return (
    <SafeView>
      {renderHeader()}
      <View style={styles.container}>
        {renderPermissionsCard()}
        {renderNotificationsCard()}
      </View>
      {renderTimePickerModal()}
    </SafeView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      padding: theme.layout.spacing.lg,
      gap: theme.layout.spacing.lg,
    },
    overlay: {
      position: "absolute",
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: theme.colors.surface,
      opacity: DISABLED_ALPHA,
      zIndex: 1,
    },
    headerRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginBottom: theme.layout.spacing.lg,
    },
    sectionHeader: {
      flexDirection: "row",
      alignItems: "center",
      gap: theme.layout.spacing.xs,
      marginBottom: theme.layout.spacing.sm,
    },
    daysContainer: {
      alignItems: "center",
      marginBottom: theme.layout.spacing.xl,
    },
    daysWrapper: {
      flexDirection: "row",
      justifyContent: "space-between",
      width: "100%",
      maxWidth: 400,
    },
    dayButton: {
      maxWidth: "100%",
    },
    timesContainer: {
      flexDirection: "row",
      gap: theme.layout.spacing.sm,
      alignItems: "center",
      flexWrap: "wrap",
    },
  });
