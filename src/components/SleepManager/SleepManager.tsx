import { ANALYTICS_EVENTS } from "@/analytics-constants";
import Moon from "@/assets/icons/moon.svg";
import { useTheme } from "@/providers";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addSleepLogThunk,
  removeSleepThunk,
  selectSleepLogsGroupedByDate,
  updateSleepLogThunk,
} from "@/store/slices";
import {
  CALENDAR_DATE_FORMAT,
  generateUniqueId,
  getRatingLevelColor,
  getRatingLevelLabel,
  trackEvent,
} from "@/utils";
import { Dayjs } from "dayjs";
import React, { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { View, ViewStyle } from "react-native";
import { INFO_CARD_HEIGHT, InfoCard } from "../InfoCard/InfoCard";
import { Typography } from "../Typography/Typography";
import { RatingSlider } from "./components/RatingSlider";

interface SleepManagerProps {
  date: Dayjs;
  fullMode?: boolean;
}

export const SleepManager = ({ date, fullMode }: SleepManagerProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const [showModal, setShowModal] = useState(false);
  const sleepLogs = useAppSelector(selectSleepLogsGroupedByDate);

  const todaySleep = useMemo(() => {
    const dateKey = date.format(CALENDAR_DATE_FORMAT);
    return sleepLogs[dateKey] || null;
  }, [sleepLogs, date]);

  const quality = todaySleep?.quality || null;

  const handleSave = (value: number, source: "overlay" | "button") => {
    if (todaySleep) {
      dispatch(updateSleepLogThunk({ ...todaySleep, quality: value }));
      trackEvent(ANALYTICS_EVENTS.SLEEP_LOG_UPDATED, { source });
    } else {
      dispatch(
        addSleepLogThunk({
          id: generateUniqueId(),
          quality: value,
          timestamp: date.toISOString(),
        }),
      );
      trackEvent(ANALYTICS_EVENTS.SLEEP_LOG_ADDED, { source });
    }
  };

  const handleSliderClose = (withData: boolean) => {
    setShowModal(false);
    if (!withData) {
      trackEvent(ANALYTICS_EVENTS.SLEEP_LOG_CANCELLED);
    }
  };

  const handleDelete = () => {
    if (todaySleep) {
      dispatch(removeSleepThunk(todaySleep));
      trackEvent(ANALYTICS_EVENTS.SLEEP_LOG_DELETED);
    }
    setShowModal(false);
  };

  const renderIcon = () => {
    const iconColor = quality
      ? getRatingLevelColor(quality, theme)
      : theme.colors.outlineVariant;
    const size = INFO_CARD_HEIGHT - theme.layout.spacing.lg * 2;
    const positionStyle: ViewStyle = fullMode
      ? {
          position: "absolute",
          top: 0,
          right: theme.layout.spacing.lg,
          bottom: 0,
          justifyContent: "center",
        }
      : { position: "absolute", right: -24, top: -24 };
    return (
      <View style={positionStyle}>
        <Moon width={size} height={size} fill={iconColor} />
      </View>
    );
  };

  const renderCard = () => {
    return (
      <InfoCard
        title={t("sleep.quality")}
        onPress={() => setShowModal(true)}
        icon={renderIcon()}
      >
        {quality && (
          <Typography variant="h3">
            {getRatingLevelLabel(quality, t)}
          </Typography>
        )}
      </InfoCard>
    );
  };

  const renderRatingSlider = () => {
    if (!showModal) return null;
    return (
      <RatingSlider
        quality={quality}
        onSave={handleSave}
        onClose={handleSliderClose}
        onDelete={handleDelete}
      />
    );
  };

  return (
    <>
      {renderCard()}
      {renderRatingSlider()}
    </>
  );
};
