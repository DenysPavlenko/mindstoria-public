import { ANALYTICS_EVENTS } from "@/analytics-constants";
import {
  Button,
  ConfirmationDialog,
  Header,
  IconButton,
  Pill,
  SafeView,
  StepIndicator,
  TimePickerModal,
} from "@/components";
import { useAndroidBackHandler, useKeyboard } from "@/hooks";
import { useTheme } from "@/providers";
import { useAppDispatch, useAppSelector } from "@/store";
import { addLogThunk, selectCBTLogs, updateLogThunk } from "@/store/slices";
import { TTheme } from "@/theme";
import { TLogMetric, TLogValue, TLogValues } from "@/types";
import { generateUniqueId, isStringEmpty, trackEvent } from "@/utils";
import { useIsFocused } from "@react-navigation/native";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { CBTConnect } from "./components/CBTConnect";
import { MetricInput, TLogFormValues } from "./components/MetricInput";

interface LogManagerProps {
  date?: string;
  logId?: string;
  metricId?: string;
}

export const LogManager = ({ date, logId, metricId }: LogManagerProps) => {
  const router = useRouter();
  const isFocused = useIsFocused();
  const dispatch = useAppDispatch();
  const { keyboardHeight } = useKeyboard();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const pageViewRef = useRef<PagerView>(null);
  const [values, setValues] = useState<TLogFormValues>({
    wellbeing: null,
    impacts: [],
    emotions: [],
    notes: null,
  });
  const logs = useAppSelector((state) => state.logs.items);
  const cbtLogs = useAppSelector(selectCBTLogs);
  const metrics = useAppSelector((state) => state.logMetrics.items);
  const [currentPage, setCurrentPage] = useState(0);
  const [currentStep, setCurrentStep] = useState(0);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [timestamp, setTimestamp] = useState(date || dayjs().toISOString());
  const [showCBTConnect, setShowCBTConnect] = useState(false);
  const [savedLogId, setSavedLogId] = useState<string | null>(null);

  const currentLog = useMemo(() => {
    return logs[logId || ""] || null;
  }, [logs, logId]);

  const connectedCBTLogId = useMemo(() => {
    if (!logId) return null;
    return cbtLogs.find((log) => log.wellbeingLogId === logId)?.id || null;
  }, [cbtLogs, logId]);

  // Create theme-aware styles (memoized for performance)
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isEditing = Boolean(logId);

  useEffect(() => {
    if (currentLog) {
      setValues(currentLog.values);
      setTimestamp(currentLog.timestamp);
    }
  }, [currentLog]);

  useEffect(() => {
    if (metricId) {
      const index = metrics.findIndex((metric) => metric.id === metricId);
      setCurrentPage(index);
      setCurrentStep(index);
    }
  }, [metricId, metrics]);

  const initialTime = useMemo(() => {
    const d = dayjs(timestamp);
    const hours = d.hour();
    const minutes = d.minute();
    return { hours, minutes };
  }, [timestamp]);

  const formattedTime = useMemo(() => {
    return dayjs(timestamp).format("HH:mm");
  }, [timestamp]);

  const isFirstPage = currentPage === 0;
  const isLastPage = currentPage === metrics.length - 1;

  const isValid = useMemo(() => {
    const mandatoryMetrics = metrics.filter((metric) => metric.isMandatory);
    const valuesToCheck = mandatoryMetrics.map((metric) => values[metric.type]);
    return valuesToCheck.every((value) => value !== null);
  }, [values, metrics]);

  const handleValueChange = useCallback(
    (metric: TLogMetric, value: TLogValue) => {
      setValues((prevValues) => ({
        ...prevValues,
        [metric.id]: value,
      }));
    },
    [],
  );

  const saveLog = () => {
    if (!isValid || values.wellbeing === null) return;
    const logValues: TLogValues = {
      ...values,
      wellbeing: values.wellbeing,
      notes: values.notes?.trim() || null,
    };
    const logId = currentLog?.id || generateUniqueId();
    setSavedLogId(logId);
    if (currentLog) {
      dispatch(
        updateLogThunk({
          ...currentLog,
          values: logValues,
          timestamp,
        }),
      );
    } else {
      dispatch(
        addLogThunk({
          id: logId,
          values: logValues,
          timestamp,
        }),
      );
    }
    trackEvent(ANALYTICS_EVENTS.MOOD_LOG_COMPLETED, {
      mode: isEditing ? "edit" : "create",
      moodLogged: true,
      impactsLogged: logValues.impacts.length > 0,
      emotionsLogged: logValues.emotions.length > 0,
      notesLogged: !isStringEmpty(logValues.notes),
    });
  };

  const handleSave = () => {
    saveLog();
    // If we're on the last page, show CBT connect screen
    if (isLastPage) {
      setShowCBTConnect(true);
    } else {
      router.back();
    }
  };

  const handleExit = useCallback(() => {
    if (isValid) {
      setShowExitConfirmation(true);
    } else {
      trackEvent(ANALYTICS_EVENTS.MOOD_LOG_CANCELLED, {
        mode: isEditing ? "edit" : "create",
      });
      router.back();
    }
  }, [isValid, router, isEditing]);

  useAndroidBackHandler(() => {
    if (isFocused) {
      handleExit();
      return true;
    }
  });

  const handleTimeConfirm = (hours: number, minutes: number) => {
    setShowTimePicker(false);
    const newTime = dayjs(timestamp).hour(hours).minute(minutes).toISOString();
    setTimestamp(newTime);
  };

  const handlePrev = () => {
    if (isFirstPage) {
      router.back();
      return;
    }
    pageViewRef.current?.setPage(currentPage - 1);
  };

  const handleNext = () => {
    if (isLastPage) {
      handleSave();
      return;
    }
    pageViewRef.current?.setPage(currentPage + 1);
  };

  const handleCBTConnectClose = () => {
    setShowCBTConnect(false);
    router.back();
  };

  const handleStepPress = (step: number) => {
    const targetPage = step - 1; // Convert to 0-based index
    pageViewRef.current?.setPage(targetPage);
  };

  const handleConnectThoughtJournal = () => {
    router.navigate({
      pathname: "/cbt-log-manager",
      params: {
        date: timestamp,
        wellbeingLogId: savedLogId,
        logId: connectedCBTLogId,
      },
    });
    trackEvent(ANALYTICS_EVENTS.CBT_LOG_STARTED, {
      mode: "create",
      source: "mood_log",
    });
  };

  const renderMetric = (metric: TLogMetric, index: number) => {
    const isActive = index === currentPage;
    return (
      <View
        style={styles.metricInputContainer}
        pointerEvents="box-only"
        key={metric.id}
      >
        <MetricInput
          metric={metric}
          values={values}
          isEditing={isEditing}
          onChange={handleValueChange}
          isActive={isActive}
          onNext={handleNext}
        />
      </View>
    );
  };

  const renderHeader = () => {
    return (
      <Header
        onBack={handleExit}
        preventBackNavigation
        centerContent={
          <StepIndicator
            currentStep={currentStep + 1}
            totalSteps={metrics.length}
            onStepPress={handleStepPress}
          />
        }
        rightContent={
          <Pill label={formattedTime} onPress={() => setShowTimePicker(true)} />
        }
      />
    );
  };

  const renderTimePicker = () => {
    return (
      <TimePickerModal
        visible={showTimePicker}
        onClose={() => {
          setShowTimePicker(false);
        }}
        onConfirm={handleTimeConfirm}
        hours={initialTime.hours}
        minutes={initialTime.minutes}
      />
    );
  };

  const renderExitConfirmation = () => {
    return (
      <ConfirmationDialog
        visible={showExitConfirmation}
        title={t("common.ready_to_finish")}
        content={t("common.your_data_will_be_saved")}
        actionText={t("common.confirm")}
        actionProps={{
          buttonColor: "primary",
          textColor: "onPrimary",
        }}
        onClose={() => setShowExitConfirmation(false)}
        onConfirm={handleSave}
      />
    );
  };

  const renderButtons = () => {
    return (
      <View style={[styles.buttons]}>
        <IconButton
          icon="chevron-left"
          disabled={isFirstPage}
          onPress={handlePrev}
          size="lg"
        />
        <View style={{ minWidth: 140 }}>
          <Button disabled={!isValid} onPress={handleSave} fullWidth>
            {t("common.save")}
          </Button>
        </View>
        <IconButton
          icon={isLastPage ? "check" : "chevron-right"}
          disabled={isLastPage && !isValid}
          onPress={handleNext}
          size="lg"
        />
      </View>
    );
  };

  const renderMainContent = () => {
    const currentMetric = metrics[currentPage];
    const shouldAddKeyboardPadding = currentMetric?.type === "notes";
    return (
      <SafeView>
        {renderHeader()}
        <View
          style={[
            styles.container,
            { paddingBottom: shouldAddKeyboardPadding ? keyboardHeight : 0 },
          ]}
        >
          <PagerView
            ref={pageViewRef}
            style={styles.pageView}
            initialPage={currentPage}
            keyboardDismissMode="none"
            onPageSelected={(e) => {
              const newPage = e.nativeEvent.position;
              setCurrentPage(newPage);
            }}
            onPageScroll={(e) => {
              const { position, offset } = e.nativeEvent;
              // Round up if more than halfway to the next page
              const virtualStep = offset >= 0.5 ? position + 1 : position;
              // Update only if different from currentStep
              if (virtualStep !== currentStep) {
                setCurrentStep(virtualStep);
              }
            }}
            overdrag
          >
            {metrics.map(renderMetric)}
          </PagerView>
          {renderButtons()}
        </View>
        {renderTimePicker()}
        {renderExitConfirmation()}
      </SafeView>
    );
  };

  const renderCBTConnect = () => {
    return (
      <CBTConnect
        onClose={handleCBTConnectClose}
        onConnectThoughtJournal={handleConnectThoughtJournal}
        hasConnectedLog={Boolean(connectedCBTLogId)}
      />
    );
  };

  return showCBTConnect ? renderCBTConnect() : renderMainContent();
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "space-between",
      marginTop: theme.layout.spacing.lg,
    },
    pageView: {
      flex: 1,
    },
    metricInputContainer: {
      flex: 1,
      justifyContent: "flex-end",
    },
    buttons: {
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.layout.spacing.lg,
    },
  });
