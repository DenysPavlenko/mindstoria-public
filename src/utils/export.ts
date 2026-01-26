import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";

export const handleAndroidExport = async (
  jsonContent: string,
  fileName: string,
  dialogTitle: string,
  mimeType = "application/json",
  uti = "public.json",
) => {
  const file = new File(Paths.cache, fileName);
  try {
    file.create();
    file.write(jsonContent, {});
    // On Android, use sharing with dialogTitle to prompt user to save to Downloads
    await Sharing.shareAsync(file.uri, {
      mimeType,
      dialogTitle,
      UTI: uti, // This helps Android understand the file type
    });
  } catch {
    return false;
  } finally {
    file.delete();
  }
  return true;
};

export const handleIOSExport = async (
  jsonContent: string,
  fileName: string,
  mimeType = "application/json",
) => {
  const file = new File(Paths.cache, fileName);
  try {
    file.create();
    file.write(jsonContent, {});
    await Sharing.shareAsync(file.uri, { mimeType });
  } catch {
  } finally {
    file.delete();
  }
};
