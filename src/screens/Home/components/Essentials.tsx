import { MedsCard, SleepManager } from "@/components";
import { useTheme } from "@/providers";
import { useAppSelector } from "@/store/hooks";
import { Dayjs } from "dayjs";
import { View } from "react-native";

interface EssentialsProps {
  date: Dayjs;
}

export const Essentials = ({ date }: EssentialsProps) => {
  const { theme } = useTheme();
  const showMedications = useAppSelector(
    (state) => state.settings.showMedications,
  );

  return (
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
  );
};
