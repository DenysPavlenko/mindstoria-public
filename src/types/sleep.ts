import { RatingLevel } from "./common";

export type TSleepLog = {
  id: string;
  quality: RatingLevel;
  timestamp: string;
};

export type TSleepLogs = Record<string, TSleepLog>;
