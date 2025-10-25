import {
  TImpact,
  TImpactDefinition,
  TImpactDefinitions,
  TImpactLog,
  TImpactStatsItem,
  TSortBy,
} from "@/types";
import { groupBy } from "lodash";

export const getImpacts = (logs: TImpactLog[], defs: TImpactDefinitions) => {
  const impacts: TImpact[] = [];
  logs.forEach((log) => {
    const definition = defs[log.definitionId];
    if (definition) {
      impacts.push({
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
  return impacts;
};

export const getImpactsStats = (
  impacts: TImpact[],
  sortBy: TSortBy
): TImpactStatsItem[] => {
  const groupedImpacts = groupBy(impacts, "definitionId");
  return Object.entries(groupedImpacts)
    .map(([id, items]) => {
      const avg = items.reduce((sum, i) => sum + i.level, 0) / items.length;
      const { icon, name, type, isArchived } = items[0]!;
      return { id, icon, name, type, avg, count: items.length, isArchived };
    })
    .sort((a, b) => {
      return sortBy === "count"
        ? b.count - a.count || b.avg - a.avg // desc by count, tiebreak by avg
        : b.avg - a.avg || b.count - a.count; // desc by avg, tiebreak by count
    });
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
