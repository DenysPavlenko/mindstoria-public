import {
  Button,
  ConfirmationDialog,
  DismissKeyboardView,
  HeaderIconWrapper,
  HeaderTitle,
  HeaderTitleProps,
  IconButton,
  IconPicker,
  Input,
  MetricManager,
  MetricsList,
  SafeView,
  SlideInModal,
} from "@/components";
import { TTrackerTemplateData } from "@/data/templates";
import { useAndroidBackHandler } from "@/hooks";
import { useAppDispatch, useAppSelector } from "@/store";
import { createTrackerThunk, updateTrackerThunk } from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TTracker, TTrackerMetric } from "@/types";
import { FeatherIconName } from "@react-native-vector-icons/feather";
import { useNavigation } from "expo-router";
import { useCallback, useLayoutEffect, useMemo, useRef, useState } from "react";
import { useTranslation } from "react-i18next";
import { StyleSheet, TextInput, View } from "react-native";
import { TemplatesList } from "./components/TeplatesList";

interface TrackerFormProps {
  trackerId?: string;
}

export const TrackerForm = ({ trackerId }: TrackerFormProps) => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const { trackers } = useAppSelector((state) => state.trackersData);
  const [showTemplatesModal, setShowTemplatesModal] = useState(false);
  const dispatch = useAppDispatch();
  const tracker = trackerId ? trackers[trackerId] : null;
  const [modalVisible, setModalVisible] = useState(false);
  const [trackerIcon, setTrackerIcon] = useState<FeatherIconName>(
    tracker?.iconName || "activity"
  );
  const [trackerName, setTrackerName] = useState(tracker?.name || "");
  const [trackerDescr, setTrackerDescr] = useState(tracker?.description || "");
  const [metrics, setMetrics] = useState<TTrackerMetric[]>(
    tracker?.metrics || []
  );
  const [metricToEdit, setMetricToEdit] = useState<TTrackerMetric | null>(null);
  const [metricToDelete, setMetricToDelete] = useState<TTrackerMetric | null>(
    null
  );
  const [showExitConfirm, setShowExitConfirm] = useState(false);
  const descrInputRef = useRef<TextInput>(null);
  const styles = useMemo(() => createStyles(theme), [theme]);

  const isEditing = Boolean(tracker);

  useAndroidBackHandler(() => {
    // Check for unsaved changes before allowing to go back
    const hasUnsavedChanges = () => {
      if (!tracker) {
        return (
          Boolean(trackerName.trim()) ||
          Boolean(trackerDescr.trim()) ||
          trackerIcon !== "activity" ||
          metrics.length > 0
        );
      }
      return (
        tracker.name !== trackerName.trim() ||
        (tracker.description || "") !== trackerDescr.trim() ||
        tracker.iconName !== trackerIcon ||
        JSON.stringify(tracker.metrics) !== JSON.stringify(metrics)
      );
    };
    if (!hasUnsavedChanges()) {
      return false;
    }
    setShowExitConfirm(true);
    return true;
  });

  const handleSave = useCallback(() => {
    const trackerData: Omit<TTracker, "id" | "createdAt" | "order"> = {
      name: trackerName.trim(),
      description: trackerDescr.trim(),
      iconName: trackerIcon,
      metrics,
    };
    if (tracker) {
      dispatch(updateTrackerThunk({ id: tracker.id, ...trackerData }));
    } else {
      dispatch(createTrackerThunk(trackerData));
    }
    navigation.goBack();
  }, [
    navigation,
    tracker,
    trackerIcon,
    trackerName,
    trackerDescr,
    metrics,
    dispatch,
  ]);

  const renderHeaderTitle = useCallback(
    ({ tintColor }: HeaderTitleProps) => {
      const title = tracker
        ? t("trackers.edit_tracker")
        : t("trackers.new_tracker");
      return <HeaderTitle tintColor={tintColor}>{title}</HeaderTitle>;
    },
    [tracker, t]
  );

  const renderHeaderRightButton = useCallback(() => {
    if (isEditing) return null;
    return (
      <HeaderIconWrapper>
        <IconButton
          icon="file-plus"
          size="lg"
          variant="text"
          onPress={() => setShowTemplatesModal(true)}
          autoSize
        />
      </HeaderIconWrapper>
    );
  }, [isEditing]);

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: renderHeaderTitle,
      headerRight: renderHeaderRightButton,
    });
  }, [navigation, renderHeaderTitle, renderHeaderRightButton]);

  const handleMetricDialogDone = (newMetrics: TTrackerMetric[]) => {
    setMetrics((prev) => [...prev, ...newMetrics]);
  };

  const handleMetricDialogClose = () => {
    setModalVisible(false);
    setMetricToEdit(null);
  };

  const handleDragEnd = (newMetrics: TTrackerMetric[]) => {
    setMetrics(newMetrics);
  };

  const handleDeleteMetric = () => {
    if (!metricToDelete) return;
    setMetrics((prev) => prev.filter((m) => m.id !== metricToDelete.id));
    setMetricToDelete(null);
  };

  const handleEditMetric = (metric: TTrackerMetric) => {
    setMetrics((prev) => {
      return prev.map((m) => (m.id === metric.id ? { ...m, ...metric } : m));
    });
    setMetricToEdit(null);
  };

  const handleTemplateSelect = (template: TTrackerTemplateData) => {
    setTrackerName(template.name);
    setTrackerDescr(template.description || "");
    setTrackerIcon(template.iconName);
    setMetrics(template.metrics);
    setShowTemplatesModal(false);
  };

  const renderConfirmationDialog = () => {
    if (!metricToDelete) return null;
    return (
      <ConfirmationDialog
        visible={Boolean(metricToDelete)}
        title={t("common.confirm_deletion")}
        content={t("metrics.delete_confirmation")}
        onClose={() => setMetricToDelete(null)}
        onConfirm={handleDeleteMetric}
      />
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
      />
    );
  };

  const renderNameInput = () => {
    return (
      <Input
        label={t("common.name")}
        placeholder={t("trackers.name_input_placeholder")}
        value={trackerName}
        onChangeText={setTrackerName}
        style={styles.input}
        onSubmitEditing={() => {
          descrInputRef.current?.focus();
        }}
        autoFocus
      />
    );
  };

  const renderDescriptionInput = () => {
    return (
      <Input
        label={t("common.description")}
        value={trackerDescr}
        onChangeText={setTrackerDescr}
        style={styles.input}
        placeholder={t("trackers.description_input_placeholder")}
        ref={descrInputRef}
      />
    );
  };

  const renderTemplatesModal = () => {
    return (
      <SlideInModal
        visible={showTemplatesModal}
        onClose={() => setShowTemplatesModal(false)}
        title={t("trackers.select_template")}
      >
        <TemplatesList onSelect={handleTemplateSelect} />
      </SlideInModal>
    );
  };

  const renderSaveButton = () => {
    if (metrics.length === 0) return null;
    return (
      <View style={styles.buttonContainer}>
        <Button
          onPress={handleSave}
          disabled={!trackerName.trim() || metrics.length === 0}
        >
          {isEditing ? t("common.save_changes") : t("trackers.create_tracker")}
        </Button>
      </View>
    );
  };

  return (
    <DismissKeyboardView>
      <SafeView style={styles.container}>
        <View style={styles.header}>
          <IconPicker
            icon={trackerIcon}
            style={styles.iconPicker}
            onSelect={setTrackerIcon}
          />
          {renderNameInput()}
          {renderDescriptionInput()}
        </View>
        <MetricsList
          metrics={metrics}
          onDragEnd={handleDragEnd}
          onEditMetric={(metric: TTrackerMetric) => {
            setMetricToEdit(metric);
            setModalVisible(true);
          }}
          onAddMetric={() => setModalVisible(true)}
          onDeleteMetric={setMetricToDelete}
        />
        {renderSaveButton()}
        {modalVisible && (
          <MetricManager
            onDone={handleMetricDialogDone}
            onClose={handleMetricDialogClose}
            onEdit={handleEditMetric}
            metricToEdit={metricToEdit}
            limitEditing={Boolean(metricToEdit && tracker)}
          />
        )}
        {renderConfirmationDialog()}
        {renderExitConfirmationDialog()}
        {renderTemplatesModal()}
      </SafeView>
    </DismissKeyboardView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingTop: theme.layout.spacing.lg,
    },
    header: {
      paddingHorizontal: theme.layout.spacing.lg,
      marginBottom: theme.layout.spacing.lg,
    },
    iconPicker: {
      marginBottom: theme.layout.spacing.md,
    },
    input: {
      marginBottom: theme.layout.spacing.md,
    },
    buttonContainer: {
      padding: theme.layout.spacing.lg,
    },
  });

export default TrackerForm;
