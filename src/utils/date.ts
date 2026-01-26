import dayjs, { Dayjs } from "dayjs";

export const CALENDAR_DATE_FORMAT = "YYYY-MM-DD";
export const YEAR_MONTH_FORMAT = "YYYY-MM";
export const MONTH_YEAR_FORMAT = "MMMM YYYY";
export const MONTH_DAY_FORMAT = "MMM D";
export const TIME_FORMAT = "HH:mm";

export function getRelativeDayTitle(
  date: Dayjs,
  t: (key: string) => string,
  locale: string,
) {
  if (date.isSame(dayjs(), "day")) return t("common.today");
  if (date.isSame(dayjs().subtract(1, "day"), "day"))
    return t("common.yesterday");
  if (date.year() !== dayjs().year()) {
    return date.locale(locale).format("MMMM D, YYYY");
  }
  return date.locale(locale).format("MMMM D");
}
