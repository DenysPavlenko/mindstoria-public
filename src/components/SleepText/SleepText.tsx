import { useTheme } from "@/providers";
import { getRatingLevelLabel } from "@/utils";
import { useTranslation } from "react-i18next";
import { View } from "react-native";
import { Typography } from "../Typography/Typography";

export const SleepText = ({
  sleepQuality,
  center = true,
}: {
  sleepQuality: number | null;
  center?: boolean;
}) => {
  const { t } = useTranslation();
  const { theme } = useTheme();

  const title =
    sleepQuality === null
      ? t("sleep.how_well_did_you_sleep")
      : t("sleep.my_sleep_was");
  const subtitle =
    sleepQuality === null
      ? `${t("sleep.sleep")}?`
      : getRatingLevelLabel(sleepQuality, t);
  return (
    <View>
      <Typography
        variant="h3"
        align={center ? "center" : "left"}
        color="outline"
        fontWeight="regular"
      >
        {title}
      </Typography>
      <Typography
        variant="h1"
        align={center ? "center" : "left"}
        style={{ marginBottom: theme.layout.spacing.xl }}
      >
        {subtitle}
      </Typography>
    </View>
  );
};
