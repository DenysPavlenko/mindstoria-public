import { FeatherIconName } from "@react-native-vector-icons/feather";
import { TChartDataPoint } from "./common";
import { TEmotionLog } from "./emotions";

export type TCBTLogValues = {
  situation: string;
  thought: string | null;
  behavior: string | null;
  emotions: TEmotionLog[];
  cognitiveDistortions: TCognitiveDistortionLog[];
  alternativeThought: string | null;
};

export type TCBTLogMetricType = keyof TCBTLogValues;

export type TCBTLogValue = TCBTLogValues[TCBTLogMetricType];

export type TCBTLog = {
  id: string;
  timestamp: string;
  values: TCBTLogValues;
  wellbeingLogId?: string;
};

export type TCBTLogs = Record<string, TCBTLog>;

export type TCBTLogMetric = {
  id: string;
  type: TCBTLogMetricType;
  isMandatory: boolean;
};

export type TCBTLogChartDataItem = {
  metric: keyof TCBTLogValues;
  data: TChartDataPoint[];
  average: number | null;
};

export type TCognitiveDistortionDefinition = {
  id: string;
  name: string;
  description: string;
  icon: FeatherIconName;
};

export type TCognitiveDistortionLog = {
  id: string;
  definitionId: string;
};
