import {
  selectActiveImpactDefinitions,
  selectImpactDefinitions,
} from "@/store/slices";
import { sortImpactDefinitions } from "@/utils";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { useSelector } from "react-redux";

export const useTranslatedImpactDefinitions = (options: {
  sorted?: boolean;
  activeOnly?: boolean;
}) => {
  const { t } = useTranslation();

  const selector = options.activeOnly
    ? selectActiveImpactDefinitions
    : selectImpactDefinitions;
  const impacts = useSelector(selector);

  return useMemo(() => {
    const translated = impacts.map((impact) => {
      return { ...impact, name: t(impact.name) };
    });

    if (options.sorted) {
      return sortImpactDefinitions(translated);
    }

    return translated;
  }, [impacts, t, options.sorted]);
};
