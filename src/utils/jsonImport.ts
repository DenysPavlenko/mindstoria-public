import { TBackUpData } from "@/types";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";

export const hasBackUpData = (data: TBackUpData) => {
  const allData = [
    ...Object.values(data.logs),
    ...Object.values(data.sleepLogs),
    ...Object.values(data.medLogs),
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
