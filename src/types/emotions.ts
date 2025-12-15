import { TSentimentLevel, TSentimentStatsItem, TSentimentType } from "./common";

export type TEmotionDefinition = {
  id: string;
  name: string;
  type: TSentimentType;
  icon: string;
  isUserCreated: boolean;
  isArchived?: boolean;
};

export type TEmotionDefinitions = Record<string, TEmotionDefinition>;

export type TEmotionLog = {
  id: string;
  definitionId: string;
  level?: TSentimentLevel;
};

export type TEmotion = TEmotionLog & {
  name: string;
  type: TSentimentType;
  icon: string;
  isArchived?: boolean;
};

export type TEmotionStatsItem = TSentimentStatsItem<string>;
