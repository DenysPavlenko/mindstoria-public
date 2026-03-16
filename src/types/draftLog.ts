import { RatingLevel } from "./common";
import { TSentimentLog } from "./impacts";

export interface DraftLogState {
  wellbeing: RatingLevel | null;
  impacts: TSentimentLog[];
  emotions: TSentimentLog[];
  notes: string | null;
  timestamp: string;
}

export type DraftLogStateField = keyof DraftLogState;
