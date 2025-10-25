import Moon from "@/assets/icons/moon.svg";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  addSleepLogThunk,
  removeSleepThunk,
  updateSleepLogThunk,
} from "@/store/slices";
import { selectSleepLogsGroupedByDate } from "@/store/slices/sleepLogs/sleepLogsSelectors";
import { useTheme } from "@/theme";
import {
  CALENDAR_DATE_FORMAT,
  generateUniqueId,
  getRatingLevelColor,
  getRatingLevelLabel,
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

  const handleSave = (value: number) => {
    if (todaySleep) {
      dispatch(updateSleepLogThunk({ ...todaySleep, quality: value }));
    } else {
      dispatch(
        addSleepLogThunk({
          id: generateUniqueId(),
          quality: value,
          timestamp: date.toISOString(),
        })
      );
    }
  };

  const renderIcon = () => {
    const iconColor = quality
      ? theme.colors.surface
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
      : { position: "absolute", right: -20, top: -20 };
    return (
      <View style={positionStyle}>
        <Moon width={size} height={size} fill={iconColor} />
      </View>
    );
  };

  const renderCard = () => {
    const cardColor = quality ? getRatingLevelColor(quality, theme) : undefined;
    return (
      <InfoCard
        title={t("sleep.quality")}
        onPress={() => setShowModal(true)}
        cardColor={cardColor}
        icon={renderIcon()}
      >
        {quality && (
          <Typography variant="h3" color="surface">
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
        onClose={() => setShowModal(false)}
        onDelete={() => {
          if (todaySleep) {
            dispatch(removeSleepThunk(todaySleep));
          }
          setShowModal(false);
        }}
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
