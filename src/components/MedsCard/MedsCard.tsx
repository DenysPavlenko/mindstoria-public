import Pills from "@/assets/icons/pills.svg";
import { useAppSelector } from "@/store";
import { selectMedLogsMapByDate } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { getGroupedTakenMedications } from "@/utils";
import { CALENDAR_DATE_FORMAT } from "@/utils/dateConstants";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import dayjs, { Dayjs } from "dayjs";
import { useRouter } from "expo-router";
import { useMemo } from "react";
import { useTranslation } from "react-i18next";
import { ScrollView, StyleSheet, View } from "react-native";
import { Chip } from "../Chip/Chip";
import { INFO_CARD_HEIGHT, InfoCard } from "../InfoCard/InfoCard";

interface MedsCardProps {
  date: Dayjs;
}

export const MedsCard = ({ date }: MedsCardProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const router = useRouter();
  const medications = useAppSelector((state) => state.medications.items);
  const medLogsMapByDate = useAppSelector(selectMedLogsMapByDate);

  const todayLogs = useMemo(() => {
    const formattedDate = dayjs(date).format(CALENDAR_DATE_FORMAT);
    return medLogsMapByDate[formattedDate] || {};
  }, [date, medLogsMapByDate]);

  const data = useMemo(() => {
    const medLogsArray = Object.values(todayLogs).flat();
    return getGroupedTakenMedications(medLogsArray, medications);
  }, [todayLogs, medications]);

  const styles = useMemo(() => createStyles(theme), [theme]);

  const hasData = data.length > 0;

  const handlePress = () => {
    router.navigate({
      pathname: "/med-logs",
      params: { date: date.toISOString() },
    });
  };

  const renderLogs = () => {
    if (!hasData) return null;
    return (
      <View style={styles.logsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={styles.chipsContainer}>
            {data.map((med, index) => {
              const { name, units, dosage } = med;
              const label = `${name} ${dosage}${units}`;
              let icon: FeatherIconName | undefined = undefined;
              if (med.isArchived) {
                icon = "archive";
              } else if (!med.isActive) {
                icon = "eye-off";
              }
              return (
                <Chip
                  minHeight="xs"
                  icon={icon}
                  key={index}
                  label={label}
                  bgColor="surface"
                />
              );
            })}
          </View>
        </ScrollView>
      </View>
    );
  };

  const iconColor = hasData
    ? theme.colors.outline
    : theme.colors.outlineVariant;
  const iconSize = INFO_CARD_HEIGHT - theme.layout.spacing.lg * 2;

  return (
    <InfoCard
      title={t("medications.title")}
      onPress={handlePress}
      icon={
        <View style={{ position: "absolute", right: -20, top: -20 }}>
          <Pills width={iconSize} height={iconSize} fill={iconColor} />
        </View>
      }
    >
      {renderLogs()}
    </InfoCard>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    logsContainer: {
      marginLeft: -theme.layout.spacing.lg,
      marginRight: -theme.layout.spacing.lg,
      marginTop: theme.layout.spacing.xs,
    },
    chipsContainer: {
      flexDirection: "row",
      gap: theme.layout.spacing.xs,
      paddingHorizontal: theme.layout.spacing.lg,
    },
  });
