import { COGNITIVE_DISTORTIONS } from "@/data/cognitiveDistortions";
import { TCBTLog, TEmotionDefinitions } from "@/types";
import dayjs from "dayjs";
import { TFunction } from "i18next";
import { Platform } from "react-native";
import { handleAndroidExport, handleIOSExport } from "./export";

const convertLogsToCSV = (
  logs: TCBTLog[],
  emotionDefs: TEmotionDefinitions,
  t: TFunction,
): string => {
  const headers = [
    "Timestamp",
    "Situation",
    "Thought",
    "Behavior",
    "Emotions",
    "Cognitive Distortions",
    "Alternative Thought",
  ];

  const sortedLogs = [...logs].slice().sort((a, b) => {
    return dayjs(a.timestamp).diff(dayjs(b.timestamp));
  });

  const getDistortionName = (definitionId: string) => {
    const def = COGNITIVE_DISTORTIONS.find((d) => d.id === definitionId);
    return t(def ? def.name : "Unknown");
  };

  const escapeCSV = (value: string | null | undefined) => {
    return `"${(value ?? "").replace(/"/g, '""')}"`;
  };

  const csvRows = sortedLogs.map((log) => {
    const { timestamp } = log;
    const {
      situation,
      thought,
      behavior,
      emotions,
      cognitiveDistortions,
      alternativeThought,
    } = log.values;
    const emotionNames = emotions
      .map((e) => {
        const transString = emotionDefs[e.definitionId]?.name ?? "Unknown";
        return t(transString);
      })
      .join("; ");
    const distortionNames = cognitiveDistortions
      .map((cd) => getDistortionName(cd.definitionId))
      .join("; ");

    const row = [
      dayjs(timestamp).format("YYYY-MM-DD"),
      escapeCSV(situation),
      escapeCSV(thought),
      escapeCSV(behavior),
      escapeCSV(emotionNames),
      escapeCSV(distortionNames),
      escapeCSV(alternativeThought),
    ];
    return row.join(",");
  });

  return [headers.join(","), ...csvRows].join("\n");
};

export const exportCBTAsCSV = async (
  logs: TCBTLog[],
  emotionDefs: TEmotionDefinitions,
  t: TFunction,
) => {
  const csvContent = convertLogsToCSV(logs, emotionDefs, t);
  const timestamp = dayjs().format("YYYY-MM-DD_HH:mm:ss");
  const name = `mindstoria-${timestamp}.csv`;

  if (Platform.OS === "android") {
    return await handleAndroidExport(
      csvContent,
      name,
      "Export CSV",
      "text/csv",
      "public.comma-separated-values-text",
    );
  } else {
    return await handleIOSExport(csvContent, name, "text/csv");
  }
};
