import { useTheme } from "@/providers";
import { TTheme } from "@/theme";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { ReactNode, useMemo } from "react";
import { useTranslation } from "react-i18next";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { Card } from "../Card/Card";
import { IconBox } from "../IconBox/IconBox";
import { Placeholder } from "../Placeholder/Placeholder";

interface ChartCardProps {
  info: ReactNode;
  chart: ReactNode;
  iconName?: FeatherIconName;
  customIcon?: ReactNode;
  hasData: boolean;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
}

export const ChartCard = ({
  info,
  chart,
  iconName,
  customIcon,
  hasData,
  style,
  onPress,
}: ChartCardProps) => {
  const { theme } = useTheme();
  const { t } = useTranslation();

  const styles = useMemo(() => createStyles(theme), [theme]);

  const renderPlaceholder = () => {
    return (
      <View style={styles.placeholder}>
        <Placeholder hideIcon content={t("common.not_enough_data")} />
      </View>
    );
  };

  const renderChart = () => {
    if (!hasData) {
      return renderPlaceholder();
    }
    return <View style={styles.chart}>{chart}</View>;
  };

  return (
    <Card style={[styles.container, style]} onPress={onPress}>
      <View style={styles.info}>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            gap: theme.layout.spacing.md,
          }}
        >
          <IconBox
            color="surface"
            iconColor="onSurface"
            icon={iconName}
            customIcon={customIcon}
          />
          <View style={{ flex: 1 }}>{info}</View>
        </View>
      </View>
      {renderChart()}
    </Card>
  );
};

const createStyles = (theme: TTheme) => {
  return StyleSheet.create({
    container: {
      alignItems: "center",
      overflow: "hidden",
    },
    iconContainer: {
      borderRadius: theme.layout.borderRadius.lg,
      justifyContent: "center",
      alignItems: "center",
    },
    placeholder: {
      marginHorizontal: "auto",
      justifyContent: "center",
      alignItems: "center",
      paddingBottom: theme.layout.spacing.xxl,
    },
    info: {
      width: "100%",
      paddingBottom: theme.layout.spacing.md,
    },
    chart: {
      width: "100%",
    },
  });
};
