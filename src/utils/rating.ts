import { RatingLevel } from "@/types";

const MIN_LOGS_FOR_RATING = 5;

export const shouldTriggerRatingFromMoodLog = ({
  wellbeing,
  logCount,
}: {
  wellbeing: RatingLevel;
  logCount: number;
}): boolean => {
  return wellbeing >= RatingLevel.Good && logCount >= MIN_LOGS_FOR_RATING;
};
