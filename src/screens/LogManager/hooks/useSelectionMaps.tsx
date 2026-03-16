import { TSentimentLog } from "@/types";
import { useMemo } from "react";

interface LogItem {
  definitionId: string;
}

const buildMap = (items: LogItem[]): Record<string, boolean> => {
  const map: Record<string, boolean> = {};
  items.forEach((item) => {
    map[item.definitionId] = true;
  });
  return map;
};

export const useSelectionMaps = (
  impacts: TSentimentLog[],
  emotions: TSentimentLog[],
) => {
  const selectedImpactsMap = useMemo(() => buildMap(impacts), [impacts]);
  const selectedEmotionsMap = useMemo(() => buildMap(emotions), [emotions]);
  const selectedLogsMap = useMemo(
    () => ({ ...selectedImpactsMap, ...selectedEmotionsMap }),
    [selectedImpactsMap, selectedEmotionsMap],
  );

  return { selectedImpactsMap, selectedEmotionsMap, selectedLogsMap };
};
