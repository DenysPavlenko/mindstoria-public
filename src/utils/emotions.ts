import {
  TEmotion,
  TEmotionDefinition,
  TEmotionDefinitions,
  TEmotionLog,
  TEmotionStatsItem,
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
        name: definition.name,
        type: definition.type,
        icon: definition.icon,
        isArchived: definition.isArchived,
      });
    }
  });
  return emotions;
};

export const getEmotionsStats = (emotions: TEmotion[]): TEmotionStatsItem[] => {
  const groupedEmotions = groupBy(emotions, "definitionId");
  return Object.entries(groupedEmotions)
    .map(([id, items]) => {
      const { name, icon, type, isArchived } = items[0]!;
      return { id, name, icon, type, isArchived, count: items.length };
    })
    .sort((a, b) => {
      return b.count - a.count;
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
