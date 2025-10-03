import { Platform } from "react-native";

const isIOS = Platform.OS === "ios";
const iosVersion = isIOS ? parseFloat(Platform.Version as string) : 0;
export const isIOS26OrLater = iosVersion >= 26;
