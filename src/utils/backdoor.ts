import { BACKDOOR_CODE, BACKDOOR_STORAGE_KEY } from "@/appConstants";
import { storage } from "@/services";

// Check if the provided code is correct
export const validateBackdoorCode = (code: string): boolean => {
  return code.trim().toUpperCase() === BACKDOOR_CODE;
};

// Store the backdoor active state
export const activateBackdoor = (): Promise<void> => {
  return storage.setItem(BACKDOOR_STORAGE_KEY, "true");
};

// Check if backdoor is currently active
export const isBackdoorActive = async (): Promise<boolean> => {
  return (await storage.getItem(BACKDOOR_STORAGE_KEY)) === "true";
};

// Deactivate backdoor (for testing or reset)
export const deactivateBackdoor = (): Promise<void> => {
  return storage.removeItem(BACKDOOR_STORAGE_KEY);
};
