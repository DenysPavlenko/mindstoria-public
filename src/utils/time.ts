import { TFunction } from "i18next";

/**
 * Convert seconds to hours, minutes, and seconds
 * @param totalSeconds - The total number of seconds
 * @returns An object containing hours, minutes, and seconds
 */
export const secondsToHMS = (seconds: number) => {
  return {
    hours: Math.floor(seconds / 3600),
    minutes: Math.floor((seconds % 3600) / 60),
    seconds: seconds % 60,
  };
};

/**
 * Format duration from seconds to a human-readable string
 * @param totalSeconds - The total number of seconds
 * @returns A formatted string representing the duration
 */
export const formatDuration = (
  seconds: number,
  t?: TFunction,
  showSeconds = true
) => {
  "worklet"; // for reanimated
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  const parts: string[] = [];

  // Temporary implementation without i18n support for reanimated
  let hoursLabel = t ? t("time.hours_short") : "h";
  let minutesLabel = t ? t("time.minutes_short") : "m";
  let secondsLabel = t ? t("time.seconds_short") : "s";

  if (h > 0) parts.push(`${h}${hoursLabel}`);
  if (m > 0) parts.push(`${m}${minutesLabel}`);
  if (showSeconds && (s > 0 || parts.length === 0))
    parts.push(`${s}${secondsLabel}`); // always show at least seconds
  return parts.join(" ");
};

export const formatTime = (seconds: number, hideSeconds = false) => {
  "worklet"; // for reanimated
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  // Temporary implementation without i18n support for reanimated
  const pad = (num: number) => num.toString().padStart(2, "0");
  if (hideSeconds) {
    return `${pad(h)}:${pad(m)}`;
  }
  return `${pad(h)}:${pad(m)}:${pad(s)}`;
};
