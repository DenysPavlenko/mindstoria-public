import { TTimePeriod } from "@/types";
import { useTranslation } from "react-i18next";
import { Button } from "../Button/Button";

interface PeriodSelectorProps {
  period: TTimePeriod;
  onPress: (nextPeriod: TTimePeriod) => void;
}

const PERIOD_LABELS: Record<TTimePeriod, string> = {
  week: "common.weekly",
  month: "common.monthly",
  year: "common.yearly",
};

const PERIOD_CYCLE: TTimePeriod[] = ["week", "month", "year"];

export const PeriodSelector = ({ period, onPress }: PeriodSelectorProps) => {
  const { t } = useTranslation();

  const handlePress = () => {
    const currentIndex = PERIOD_CYCLE.indexOf(period);
    const nextPeriod =
      PERIOD_CYCLE[(currentIndex + 1) % PERIOD_CYCLE.length] || "week";
    onPress(nextPeriod);
  };

  return (
    <Button
      color="secondaryContainer"
      textColor="onSecondaryContainer"
      onPress={handlePress}
      size="md"
    >
      {t(PERIOD_LABELS[period])}
    </Button>
  );
};
