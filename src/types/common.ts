import { TTheme } from "@/theme";

// Exclude 'impact' from color keys since it's an object, not a color string
export type TColorKeys = Exclude<keyof TTheme["colors"], "rating">;

export type TTimePeriod = "week" | "month" | "year";

export type TChartDataPoint = {
  date: string;
  value: number | null;
};

export type TChartDataMap = {
  data: Record<string, number | null>;
  average: number | null;
};

export type TSortDir = "asc" | "desc";
export type TSortBy = "count" | "avg";

export type TSentimentCategory = "impact" | "emotion";
export type TSentimentType = "positive" | "negative";
export enum TSentimentLevel {
  minimal = 1,
  slight = 2,
  moderate = 3,
  substantial = 4,
  significant = 5,
}

export type TSentimentStatsItem<TIcon = string> = {
  id: string;
  name: string;
  type: TSentimentType;
  icon: TIcon;
  count: number;
  isArchived?: boolean;
};

export enum RatingLevel {
  Awful = 1,
  Bad = 2,
  Ok = 3,
  Good = 4,
  Great = 5,
}
