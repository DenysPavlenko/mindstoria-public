import { useAppSelector } from "@/store";
import {
  selectActiveEmotionDefinitions,
  selectEmotionDefinitions,
} from "@/store/slices";
import { sortEmotionDefinitions } from "@/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

export const useTranslatedEmotionDefinitions = (options?: {
  sorted?: boolean;
  activeOnly?: boolean;
}) => {
  const { t } = useTranslation();

  const selector = options?.activeOnly
    ? selectActiveEmotionDefinitions
    : selectEmotionDefinitions;
  const emotions = useAppSelector(selector);

  return useMemo(() => {
    const translated = emotions.map((emotion) => {
      return { ...emotion, name: t(emotion.name) };
    });

    if (options?.sorted) {
      return sortEmotionDefinitions(translated);
    }

    return translated;
  }, [emotions, t, options?.sorted]);
};
