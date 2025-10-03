import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { hidePaywall, showPaywall } from "@/store/slices";
import { useCallback } from "react";

export const usePremium = () => {
  const dispatch = useAppDispatch();
  const { isPaywallVisible, isPremium } = useAppSelector(
    (state) => state.premium
  );

  const showPaywallModal = useCallback(() => {
    dispatch(showPaywall());
  }, [dispatch]);

  const hidePaywallModal = useCallback(() => {
    dispatch(hidePaywall());
  }, [dispatch]);

  const checkPremiumFeature = useCallback(
    (callback: () => void) => {
      if (isPremium) {
        callback();
      } else {
        showPaywallModal();
      }
    },
    [isPremium, showPaywallModal]
  );

  return {
    isPaywallVisible,
    isPremium,
    showPaywallModal,
    hidePaywallModal,
    checkPremiumFeature,
  };
};
