import {
  Button,
  ConfirmationDialog,
  DismissKeyboardView,
  HeaderIconWrapper,
  IconButton,
  KeyboardAwareView,
  ProgressBar,
  SafeView,
  Typography,
} from "@/components";
import { useAndroidBackHandler } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  createEntryThunk,
  selectEntryById,
  selectMetricsByTrackerId,
  updateEntryThunk,
} from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import {
  TEntryValue,
  TEntryValues,
  TrackerMetricType,
  TTrackerMetric,
} from "@/types";
import { getDisplayValue, isIOS26OrLater } from "@/utils";
import { useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { EntryNavigation } from "./components/EntryNavigation";
import { MetricInput } from "./components/MetricInput";

interface EntryProps {
  trackerId: string;
  date?: string;
  entryId?: string;
  page?: number;
}

export const Entry = ({ trackerId, date, entryId, page }: EntryProps) => {
  const { t } = useTranslation();
  const navigation = useNavigation();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const [currenPage, setCurrenPage] = useState(page || 0);
  const metrics = useAppSelector((state) =>
    selectMetricsByTrackerId(state, trackerId)
  );
  const selectedEntry = useAppSelector((state) => {
    return selectEntryById(state, trackerId, entryId || "");
  });
  const [values, setValues] = useState<TEntryValues>(
    selectedEntry?.values || {}
  );
  const [showNavigation, setShowNavigation] = useState(false);
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const pageViewRef = useRef<PagerView>(null);

  const initialPage = page ?? 0;

  // Create theme-aware styles (memoized for performance)
  const styles = useMemo(() => createStyles(theme), [theme]);

  useLayoutEffect(() => {
    navigation.setOptions({
      title: "",
    });
  }, [navigation]);

  const isFirstPage = currenPage === 0;
  const isLastPage = currenPage === metrics.length - 1;

  useAndroidBackHandler(() => {
    // Check for unsaved changes before allowing to go back
    const hasUnsavedChanges = () => {
      if (!selectedEntry) {
        return Object.values(values).some(
          (value) => value !== null && value !== ""
        );
      }
      return Object.keys(values).some(
        (key) => values[key] !== selectedEntry?.values[key]
      );
    };
    if (!hasUnsavedChanges()) {
      return false;
    }
    setShowExitConfirm(true);
    return true;
  });

  const handleValueChange = (metric: TTrackerMetric, newValue: TEntryValue) => {
    let value = newValue;
    if (metric.type === TrackerMetricType.Number && newValue === "") {
      value = null;
    }
    setValues((prevValues) => ({
      ...prevValues,
      [metric.id]: value,
    }));
  };

  const handleSave = useCallback(() => {
    if (selectedEntry) {
      const isChanged = Object.keys(values).some(
        (key) => values[key] !== selectedEntry?.values[key]
      );
      if (isChanged) {
        dispatch(
          updateEntryThunk({ trackerId, entryId: selectedEntry.id, values })
        );
      }
    } else {
      dispatch(createEntryThunk({ trackerId, values, date }));
    }
    navigation.goBack();
  }, [navigation, selectedEntry, values, trackerId, date, dispatch]);

  const renderHeaderRightButton = useCallback(() => {
    if (isIOS26OrLater) {
      return (
        <HeaderIconWrapper>
          <IconButton
            icon="save"
            size="lg"
            variant="text"
            onPress={handleSave}
            autoSize
          />
        </HeaderIconWrapper>
      );
    }
    return <Button onPress={handleSave}>{t("common.save")}</Button>;
  }, [handleSave, t]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerRight: renderHeaderRightButton,
    });
  }, [navigation, renderHeaderRightButton]);

  const toggleNavigation = () => {
    setShowNavigation((prev) => !prev);
  };

  const handleNavItemPress = (index: number) => {
    toggleNavigation();
    pageViewRef.current?.setPageWithoutAnimation(index);
    setCurrenPage(index);
  };

  const handlePrev = () => {
    if (isFirstPage) {
      navigation.goBack();
      return;
    }
    pageViewRef.current?.setPage(currenPage - 1);
  };

  const handleNext = () => {
    if (isLastPage) {
      handleSave();
      return;
    }
    pageViewRef.current?.setPage(currenPage + 1);
  };

  const renderMetricHeader = (metric: TTrackerMetric, value: TEntryValue) => {
    const showValue = metric.type !== TrackerMetricType.Notes;
    const displayValue = showValue ? getDisplayValue(value, metric, t) : null;
    return (
      <View style={styles.metricHeader}>
        <Typography variant="h4" style={styles.metricHeaderLabel}>
          {metric.label}
        </Typography>
        {displayValue && (
          <Typography
            variant="h2"
            style={styles.metricHeaderValue}
            color="primary"
            align="right"
          >
            {displayValue}
          </Typography>
        )}
      </View>
    );
  };

  const renderMetric = (metric: TTrackerMetric) => {
    const value = values[metric.id] ?? null;
    const skipDismiss =
      metric.type !== TrackerMetricType.Notes &&
      metric.type !== TrackerMetricType.Number;
    return (
      <View style={styles.metric} key={metric.id}>
        <DismissKeyboardView skip={skipDismiss}>
          {renderMetricHeader(metric, value)}
        </DismissKeyboardView>
        <View style={styles.metricInputContainer} pointerEvents="box-only">
          <MetricInput
            metric={metric}
            value={value}
            onChange={(val) => handleValueChange(metric, val)}
          />
        </View>
      </View>
    );
  };

  const renderExitConfirmationDialog = () => {
    return (
      <ConfirmationDialog
        visible={showExitConfirm}
        title={t("common.unsaved_changes")}
        content={t("common.unsaved_changes_confirmation")}
        onClose={() => setShowExitConfirm(false)}
        onConfirm={() => {
          setShowExitConfirm(false);
          navigation.goBack();
        }}
        actionText={t("common.leave")}
      />
    );
  };

  // Custom progress bar
  const progress = (currenPage + 1) / metrics.length;

  return (
    <SafeView direction="bottom">
      <KeyboardAwareView>
        <View style={styles.container}>
          <View style={styles.progressBar}>
            <ProgressBar progress={progress} />
          </View>
          <PagerView
            ref={pageViewRef}
            style={styles.pageView}
            initialPage={initialPage}
            onPageScroll={(e) => {
              const { position, offset } = e.nativeEvent;
              // Round up if more than halfway to the next page
              const virtualStep = offset >= 0.4 ? position + 1 : position;
              // Update only if different from current
              if (virtualStep !== currenPage) {
                setCurrenPage(virtualStep);
              }
            }}
            overdrag
          >
            {metrics.map(renderMetric)}
          </PagerView>
          <View style={styles.buttonRow}>
            <View style={styles.button}>
              <IconButton
                icon={isFirstPage ? "x" : "chevron-left"}
                onPress={handlePrev}
                variant="text"
              />
            </View>
            <IconButton icon="menu" onPress={toggleNavigation} />
            <View style={[styles.button, styles.buttonLast]}>
              <IconButton
                icon={isLastPage ? "check" : "chevron-right"}
                onPress={handleNext}
                variant="text"
              />
            </View>
          </View>
        </View>
      </KeyboardAwareView>
      {showNavigation && (
        <EntryNavigation
          visible={showNavigation}
          onClose={toggleNavigation}
          onItemPress={handleNavItemPress}
          metrics={metrics}
          values={values}
          activeIndex={currenPage}
        />
      )}
      {renderExitConfirmationDialog()}
    </SafeView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
    },
    progressBar: {
      padding: theme.layout.spacing.lg,
      marginBottom: theme.layout.spacing.lg,
    },
    pageView: {
      flex: 1,
    },
    metric: {
      paddingHorizontal: theme.layout.spacing.lg,
      paddingBottom: theme.layout.spacing.xl,
    },
    metricHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
    },
    metricInputContainer: {
      flex: 1,
      marginTop: theme.layout.spacing.lg,
      justifyContent: "flex-end",
    },
    metricHeaderLabel: {
      flex: 1,
      maxWidth: "55%",
      paddingRight: theme.layout.spacing.md,
    },
    metricHeaderValue: {
      flex: 1,
      maxWidth: "45%",
    },
    buttonRow: {
      flexDirection: "row",
      justifyContent: "space-between",
      marginBottom: theme.layout.spacing.lg,
      paddingHorizontal: theme.layout.spacing.lg,
    },
    button: {
      flex: 1,
      alignItems: "flex-start",
    },
    buttonLast: {
      alignItems: "flex-end",
    },
  });

export default Entry;
