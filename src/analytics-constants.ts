export const ANALYTICS_EVENTS = {
  WELCOME_SCREEN_OPENED: "welcomeScreen_opened",
  WELCOME_GET_STARTED_CLICKED: "welcomeGetStarted_clicked",
  // Mood
  MOOD_LOG_STARTED: "moodLog_started",
  MOOD_LOG_CANCELLED: "moodLog_cancelled",
  MOOD_LOG_COMPLETED: "moodLog_completed",
  MOOD_CALENDAR_OPENED: "moodCalendar_opened",
  // Mood Statistics
  MOOD_STATISTICS_OPENED: "moodStatistics_opened",
  MOOD_STATISTICS_PERIOD_CHANGE_ATTEMPTED:
    "moodStatistics_period_change_attempted", // { paidUser: boolean }
  MOOD_STATISTICS_PERIOD_CHANGED: "moodStatistics_period_changed", // { period: "week" | "month" | "year" }
  MOOD_STATISTICS_DATE_CHANGED: "moodStatistics_date_changed", // { date: string }

  // Sleep
  SLEEP_LOG_ADDED: "sleepLog_added",
  SLEEP_LOG_UPDATED: "sleepLog_updated",
  SLEEP_LOG_CANCELLED: "sleepLog_cancelled",
  SLEEP_LOG_DELETED: "sleepLog_deleted",

  // Meds
  MEDICATION_ADDED: "medication_added",
  MEDICATION_UPDATED: "medication_updated",
  MEDICATION_DELETED: "medication_deleted",

  MED_LOG_ADDED: "medLog_added",
  MED_LOG_UPDATED: "medLog_updated",
  MED_LOG_DELETED: "medLog_deleted",

  // Emotions
  EMOTION_CREATE_STARTED: "emotionCreate_started", // { source: "emotionSearch" | "addButton" }
  EMOTION_CREATE_CANCELLED: "emotionCreate_cancelled",
  EMOTION_CREATE_COMPLETED: "emotionCreate_completed",
  EMOTION_EDIT_STARTED: "emotionEdit_started",
  EMOTION_EDIT_COMPLETED: "emotionEdit_completed",
  EMOTION_DELETE_CONFIRMED: "emotionDelete_confirmed", // { name: string }
  // Emotions Statistics
  EMOTIONS_STATISTICS_SCREEN_VIEWED: "emotionsStatistics_screen_viewed",
  EMOTIONS_STATISTICS_PERIOD_CHANGE_ATTEMPTED:
    "emotionsStatistics_period_change_attempted", // { paidUser: boolean }
  EMOTIONS_STATISTICS_PERIOD_CHANGED: "emotionsStatistics_period_changed", // { period: "week" | "month" | "year" }
  EMOTIONS_STATISTICS_DATE_CHANGED: "emotionsStatistics_date_changed", // { date: string }

  // Impacts
  IMPACT_CREATE_STARTED: "impactCreate_started", // { source: "impactSearch" | "addButton" }
  IMPACT_CREATE_CANCELLED: "impactCreate_cancelled",
  IMPACT_CREATE_COMPLETED: "impactCreate_completed",
  IMPACT_EDIT_STARTED: "impactEdit_started",
  IMPACT_EDIT_COMPLETED: "impactEdit_completed",
  IMPACT_DELETE_CONFIRMED: "impactDelete_confirmed", // { name: string }
  // Impacts Statistics
  IMPACTS_STATISTICS_SCREEN_VIEWED: "impactsStatistics_screen_viewed",
  IMPACTS_STATISTICS_PERIOD_CHANGE_ATTEMPTED:
    "impactsStatistics_period_change_attempted", // { paidUser: boolean }
  IMPACTS_STATISTICS_PERIOD_CHANGED: "impactsStatistics_period_changed", // { period: "week" | "month" | "year" }
  IMPACTS_STATISTICS_DATE_CHANGED: "impactsStatistics_date_changed", // { date: string }

  // CBT
  CBT_LOG_STARTED: "cbtLog_started",
  CBT_LOG_CANCELLED: "cbtLog_cancelled",
  CBT_LOG_COMPLETED: "cbtLog_completed",
  CBT_CALENDAR_OPENED: "cbtCalendar_opened",

  // CBT specific events
  CBT_EXPORT_ATTEMPTED: "cbt_export_attempted", // { paidUser: boolean }
  CBT_EXPORT_COMPLETED: "cbt_export_completed",
  CBT_EXPORT_FAILED: "cbt_export_failed", // { error: string }
  CBT_INFO_OPENED: "cbt_info_opened",
  CBT_VIEW_CHANGED: "settings_cbtView_changed", // { view: "list" | "calendar" }

  // Data backup
  DATA_IMPORT_ATTEMPTED: "data_import_attempted", // { paidUser: boolean }
  DATA_IMPORT_COMPLETED: "data_import_completed", // { paidUser: boolean }
  DATA_IMPORT_FAILED: "data_import_failed", // { error: string }
  DATA_EXPORT_ATTEMPTED: "data_export_attempted", // { paidUser: boolean }
  DATA_EXPORT_COMPLETED: "data_export_completed", // { paidUser: boolean }
  DATA_EXPORT_FAILED: "data_export_failed", // { error: string }

  // Settings & theme
  THEME_CHANGED: "settings_theme_changed", // { theme: "light" | "dark" }
  LANGUAGE_CHANGED: "settings_language_changed", // { language: "en" | "ua" }

  // Feedback & rating
  FEEDBACK_LINK_CLICKED: "feedback_link_clicked",
  RATE_APP_LINK_CLICKED: "rate_app_link_clicked",
};
