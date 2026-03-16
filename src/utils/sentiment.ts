import {
  TSentimentCategoryDefinition,
  TSentimentDefinition,
  TSentimentSection,
} from "@/types";
import { groupBy } from "lodash";

interface SentimentItem {
  definitionId: string;
  [key: string]: unknown;
}

interface SentimentStatsResult<T> {
  totalCount: number;
  data: T[];
}

export const getSentimentStats = <
  TItem extends SentimentItem,
  TResult extends { id: string; count: number },
>(
  items: TItem[],
  mapItem: (id: string, items: TItem[]) => TResult,
): SentimentStatsResult<TResult> => {
  const grouped = groupBy(items, "definitionId");
  const data = Object.entries(grouped)
    .map(([id, groupItems]) => mapItem(id, groupItems))
    .sort((a, b) => b.count - a.count);

  return {
    totalCount: items.length,
    data,
  };
};

export const buildSentimentSections = (
  categoryOrder: string[],
  categories: Record<string, TSentimentCategoryDefinition>,
  items: TSentimentDefinition[],
): TSentimentSection[] => {
  const grouped = items.reduce<Record<string, TSentimentDefinition[]>>(
    (acc, item) => {
      const categoryId = item.categoryId;
      if (!acc[categoryId]) {
        acc[categoryId] = [];
      }
      acc[categoryId].push(item);
      return acc;
    },
    {},
  );

  const sections = categoryOrder.map((categoryId) => {
    const category = categories[categoryId];
    return {
      title: category?.name ?? categoryId,
      id: categoryId,
      data: grouped[categoryId] ?? [],
    };
  });

  return sections;
};
