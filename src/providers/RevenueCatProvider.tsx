import { ENTITLEMENT_ID } from "@/appConstants";
import {
  activateBackdoor,
  getAppVariant,
  getErrorMessage,
  isBackdoorActive,
  validateBackdoorCode,
} from "@/utils";
import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { Platform } from "react-native";
import Purchases from "react-native-purchases";

const androidApiKey = process.env.EXPO_PUBLIC_REVENUE_CAT_ANDROID_API_KEY;
const iosApiKey = process.env.EXPO_PUBLIC_REVENUE_CAT_IOS_API_KEY;

interface RevenueCatContextValue {
  isReady: boolean;
  error: string | null;
  showPaywall: boolean;
  setShowPaywall: (visible: boolean) => void;
  checkPremiumFeature: (callback: () => void) => boolean;
  submitBackdoorCode: (code: string) => boolean;
  subscriptionActive: boolean;
}

const RevenueCatContext = createContext<RevenueCatContextValue | undefined>(
  undefined,
);

export const RevenueCatProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isReady, setIsReady] = useState(false);
  const [showPaywall, setShowPaywall] = useState(false);
  const [subscriptionActive, setSubscriptionActive] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [setupError, setSetupError] = useState<string | null>(null);
  const [backdoorActive, setBackdoorActive] = useState(false);

  const isPreviewEnv = useMemo(() => getAppVariant() === "preview", []);

  useEffect(() => {
    // Check if backdoor is active on mount
    isBackdoorActive().then((active) => {
      setBackdoorActive(active);
    });
  }, []);

  useEffect(() => {
    if (isPreviewEnv) {
      // Skip RevenueCat setup in preview environment
      setIsReady(true);
      return;
    }
    const apiKey = Platform.OS === "android" ? androidApiKey : iosApiKey;
    if (apiKey) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.ERROR);
      Purchases.configure({ apiKey });
    } else {
      setSetupError("RevenueCat API keys are not set");
    }
    setIsReady(true);
  }, [isPreviewEnv]);

  const getCustomerInfo = useCallback(async () => {
    if (!isReady || setupError) return;
    try {
      const customerInfo = await Purchases.getCustomerInfo();
      setSubscriptionActive(
        typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined",
      );
    } catch (error) {
      const errorMsg = getErrorMessage(error);
      setError(errorMsg);
    }
  }, [isReady, setupError]);

  useEffect(() => {
    // Get customer info when component first mounts
    getCustomerInfo();
  }, [getCustomerInfo]);

  useEffect(() => {
    // Subscribe to purchaser updates
    Purchases.addCustomerInfoUpdateListener(getCustomerInfo);
    return () => {
      Purchases.removeCustomerInfoUpdateListener(getCustomerInfo);
    };
  }, [getCustomerInfo]);

  const submitBackdoorCode = useCallback((code: string): boolean => {
    if (validateBackdoorCode(code)) {
      activateBackdoor();
      setBackdoorActive(true);
      return true;
    }
    return false;
  }, []);

  const checkPremiumFeature = useCallback(
    (callback: () => void) => {
      // Always allow premium features in preview or if backdoor is active
      if (isPreviewEnv || backdoorActive) {
        callback();
        return true;
      }

      if (subscriptionActive) {
        callback();
        return true;
      } else {
        setShowPaywall(true);
      }
      return false;
    },
    [setShowPaywall, isPreviewEnv, subscriptionActive, backdoorActive],
  );

  const value = useMemo(() => {
    return {
      isReady,
      error: error || setupError,
      showPaywall,
      setShowPaywall,
      checkPremiumFeature,
      submitBackdoorCode,
      subscriptionActive,
    };
  }, [
    showPaywall,
    setShowPaywall,
    isReady,
    error,
    setupError,
    checkPremiumFeature,
    submitBackdoorCode,
    subscriptionActive,
  ]);

  return (
    <RevenueCatContext.Provider value={value}>
      {children}
    </RevenueCatContext.Provider>
  );
};

export const useRevenueCat = (): RevenueCatContextValue => {
  const context = useContext(RevenueCatContext);
  if (!context) {
    throw new Error("useRevenueCat must be used within RevenueCatProvider");
  }
  return context;
};
