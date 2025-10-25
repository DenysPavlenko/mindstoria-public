import { TEmotionDefinitions } from "./emotions";
import { TImpactDefinitions } from "./impacts";
import { TLogs } from "./log";
import { TMedications, TMedLogs } from "./medications";
import { TSleepLogs } from "./sleep";

export type TBackUpData = {
  emotionDefinitions: TEmotionDefinitions;
  impactDefinitions: TImpactDefinitions;
  medications: TMedications;
  sleepLogs: TSleepLogs;
  medLogs: TMedLogs;
  logs: TLogs;
};
