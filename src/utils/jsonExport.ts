import { TBackUpData } from "@/types";
import dayjs from "dayjs";
import { Platform } from "react-native";
import { handleAndroidExport, handleIOSExport } from "./export";

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
