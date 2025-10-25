import { TBackUpData } from "@/types";
import dayjs from "dayjs";
import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import { Platform } from "react-native";

const handleAndroidExport = async (jsonContent: string, fileName: string) => {
  const file = new File(Paths.cache, fileName);
  try {
    file.create();
    file.write(jsonContent, {});
    // On Android, use sharing with dialogTitle to prompt user to save to Downloads
    await Sharing.shareAsync(file.uri, {
      mimeType: "application/json",
      dialogTitle: "Save JSON file",
      UTI: "public.json", // This helps Android understand it's a JSON file
    });
  } catch {
    return false;
  } finally {
    file.delete();
  }
  return true;
};

const handleIOSExport = async (jsonContent: string, fileName: string) => {
  const file = new File(Paths.cache, fileName);
  try {
    file.create();
    file.write(jsonContent, {});
    await Sharing.shareAsync(file.uri, { mimeType: "application/json" });
  } catch {
  } finally {
    file.delete();
  }
};

export const exportDataAsJSON = async (data: TBackUpData) => {
  const jsonContent = JSON.stringify(data, null, 2);
  const timestamp = dayjs().format("YYYY-MM-DD_HH:mm:ss");
  const name = `mindstoria-${timestamp}.json`;
  if (Platform.OS === "android") {
    return await handleAndroidExport(jsonContent, name);
  } else {
    return await handleIOSExport(jsonContent, name);
  }
};
