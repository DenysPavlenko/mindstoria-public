import { useAppSelector } from "@/store/hooks";
import * as Haptics from "expo-haptics";
import { useCallback } from "react";

const styleMap = {
  light: Haptics.ImpactFeedbackStyle.Light,
  medium: Haptics.ImpactFeedbackStyle.Medium,
  heavy: Haptics.ImpactFeedbackStyle.Heavy,
};

type THapticStyle = keyof typeof styleMap;

export const useHaptics = () => {
  const enabled = useAppSelector((state) => state.settings.haptics);

  const triggerImpact = useCallback(
    (style: THapticStyle = "light") => {
      if (enabled) {
        Haptics.impactAsync(styleMap[style]);
      }
    },
    [enabled],
  );

  return { enabled, triggerImpact };
};
