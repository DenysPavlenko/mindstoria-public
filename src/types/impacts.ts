import { FeatherIconName } from "@react-native-vector-icons/feather";
import { TSentimentLevel, TSentimentStatsItem, TSentimentType } from "./common";

export type TImpactDefinition = {
  id: string;
  name: string;
  type: TSentimentType;
  icon: FeatherIconName;
  isUserCreated: boolean;
  isArchived?: boolean;
};

export type TImpactDefinitions = Record<string, TImpactDefinition>;

export type TImpactLog = {
  id: string;
  definitionId: string;
  level: TSentimentLevel;
};

export type TImpact = TImpactLog & {
  name: string;
  type: TSentimentType;
  icon: FeatherIconName;
  isArchived?: boolean;
};

export type TImpactStatsItem = TSentimentStatsItem<FeatherIconName>;
