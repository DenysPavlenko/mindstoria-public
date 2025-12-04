import { BACKDOOR_CODE, BACKDOOR_STORAGE_KEY } from "@/appConstants";
import { createMMKV } from "react-native-mmkv";

// Separate MMKV instance for backdoor to keep it isolated
export const backdoorStorage = createMMKV();

// Check if the provided code is correct
export const validateBackdoorCode = (code: string): boolean => {
  return code.trim().toUpperCase() === BACKDOOR_CODE;
};

// Store the backdoor active state
export const activateBackdoor = (): void => {
  backdoorStorage.set(BACKDOOR_STORAGE_KEY, true);
};

// Check if backdoor is currently active
export const isBackdoorActive = (): boolean => {
  return backdoorStorage.getBoolean(BACKDOOR_STORAGE_KEY) ?? false;
};

// Deactivate backdoor (for testing or reset)
export const deactivateBackdoor = (): void => {
  backdoorStorage.remove(BACKDOOR_STORAGE_KEY);
};
