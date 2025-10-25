import {
  IconBox,
  MedsCard,
  Menu,
  SleepManager,
  Typography,
} from "@/components";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { toggleShowMedications } from "@/store/slices";
import { useTheme } from "@/theme";
import { Dayjs } from "dayjs";
import { useTranslation } from "react-i18next";
import { View } from "react-native";

interface EssentialsProps {
  date: Dayjs;
}

export const Essentials = ({ date }: EssentialsProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();
  const dispatch = useAppDispatch();
  const { showMedications } = useAppSelector((state) => state.settings);

  const toggleShowMeds = () => {
    dispatch(toggleShowMedications());
  };

  return (
    <View>
      <View
        style={{
          marginBottom: theme.layout.spacing.sm,
          paddingHorizontal: theme.layout.spacing.lg,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4">{t("common.daily_essentials")}</Typography>
        <Menu
          trigger={<IconBox icon="settings" size="sm" />}
          topOffset={theme.layout.size.sm + theme.layout.spacing.xs}
          options={[
            {
              label: showMedications
                ? t("medications.hide_meds")
                : t("medications.show_meds"),
              onSelect: toggleShowMeds,
            },
          ]}
        />
      </View>
      <View
        style={{
          flexDirection: "row",
          gap: theme.layout.spacing.sm,
          paddingHorizontal: theme.layout.spacing.lg,
          alignItems: "stretch",
        }}
      >
        <SleepManager date={date} fullMode={!showMedications} />
        {showMedications && <MedsCard date={date} />}
      </View>
    </View>
  );
};
