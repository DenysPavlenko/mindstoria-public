import { ENTITLEMENT_ID } from "@/appConstants";
import { getAppVariant, getErrorMessage } from "@/utils";
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
  checkPremiumFeature: (callback: () => void) => void;
}

const RevenueCatContext = createContext<RevenueCatContextValue | undefined>(
  undefined
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

  const isPreviewEnv = useMemo(() => getAppVariant() === "preview", []);

  useEffect(() => {
    if (isPreviewEnv) {
      // Skip RevenueCat setup in preview environment
      setIsReady(true);
      return;
    }
    if (androidApiKey && iosApiKey) {
      Purchases.setLogLevel(Purchases.LOG_LEVEL.ERROR);
      if (Platform.OS === "ios") {
        Purchases.configure({ apiKey: iosApiKey });
      } else if (Platform.OS === "android") {
        Purchases.configure({ apiKey: androidApiKey });
      }
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
        typeof customerInfo.entitlements.active[ENTITLEMENT_ID] !== "undefined"
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

  const checkPremiumFeature = useCallback(
    (callback: () => void) => {
      // Always allow premium features in preview
      if (isPreviewEnv) {
        callback();
        return;
      }

      if (subscriptionActive) {
        callback();
      } else {
        setShowPaywall(true);
      }
    },
    [setShowPaywall, isPreviewEnv, subscriptionActive]
  );

  const value = useMemo(() => {
    return {
      isReady,
      error: error || setupError,
      showPaywall,
      setShowPaywall,
      checkPremiumFeature,
    };
  }, [
    showPaywall,
    setShowPaywall,
    isReady,
    error,
    setupError,
    checkPremiumFeature,
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
