import { ANALYTICS_EVENTS } from "@/analytics-constants";
import { APP_STORE_REVIEW_LINK, PLAY_STORE_REVIEW_LINK } from "@/appConstants";
import Logo from "@/assets/icons/logo.svg";
import { useTheme } from "@/providers";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  clearRatingPrompt,
  markAppRated,
  postponeAppRating,
} from "@/store/slices";
import { TTheme } from "@/theme";
import { openLink, trackEvent } from "@/utils";
import * as StoreReview from "expo-store-review";
import React, { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import { Button } from "../Button/Button";
import { Modal } from "../Modal/Modal";
import { Typography } from "../Typography/Typography";

export const AppRatingDialog = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const dispatch = useAppDispatch();
  const showRatingPrompt = useAppSelector(
    (state) => state.settings.showRatingPrompt,
  );
  const ratingPromptCount = useAppSelector(
    (state) => state.settings.ratingPromptCount,
  );
  const [visible, setVisible] = useState(false);

  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    if (!showRatingPrompt) return;
    const timer = setTimeout(() => {
      setVisible(true);
      trackEvent(ANALYTICS_EVENTS.RATE_MODAL_SHOWN);
    }, 600);
    return () => clearTimeout(timer);
  }, [showRatingPrompt]);

  const showNativeDialog = async () => {
    try {
      const url =
        Platform.OS === "ios" ? APP_STORE_REVIEW_LINK : PLAY_STORE_REVIEW_LINK;
      // iOS allows native review dialog max 3 times per 365 days.
      // After that, fall back to store link.
      if (ratingPromptCount <= 3 && (await StoreReview.hasAction())) {
        trackEvent(ANALYTICS_EVENTS.RATE_MODAL_REVIEW_REQUESTED);
        await StoreReview.requestReview();
      } else {
        trackEvent(ANALYTICS_EVENTS.RATE_MODAL_LINK_OPENED);
        openLink(url);
      }
    } catch {}
  };

  const close = () => {
    setVisible(false);
    dispatch(clearRatingPrompt());
  };

  const onConfirm = () => {
    trackEvent(ANALYTICS_EVENTS.RATE_MODAL_RATE_CLICKED);
    dispatch(markAppRated());
    showNativeDialog();
    close();
  };

  const onDismiss = () => {
    dispatch(postponeAppRating());
    close();
  };

  return (
    <Modal visible={visible} onClose={onDismiss}>
      <Logo
        width={theme.layout.size.xl}
        height={theme.layout.size.xl}
        fill={theme.colors.onSurface}
        style={styles.icon}
      />
      <Typography variant="h3" align="center" style={styles.title}>
        {t("app_rating.title")}
      </Typography>
      <Typography variant="body" align="center" style={styles.text}>
        {t("app_rating.subtitle")}
      </Typography>
      <View style={styles.actionsContainer}>
        <Button style={styles.button} variant="text" onPress={onDismiss}>
          {t("app_rating.remind_me_later")}
        </Button>
        <Button style={styles.button} onPress={onConfirm}>
          {t("app_rating.rate_now")}
        </Button>
      </View>
    </Modal>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    icon: {
      alignSelf: "center",
      marginBottom: theme.layout.spacing.md,
    },
    title: {
      marginBottom: theme.layout.spacing.xs,
    },
    text: {
      marginBottom: theme.layout.spacing.xl,
    },
    actionsContainer: {
      flexDirection: "row",
      width: "100%",
      gap: theme.layout.spacing.xs,
    },
    button: {
      flex: 1,
    },
  });
