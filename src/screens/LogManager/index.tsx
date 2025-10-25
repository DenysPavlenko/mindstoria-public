import {
  ConfirmationDialog,
  Header,
  IconButton,
  Pill,
  ProgressBar,
  SafeView,
  TimePickerModal,
} from "@/components";
import { useAndroidBackHandler } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import { addLogThunk, updateLogThunk } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TLogMetric, TLogValue, TLogValues } from "@/types";
import { generateUniqueId } from "@/utils";
import dayjs from "dayjs";
import { useRouter } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, View } from "react-native";
import PagerView from "react-native-pager-view";
import { MetricInput, TLogFormValues } from "./components/MetricInput";

interface LogManagerProps {
  date?: string;
  logId?: string;
  metricId?: string;
}

const NOW = dayjs().toISOString();

export const LogManager = ({ date, logId, metricId }: LogManagerProps) => {
  const router = useRouter();
  const dispatch = useAppDispatch();
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
  const metrics = useAppSelector((state) => state.logMetrics.items);
  const [currenPage, setCurrenPage] = useState(0);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);
  const [timestamp, setTimestamp] = useState(date || NOW);

  const currentLog = useMemo(() => {
    return logs[logId || ""] || null;
  }, [logs, logId]);

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
    return valuesToCheck.every((value) => value !== null);
  }, [values, metrics]);

  const handleValueChange = useCallback(
    (metric: TLogMetric, value: TLogValue) => {
      setValues((prevValues) => ({
        ...prevValues,
        [metric.id]: value,
      }));
    },
    []
  );

  const handleSave = () => {
    if (!isValid || values.wellbeing === null) return;
    const logValues: TLogValues = {
      ...values,
      wellbeing: values.wellbeing,
    };
    if (currentLog) {
      dispatch(
        updateLogThunk({
          ...currentLog,
          values: logValues,
          timestamp,
        })
      );
    } else {
      dispatch(
        addLogThunk({
          id: generateUniqueId(),
          values: logValues,
          timestamp,
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

  const renderMetric = (metric: TLogMetric) => {
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
        />
      </View>
    );
  };

  // Custom progress bar
  const progress = (currenPage + 1) / metrics.length;

  const renderHeader = () => {
    return (
      <Header
        onBack={handleExit}
        preventBackNavigation
        centerContent={<ProgressBar progress={progress} />}
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
        seconds={initialTime.seconds}
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

  return (
    <SafeView>
      {renderHeader()}
      <View style={styles.container}>
        <PagerView
          ref={pageViewRef}
          style={styles.pageView}
          initialPage={currenPage}
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
        <View style={[styles.buttons]}>
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
      </View>
      {renderTimePicker()}
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
      bottom: 0,
      left: 0,
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      padding: theme.layout.spacing.lg,
      paddingVertical: theme.layout.spacing.xs,
    },
  });
