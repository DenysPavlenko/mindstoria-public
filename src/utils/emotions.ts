import {
  RatingLevel,
  TEmotion,
  TEmotionDefinition,
  TEmotionDefinitions,
  TEmotionStats,
  TLog,
  TSentimentLog,
} from "@/types";
import { filterLogsByMood } from "./common";
import { getSentimentStats } from "./sentiment";

export const getEmotions = (
  logs: TSentimentLog[],
  defs: TEmotionDefinitions,
) => {
  const emotions: TEmotion[] = [];
  logs.forEach((log) => {
    const definition = defs[log.definitionId];
    if (definition) {
      emotions.push({
        id: log.id,
        definitionId: log.definitionId,
        name: definition.name,
        icon: definition.icon,
        isArchived: definition.isArchived,
      });
    }
  });
  return emotions;
};

export const getEmotionStats = (emotions: TEmotion[]): TEmotionStats => {
  return getSentimentStats(emotions, (id, items) => {
    const { name, icon, isArchived } = items[0]!;
    return { id, name, icon, isArchived, count: items.length };
  });
};

export const getEmotionStatsByMood = (
  logs: TLog[],
  emotionDefs: TEmotionDefinitions,
  selectedMood: RatingLevel | null,
): TEmotionStats => {
  const filteredLogs = filterLogsByMood(logs, selectedMood);
  const emotionLogs = filteredLogs.flatMap((l) => l.values.emotions);
  const emotions = getEmotions(emotionLogs, emotionDefs);
  return getEmotionStats(emotions);
};

export const sortEmotionDefinitions = (defs: TEmotionDefinition[]) => {
  return defs.sort((a, b) => {
    // Sort isUserCreated true first, then by name
    if (a.isUserCreated !== b.isUserCreated) {
      return a.isUserCreated ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
};
