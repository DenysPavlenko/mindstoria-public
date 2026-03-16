import {
  TSentimentDefinition,
  TSentimentLog,
  TSentimentStatsItem,
} from "./sentiment";

export type TEmotionDefinition = TSentimentDefinition<string>;

export type TEmotionDefinitions = Record<string, TEmotionDefinition>;

export type TEmotion = TSentimentLog & {
  name: string;
  icon: string;
  isArchived?: boolean;
};

export type TEmotionStatsItem = TSentimentStatsItem<string>;
export type TEmotionStats = {
  totalCount: number;
  data: TEmotionStatsItem[];
};
