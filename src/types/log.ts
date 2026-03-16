import { RatingLevel, TChartDataPoint } from "./common";
import { TSentimentLog } from "./sentiment";

export type TLogValues = {
  wellbeing: RatingLevel;
  impacts: TSentimentLog[];
  emotions: TSentimentLog[];
  notes: string | null;
};

export type TLogMetricType = keyof TLogValues;

export type TLogValue = TLogValues[TLogMetricType];

export type TLog = {
  id: string;
  timestamp: string;
  values: TLogValues;
};

export type TLogs = Record<string, TLog>;

export type TLogMetric = {
  id: string;
  type: TLogMetricType;
  min?: number;
  max?: number;
  isVisible: boolean;
  isMandatory: boolean;
};

export type TLogChartDataItem = {
  metric: keyof TLogValues;
  data: TChartDataPoint[];
  average: number | null;
};
