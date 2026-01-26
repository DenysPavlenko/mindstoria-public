import { TBackUpData } from "@/types";
import dayjs from "dayjs";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import { Platform } from "react-native";
import { handleAndroidExport, handleIOSExport } from "./export";

export const hasBackUpData = (data: TBackUpData) => {
  const allData = [
    ...Object.values(data.logs),
    ...Object.values(data.sleepLogs),
    ...Object.values(data.medLogs),
    ...Object.values(data.cbtLogs),
  ];
  if (allData.length > 0) return true;
  return false;
};

export const importDataAsJSON = async (): Promise<TBackUpData | null> => {
  const result = await DocumentPicker.getDocumentAsync({
    copyToCacheDirectory: true,
  });
  if (result.canceled || !result.assets[0]) {
    // User cancelled the document picker
    return null;
  }
  try {
    const file = new File(result.assets[0].uri);
    const fileContent = file.textSync();
    if (!fileContent || fileContent.trim() === "") {
      throw new Error("File is empty");
    }
    const data = JSON.parse(fileContent) as TBackUpData;

    // Validate required fields exist
    if (!data || typeof data !== "object") {
      throw new Error("Invalid JSON structure");
    }

    if (!hasBackUpData(data)) {
      throw new Error("No data to import");
    }

    return data;
  } catch (error) {
    if (error instanceof SyntaxError) {
      throw new Error("Invalid JSON file");
    }
    throw error;
  }
};

export const exportDataAsJSON = async (data: TBackUpData) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const timestamp = dayjs().format("YYYY-MM-DD_HH:mm:ss");
  const name = `mindstoria-${timestamp}.json`;
  if (Platform.OS === "android") {
    return await handleAndroidExport(jsonContent, name, "Save JSON file");
  } else {
    return await handleIOSExport(jsonContent, name);
  }
};
