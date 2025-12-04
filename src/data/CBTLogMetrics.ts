import { TCBTLogMetric } from "@/types";

export const CBT_LOG_METRICS: TCBTLogMetric[] = [
  {
    id: "situation",
    type: "situation",
    isMandatory: true,
  },
  {
    id: "thought",
    type: "thought",
    isMandatory: false,
  },
  {
    id: "behavior",
    type: "behavior",
    isMandatory: false,
  },
  {
    id: "emotions",
    type: "emotions",
    isMandatory: false,
  },
  {
    id: "cognitiveDistortions",
    type: "cognitiveDistortions",
    isMandatory: false,
  },
  {
    id: "alternativeThought",
    type: "alternativeThought",
    isMandatory: false,
  },
];
