import {
  RatingLevel,
  TImpact,
  TImpactDefinition,
  TImpactDefinitions,
  TImpactStats,
  TLog,
  TSentimentLog,
} from "@/types";
import { filterLogsByMood } from "./common";
import { getSentimentStats } from "./sentiment";

export const getImpacts = (
  logs: TSentimentLog[],
  defs: TImpactDefinitions,
): TImpact[] => {
  const impacts: TImpact[] = [];
  logs.forEach((log) => {
    const definition = defs[log.definitionId];
    if (definition) {
      impacts.push({
        id: log.id,
        definitionId: log.definitionId,
        name: definition.name,
        type: definition.type,
        icon: definition.icon,
        isArchived: definition.isArchived,
      });
    }
  });
  return impacts;
};

export const getImpactStats = (impacts: TImpact[]): TImpactStats => {
  return getSentimentStats(impacts, (id, items) => {
    const { icon, name, isArchived } = items[0]!;
    return { id, icon, name, count: items.length, isArchived };
  });
};

export const getImpactStatsByMood = (
  logs: TLog[],
  impactDefs: TImpactDefinitions,
  selectedMood: RatingLevel | null,
): TImpactStats => {
  const filteredLogs = filterLogsByMood(logs, selectedMood);
  const impactLogs = filteredLogs.flatMap((l) => l.values.impacts);
  const impacts = getImpacts(impactLogs, impactDefs);
  return getImpactStats(impacts);
};

export const sortImpactDefinitions = (defs: TImpactDefinition[]) => {
  return defs.sort((a, b) => {
    // Sort isUserCreated true first, then by name
    if (a.isUserCreated !== b.isUserCreated) {
      return a.isUserCreated ? -1 : 1;
    }
    return a.name.localeCompare(b.name);
  });
};
