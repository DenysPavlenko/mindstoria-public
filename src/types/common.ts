import { TTheme, typography } from "@/theme";

// Exclude 'impact' from color keys since it's an object, not a color string
export type TColorKey = Exclude<
  keyof TTheme["colors"],
  "rating" | "ratingContainer"
>;
export type TSizeKey = keyof TTheme["layout"]["size"];
export type TBorderRadiusKey = keyof TTheme["layout"]["borderRadius"];
export type TTypographyVariant = keyof typeof typography;

export type TTimePeriod = "week" | "month" | "year";

export type TChartDataPoint = {
  date: string;
  value: number | null;
};

export type TChartDataMap = {
  data: Record<string, number | null>;
  average: number | null;
  totalEntries: number;
};

export type TSortDir = "asc" | "desc";
export type TSortBy = "count" | "avg";

export enum RatingLevel {
  Awful = 1,
  Bad = 2,
  Ok = 3,
  Good = 4,
  Great = 5,
}

export type TUnknownObject = { [key: string]: unknown };
