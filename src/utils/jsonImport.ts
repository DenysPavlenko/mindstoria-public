import { TEntries, TTrackers, TTrackersData } from "@/types";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";

export const importTrackerAsJSON = async (): Promise<TTrackersData | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
  });
  if (result.canceled || !result.assets[0]) {
    // User cancelled the document picker
    return null;
  }
  const file = new File(result.assets[0]);
  const data = JSON.parse(file.textSync());
  const trackers = data.trackers as TTrackers;
  const entries = data.entries as TEntries;
  if (!trackers || !entries) {
    throw new Error("Invalid JSON format");
  }
  return { trackers, entries };
};
