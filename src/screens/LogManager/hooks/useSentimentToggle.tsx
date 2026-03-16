import { DraftLogStateField, TLogValue } from "@/types";
import { generateUniqueId } from "@/utils";
import { useCallback } from "react";
import { TLogFormValues } from "./useLogForm";

export const useSentimentToggle = (
  values: TLogFormValues,
  setField: (metricType: DraftLogStateField, value: TLogValue) => void,
) => {
  const handleSentimentToggle = useCallback(
    (category: "impact" | "emotion", id: string) => {
      const key = category === "impact" ? "impacts" : "emotions";
      const currentItems = values[key];
      const isSelected = currentItems.some((log) => log.definitionId === id);

      if (isSelected) {
        setField(
          key,
          currentItems.filter((log) => log.definitionId !== id),
        );
      } else {
        setField(key, [
          ...currentItems,
          { id: generateUniqueId(), definitionId: id },
        ]);
      }
    },
    [values, setField],
  );

  return handleSentimentToggle;
};
