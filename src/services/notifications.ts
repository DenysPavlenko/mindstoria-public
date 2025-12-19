import { TNotificationSettings } from "@/types/notifications";
import dayjs from "dayjs";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";

export class NotificationService {
  static async requestPermissions(): Promise<boolean> {
    try {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();
      let finalStatus = existingStatus;

      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        return false;
      }

      // For Android, set up the default notification channel
      if (Platform.OS === "android") {
        await Notifications.setNotificationChannelAsync("default", {
          name: "Default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      }

      return true;
    } catch (error) {
      console.error("Error requesting notification permissions:", error);
      return false;
    }
  }

  static async getPermissionStatus(): Promise<Notifications.PermissionStatus> {
    const { status } = await Notifications.getPermissionsAsync();
    return status;
  }

  static async scheduleNotifications(
    settings: TNotificationSettings & { title: string; body: string }
  ): Promise<void> {
    try {
      // Cancel all existing notifications first
      await this.cancelAllNotifications();

      if (
        !settings.enabled ||
        settings.times.length === 0 ||
        settings.selectedDays.length === 0
      ) {
        return;
      }
      // Schedule notifications for each time and day combination
      for (const time of settings.times) {
        for (const dayIndex of settings.selectedDays) {
          await this.scheduleWeeklyNotification({
            time,
            dayOfWeek: dayIndex,
            title: settings.title,
            body: settings.body,
          });
        }
      }
    } catch (error) {
      console.error("Error scheduling notifications:", error);
    }
  }

  private static async scheduleWeeklyNotification({
    time,
    dayOfWeek,
    title,
    body,
  }: {
    time: string;
    dayOfWeek: number;
    title: string;
    body: string;
  }): Promise<string> {
    const [hours, minutes] = time.split(":").map(Number);

    if (hours === undefined || minutes === undefined) {
      throw new Error("Invalid time format");
    }

    // Create a dayjs object for the next occurrence of this day and time
    const now = dayjs();

    // Start with today and set the target time
    let scheduledDate = dayjs()
      .hour(hours)
      .minute(minutes)
      .second(0)
      .millisecond(0);

    // Calculate days until the target day
    // Convert our dayIndex (0 = Monday) to dayjs isoWeekday (1 = Monday)
    const targetDay = dayOfWeek + 1; // Convert 0-6 to 1-7 (Monday = 1)
    const currentDay = now.isoWeekday();
    let daysUntilTarget = targetDay - currentDay;

    // If target day is in the past this week, or it's today but time has passed, schedule for next week
    if (
      daysUntilTarget < 0 ||
      (daysUntilTarget === 0 && scheduledDate.isBefore(now))
    ) {
      daysUntilTarget += 7; // Schedule for next week
    }

    // Add the days to get to the target day
    scheduledDate = scheduledDate.add(daysUntilTarget, "day");

    const notificationId = await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        data: {
          time,
          dayOfWeek,
          type: "daily_reminder",
        },
      },
      trigger: {
        date: scheduledDate.toDate(),
        type: Notifications.SchedulableTriggerInputTypes.DATE,
      },
    });

    return notificationId;
  }

  static async cancelAllNotifications(): Promise<void> {
    try {
      await Notifications.cancelAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error cancelling notifications:", error);
    }
  }

  static async getScheduledNotifications(): Promise<
    Notifications.NotificationRequest[]
  > {
    try {
      return await Notifications.getAllScheduledNotificationsAsync();
    } catch (error) {
      console.error("Error getting scheduled notifications:", error);
      return [];
    }
  }

  static addNotificationReceivedListener(
    listener: (notification: Notifications.Notification) => void
  ) {
    return Notifications.addNotificationReceivedListener(listener);
  }

  static addNotificationResponseReceivedListener(
    listener: (response: Notifications.NotificationResponse) => void
  ) {
    return Notifications.addNotificationResponseReceivedListener(listener);
  }
}
