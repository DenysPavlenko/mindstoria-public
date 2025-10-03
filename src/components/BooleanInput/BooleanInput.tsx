import { TTheme, useTheme } from "@/theme";
import { useTranslation } from "react-i18next";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Toggle from "react-native-toggle-element";
import { Typography } from "../Typography/Typography";

interface BooleanInputProps {
  value: boolean | undefined;
  onChange: (value?: boolean) => void;
  style?: StyleProp<ViewStyle>;
}

const TRACKBAR_WIDTH = 200;

export const BooleanInput = ({ value, onChange, style }: BooleanInputProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const styles = createStyles(theme);

  const renderPlaceholder = () => {
    return (
      <View style={styles.placeholder}>
        <Pressable
          style={styles.placeholderButton}
          onPress={() => onChange(false)}
        >
          <Typography color="onPrimaryContainer" variant="small" align="center">
            {t("common.no")}
          </Typography>
        </Pressable>
        <Pressable
          style={styles.placeholderButton}
          onPress={() => onChange(true)}
        >
          <Typography color="onPrimaryContainer" variant="small" align="center">
            {t("common.yes")}
          </Typography>
        </Pressable>
      </View>
    );
  };

  const renderToggle = () => {
    if (value === undefined) {
      return renderPlaceholder();
    }
    return (
      <Toggle
        value={value}
        onPress={(newState) => onChange(newState)}
        leftTitle="No"
        rightTitle="Yes"
        containerStyle={styles.container}
        trackBar={{
          width: TRACKBAR_WIDTH,
          height: theme.layout.size.lg,
          radius: theme.layout.borderRadius.xxl,
        }}
        trackBarStyle={styles.trackBarStyle}
        thumbButton={{
          width: theme.layout.size.xl,
          height: theme.layout.size.xl,
          radius: theme.layout.size.xl / 2,
        }}
        thumbStyle={styles.thumbStyle}
        leftComponent={
          <Typography
            color={value ? "onPrimaryContainer" : "onPrimary"}
            variant="small"
          >
            {t("common.no")}
          </Typography>
        }
        rightComponent={
          <Typography
            color={value ? "onPrimary" : "onPrimaryContainer"}
            variant="small"
          >
            {t("common.yes")}
          </Typography>
        }
      />
    );
  };

  return <View style={style}>{renderToggle()}</View>;
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      height: theme.layout.size.xl,
    },
    trackBarStyle: {
      backgroundColor: theme.colors.primaryContainer,
      zIndex: -1,
    },
    thumbStyle: {
      backgroundColor: theme.colors.primary,
    },
    placeholder: {
      width: TRACKBAR_WIDTH,
      height: theme.layout.size.lg,
      borderRadius: theme.layout.borderRadius.xxl,
      flexDirection: "row",
      backgroundColor: theme.colors.primaryContainer,
      alignItems: "center",
      justifyContent: "space-between",
    },
    placeholderButton: {
      width: theme.layout.size.xl,
      height: theme.layout.size.xl,
      alignItems: "center",
      justifyContent: "center",
      borderRadius: theme.layout.size.xl / 2,
    },
  });

export default BooleanInput;
