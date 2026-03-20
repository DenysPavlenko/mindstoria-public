import {
  useTranslatedEmotionDefinitions,
  useTranslatedImpactDefinitions,
} from "@/hooks";
import { TEmotionDefinition, TImpactDefinition, TSentimentType } from "@/types";
import { isStringEmpty } from "@/utils";
import { useMemo } from "react";

export type TSentimentSearchResult =
  | (TImpactDefinition & { sentimentType: TSentimentType })
  | (TEmotionDefinition & { sentimentType: TSentimentType });

export const useSentimentSearch = (
  searchQuery: string,
): TSentimentSearchResult[] => {
  const impactDefinitions = useTranslatedImpactDefinitions({
    activeOnly: true,
  });
  const emotionDefinitions = useTranslatedEmotionDefinitions({
    activeOnly: true,
  });

  const allDefinitions = useMemo(() => {
    const impacts = impactDefinitions.map((impact) => ({
      ...impact,
      sentimentType: "impact" as TSentimentType,
    }));
    const emotions = emotionDefinitions.map((emotion) => ({
      ...emotion,
      sentimentType: "emotion" as TSentimentType,
    }));
    return [...impacts, ...emotions].sort((a, b) =>
      a.name.localeCompare(b.name),
    );
  }, [impactDefinitions, emotionDefinitions]);

  const searchResults = useMemo(() => {
    if (isStringEmpty(searchQuery)) return [];
    const lowerCaseQuery = searchQuery.toLowerCase();
    return allDefinitions.filter((item) =>
      item.name.toLowerCase().includes(lowerCaseQuery),
    );
  }, [searchQuery, allDefinitions]);

  return searchResults;
};
