import { useRevenueCat } from "@/providers";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  selectStatsDateIso,
  selectStatsPeriod,
  setStatsDateIso,
  setStatsPeriod,
} from "@/store/slices";
import { TTimePeriod } from "@/types";
import { trackEvent } from "@/utils";
import dayjs from "dayjs";
import { useEffect, useMemo } from "react";

interface useStatsPeriodNavigationOptions {
  periodChangedEvent: string;
  periodChangeAttemptedEvent: string;
  dateChangedEvent: string;
}

export const useStatsPeriodNavigation = (
  options: useStatsPeriodNavigationOptions,
) => {
  const { checkPremiumFeature, premiumState } = useRevenueCat();
  const dispatch = useAppDispatch();
  const storedPeriod = useAppSelector(selectStatsPeriod);
  const dateIso = useAppSelector(selectStatsDateIso);
  const period: TTimePeriod =
    premiumState === "premium" ? storedPeriod : "week";
  const date = useMemo(() => {
    return dateIso ? dayjs(dateIso) : dayjs();
  }, [dateIso]);

  useEffect(() => {
    if (dateIso) return;
    dispatch(setStatsDateIso(dayjs().toISOString()));
  }, [dateIso, dispatch]);

  const handlePeriodChange = (nextPeriod: TTimePeriod) => {
    const hasPremium = checkPremiumFeature(() => {
      dispatch(setStatsPeriod(nextPeriod));
      dispatch(setStatsDateIso(dayjs().toISOString())); // Reset date when period changes
      trackEvent(options.periodChangedEvent, {
        period: nextPeriod,
      });
    });
    trackEvent(options.periodChangeAttemptedEvent, {
      paidUser: hasPremium,
    });
  };

  const handleDateChange = (newDate: dayjs.Dayjs) => {
    dispatch(setStatsDateIso(newDate.toISOString()));
    trackEvent(options.dateChangedEvent, {
      date: newDate.toISOString(),
    });
  };

  return { period, date, handlePeriodChange, handleDateChange };
};
