import {
  ConfirmationDialog,
  Header,
  IconButton,
  Pill,
  SafeView,
  StepIndicator,
  TimePickerModal,
} from "@/components";
import { CBT_LOG_METRICS } from "@/data";
import { useAndroidBackHandler, useKeyboard } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import { addCBTLogThunk, updateCBTLogThunk } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TCBTLogMetric, TCBTLogValue, TCBTLogValues } from "@/types";
import { generateUniqueId } from "@/utils";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { InfoModal } from "./components/InfoModal";
import { MetricInput, TCBTLogFormValues } from "./components/MetricInput";

interface CBTLogManagerProps {
  date?: string;
  logId?: string;
  metricId?: string;
  wellbeingLogId?: string;
}

const NOW = dayjs().toISOString();

export const CBTLogManager = ({
  date,
  logId,
  metricId,
  wellbeingLogId,
}: CBTLogManagerProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { theme } = useTheme();
  const { t } = useTranslation();
  const { keyboardHeight } = useKeyboard();
  const pageViewRef = useRef<PagerView>(null);
  const [values, setValues] = useState<TCBTLogFormValues>({
    situation: null,
    thought: null,
    behavior: null,
    emotions: [],
    cognitiveDistortions: [],
    alternativeThought: null,
  });
  const logs = useAppSelector((state) => state.cbtLogs.items);
  const wellbeingLogs = useAppSelector((state) => state.logs.items);
  const metrics = CBT_LOG_METRICS;
  const [currenPage, setCurrenPage] = useState(0);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [timestamp, setTimestamp] = useState(date || NOW);
  const [showInfoModal, setShowInfoModal] = useState(false);

  const currentLog = useMemo(() => {
    return logs[logId || ""] || null;
  }, [logs, logId]);

  const connectedWellbeingLog = useMemo(() => {
    if (!wellbeingLogId) return null;
    return wellbeingLogs[wellbeingLogId] || null;
  }, [wellbeingLogs, wellbeingLogId]);

  useEffect(() => {
    if (connectedWellbeingLog) {
      setTimestamp(connectedWellbeingLog.timestamp);
      setValues((prevValues) => ({
        ...prevValues,
        emotions: connectedWellbeingLog.values.emotions || [],
      }));
    }
  }, [connectedWellbeingLog]);

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
      setCurrenPage(index);
    }
  }, [metricId, metrics]);

  const initialTime = useMemo(() => {
    const d = dayjs(timestamp);
    const hours = d.hour();
    const minutes = d.minute();
    const seconds = d.second();
    return { hours, minutes, seconds };
  }, [timestamp]);

  const formattedTime = useMemo(() => {
    return dayjs(timestamp).format("HH:mm");
  }, [timestamp]);

  const isFirstPage = currenPage === 0;
  const isLastPage = currenPage === metrics.length - 1;

  const isValid = useMemo(() => {
    const mandatoryMetrics = metrics.filter((metric) => metric.isMandatory);
    const valuesToCheck = mandatoryMetrics.map((metric) => values[metric.type]);
    return valuesToCheck.every((value) => {
      if (typeof value === "string") {
        return value.trim() !== "";
      }
      if (Array.isArray(value)) {
        return value.length > 0;
      }
      return value;
    });
  }, [values, metrics]);

  const handleValueChange = useCallback(
    (metric: TCBTLogMetric, value: TCBTLogValue) => {
      setValues((prevValues) => ({
        ...prevValues,
        [metric.id]: value,
      }));
    },
    []
  );

  const handleSave = () => {
    if (!isValid || values.situation === null) return;
    const logValues: TCBTLogValues = {
      ...values,
      situation: values.situation,
    };
    if (currentLog) {
      dispatch(
        updateCBTLogThunk({
          ...currentLog,
          values: logValues,
          timestamp,
        })
      );
    } else {
      dispatch(
        addCBTLogThunk({
          id: generateUniqueId(),
          values: logValues,
          timestamp,
          wellbeingLogId,
        })
      );
    }
    router.back();
  };

  const handleExit = useCallback(() => {
    if (isValid) {
      setShowExitConfirmation(true);
    } else {
      setShowExitConfirmation(false);
      router.back();
    }
  }, [isValid, router]);

  useAndroidBackHandler(() => {
    handleExit();
    return true;
  });

  const handleTimeConfirm = (
    hours: number,
    minutes: number,
    seconds: number
  ) => {
    setShowTimePicker(false);
    const newTime = dayjs(timestamp)
      .hour(hours)
      .minute(minutes)
      .second(seconds)
      .toISOString();
    setTimestamp(newTime);
  };

  const handlePrev = () => {
    if (isFirstPage) {
      router.back();
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

  const renderMetric = (metric: TCBTLogMetric, index: number) => {
    const isActive = index === currenPage;
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
          isActive={isActive}
          onChange={handleValueChange}
        />
      </View>
    );
  };

  const handleStepPress = (step: number) => {
    const targetPage = step - 1; // Convert to 0-based index
    pageViewRef.current?.setPage(targetPage);
  };

  const renderHeader = () => {
    return (
      <Header
        onBack={handleExit}
        preventBackNavigation
        centerContent={
          <StepIndicator
            currentStep={currenPage + 1}
            totalSteps={metrics.length}
            onStepPress={handleStepPress}
          />
        }
        rightContent={
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              gap: theme.layout.spacing.sm,
            }}
          >
            <Pill
              label={formattedTime}
              onPress={() => setShowTimePicker(true)}
            />
            <IconButton
              size="sm"
              icon="info"
              onPress={() => setShowInfoModal(true)}
            />
          </View>
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
        seconds={initialTime.seconds}
      />
    );
  };

  const renderInfoModal = () => {
    const metricType = metrics[currenPage]?.type;
    if (!metricType) return null;
    return (
      <InfoModal
        visible={showInfoModal}
        onClose={() => setShowInfoModal(false)}
        metricType={metricType}
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
      <View style={styles.buttons}>
        <IconButton
          icon="chevron-left"
          disabled={isFirstPage}
          onPress={handlePrev}
          variant="text"
          size="xl"
        />
        <View>
          <IconButton icon="save" disabled={!isValid} onPress={handleSave} />
        </View>
        <IconButton
          icon={isLastPage ? "check" : "chevron-right"}
          disabled={isLastPage && !isValid}
          onPress={handleNext}
          variant="text"
          size="xl"
        />
      </View>
    );
  };

  const currentMetric = metrics[currenPage];
  const shouldAddKeyboardPadding = currentMetric?.type !== "emotions";

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
          initialPage={currenPage}
          keyboardDismissMode="none"
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
        {renderButtons()}
      </View>
      {renderTimePicker()}
      {renderInfoModal()}
      {renderExitConfirmation()}
    </SafeView>
  );
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
