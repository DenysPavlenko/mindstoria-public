import { TCBTLogMetricType } from "@/types";
import { TFunction } from "i18next";

export const getCBTTitle = (t: TFunction, type: TCBTLogMetricType) => {
  const titleMap: Record<TCBTLogMetricType, string> = {
    situation: t("cbt.situation"),
    thought: t("cbt.automatic_thought"),
    emotions: t("cbt.emotions"),
    behavior: t("cbt.behavior"),
    alternativeThought: t("cbt.alternative_thought"),
    cognitiveDistortions: t("cbt.cognitive_distortions"),
  };
  return titleMap[type];
};
