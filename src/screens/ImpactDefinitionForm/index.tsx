import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { SentimentDefinitionForm } from "@/components/SentimentDefinitionForm/SentimentDefinitionForm";
import { iconList } from "@/data";
import { useTranslatedImpactDefinitions } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addImpactDefinition,
  selectImpactDefinitionCategories,
  selectImpactDefinitionCategoryOrder,
  updateImpactDefinition,
} from "@/store/slices";
import { TSentimentCategoryDefinition } from "@/types";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";

interface ImpactDefinitionFormProps {
  prefillName?: string;
  prefillCategoryId?: string;
  definitionId?: string;
}

export const ImpactDefinitionForm = ({
  prefillName,
  prefillCategoryId,
  definitionId,
}: ImpactDefinitionFormProps) => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const definitions = useTranslatedImpactDefinitions({ activeOnly: true });
  const categoryOrder = useAppSelector(selectImpactDefinitionCategoryOrder);
  const categoriesMap = useAppSelector(selectImpactDefinitionCategories);
  const categories = useMemo(() => {
    return categoryOrder
      .map((id) => categoriesMap[id])
      .filter((category): category is TSentimentCategoryDefinition =>
        Boolean(category),
      );
  }, [categoryOrder, categoriesMap]);

  return (
    <SentimentDefinitionForm
      prefillName={prefillName}
      prefillCategoryId={prefillCategoryId}
      definitionId={definitionId}
      definitions={definitions}
      iconList={iconList}
      categories={categories}
      sentimentType="impact"
      translations={{
        headerTitle: t("impacts.add_own_impact"),
        inputLabel: t("impacts.impact_name"),
        inputPlaceholder: t("impacts.add_impact_placeholder"),
        duplicateError: t("impacts.duplicate_impact_name"),
      }}
      analytics={{
        editCompleted: ANALYTICS_EVENTS.IMPACT_EDIT_COMPLETED,
        createCompleted: ANALYTICS_EVENTS.IMPACT_CREATE_COMPLETED,
      }}
      onAdd={(def) => {
        dispatch(
          addImpactDefinition({ ...def, icon: def.icon as FeatherIconName }),
        );
      }}
      onEdit={(def) => {
        dispatch(
          updateImpactDefinition({ ...def, icon: def.icon as FeatherIconName }),
        );
      }}
    />
  );
};
