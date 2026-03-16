import { FeatherIconName } from "@react-native-vector-icons/feather";
import {
  TSentimentDefinition,
  TSentimentLog,
  TSentimentStatsItem,
} from "./sentiment";

export type TImpactDefinition = TSentimentDefinition<FeatherIconName>;

export type TImpactDefinitions = Record<string, TImpactDefinition>;

export type TImpact = TSentimentLog & {
  name: string;
  icon: FeatherIconName;
  isArchived?: boolean;
};

export type TImpactStatsItem = TSentimentStatsItem<FeatherIconName>;
export type TImpactStats = {
  totalCount: number;
  data: TImpactStatsItem[];
};
