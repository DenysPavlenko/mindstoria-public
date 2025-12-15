import { TTheme } from "@/theme";
import { TSentimentType } from "@/types";

export const getSentimentColor = (
  type: TSentimentType,
  theme: TTheme
): string => {
  return type === "positive"
    ? theme.colors.rating["400"]
    : theme.colors.rating["50"];
};
