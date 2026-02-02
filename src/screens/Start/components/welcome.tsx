import WelcomeIllustration from "@/assets/images/welcome-illustration.svg";
import { Button, SafeView, Typography } from "@/components";
import { useTheme } from "@/providers";
import { useAppDispatch } from "@/store";
import { setWelcomeShown } from "@/store/slices/settings/settingsSlice";
import { trackEvent } from "@/utils";
import { useEffect } from "react";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface WelcomeProps {
  onNext?: () => void;
}

export const Welcome = ({ onNext }: WelcomeProps) => {
  const dispatch = useAppDispatch();
  const { t } = useTranslation();
  const { theme } = useTheme();

  useEffect(() => {
    trackEvent("WELCOME_SCREEN_OPENED");
  }, []);

  const handleGetStarted = () => {
    dispatch(setWelcomeShown());
    trackEvent("WELCOME_GET_STARTED_CLICKED");
    onNext?.();
  };

  const iconSize = 240;

  return (
    <SafeView
      direction="vertical"
      style={{
        justifyContent: "center",
        alignItems: "center",
        paddingHorizontal: theme.layout.spacing.lg,
      }}
    >
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          paddingBottom: theme.layout.spacing.xxl,
        }}
      >
        <View
          style={{
            marginBottom: theme.layout.spacing.lg,
            width: iconSize,
            height: iconSize,
            justifyContent: "center",
            alignItems: "center",
            overflow: "hidden",
          }}
        >
          <WelcomeIllustration
            width={iconSize * 1.5}
            height={iconSize * 1.5}
            fill={theme.colors.outlineVariant}
          />
        </View>
        <Typography
          variant="h1"
          align="center"
          style={{ marginBottom: theme.layout.spacing.lg }}
        >
          {t("welcome.title")}
        </Typography>
        <Typography
          variant="h5"
          align="center"
          style={{ marginBottom: theme.layout.spacing.sm }}
        >
          {t("welcome.subtitle")}
        </Typography>
        <Typography variant="body" align="center" style={{ maxWidth: 350 }}>
          {t("welcome.description")}
        </Typography>
      </View>
      <Button
        fullWidth
        onPress={handleGetStarted}
        style={{
          marginBottom: theme.layout.spacing.lg,
        }}
      >
        {t("welcome.get_started")}
      </Button>
    </SafeView>
  );
};
