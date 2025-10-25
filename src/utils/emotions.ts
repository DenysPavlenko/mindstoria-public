import {
  TEmotion,
  TEmotionDefinition,
  TEmotionDefinitions,
  TEmotionLog,
  TEmotionStatsItem,
  TSortBy,
} from "@/types";
import { groupBy } from "lodash";

export const getEmotions = (logs: TEmotionLog[], defs: TEmotionDefinitions) => {
  const emotions: TEmotion[] = [];
  logs.forEach((log) => {
    const definition = defs[log.definitionId];
    if (definition) {
      emotions.push({
        id: log.id,
        definitionId: log.definitionId,
        level: log.level,
        name: definition.name,
        type: definition.type,
        icon: definition.icon,
        isArchived: definition.isArchived,
      });
    }
  });
  return emotions;
};

export const getEmotionsStats = (
  emotions: TEmotion[],
  sortBy: TSortBy
): TEmotionStatsItem[] => {
  const groupedEmotions = groupBy(emotions, "definitionId");
  return Object.entries(groupedEmotions)
    .map(([id, items]) => {
      const avg = items.reduce((sum, i) => sum + i.level, 0) / items.length;
      const { name, icon, type, isArchived } = items[0]!;
      return { id, name, icon, type, avg, count: items.length, isArchived };
    })
    .sort((a, b) => {
      return sortBy === "count"
        ? b.count - a.count || b.avg - a.avg // desc by count, tiebreak by avg
        : b.avg - a.avg || b.count - a.count; // desc by avg, tiebreak by count
    });
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
