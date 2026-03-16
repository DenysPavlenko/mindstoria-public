import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { Button, Header, SentimentSelector } from "@/components";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addDraftImpact,
  archiveImpactDefinition,
  removeDraftImpact,
  selectImpactSections,
} from "@/store/slices";
import { generateUniqueId } from "@/utils";
import { useRouter } from "expo-router";
import { useTranslation } from "react-i18next";

export const ImpactSelector = () => {
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const router = useRouter();
  const impactSections = useAppSelector(selectImpactSections);
  const selectedImpacts = useAppSelector((state) => state.draftLog.impacts);

  const handleAdd = (definitionId: string) => {
    dispatch(addDraftImpact({ id: generateUniqueId(), definitionId }));
  };

  const handleRemove = (definitionId: string) => {
    dispatch(removeDraftImpact(definitionId));
  };

  const handleArchive = (definitionId: string) => {
    dispatch(archiveImpactDefinition(definitionId));
    handleRemove(definitionId);
  };

  return (
    <>
      <Header title={t("impacts.select_impacts")} />
      <SentimentSelector
        sentimentType="impact"
        sections={impactSections}
        selectedLogs={selectedImpacts}
        onAdd={handleAdd}
        onRemove={handleRemove}
        onArchive={handleArchive}
        routes={{ definitionForm: "/impact-definition-form" }}
        translations={{
          searchPlaceholder: t("impacts.search_impact"),
          confirmDeleteContent: t("impacts.confirm_delete"),
        }}
        analytics={{
          editStarted: ANALYTICS_EVENTS.IMPACT_EDIT_STARTED,
          createStarted: ANALYTICS_EVENTS.IMPACT_CREATE_STARTED,
          deleteConfirmed: ANALYTICS_EVENTS.IMPACT_DELETE_CONFIRMED,
        }}
        footer={
          <Button onPress={router.back} fullWidth>
            {t("common.done")}
          </Button>
        }
      />
    </>
  );
};
