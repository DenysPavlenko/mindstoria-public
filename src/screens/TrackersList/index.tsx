import { MAX_FREE_TRACKERS } from "@/appConstants";
import {
  ConfirmationDialog,
  HeaderIconWrapper,
  HeaderTitle,
  HeaderTitleProps,
  IconButton,
  Placeholder,
  SafeView,
  Typography,
} from "@/components";
import { usePremium } from "@/hooks/usePremium";
import { useAppDispatch, useAppSelector } from "@/store";
import {
  deleteTrackerThunk,
  fetchTrackersDataThunk,
  selectSortedTrackers,
  updateTrackersOrderThunk,
} from "@/store/slices";
import { TTheme, useTheme } from "@/theme";
import { TTracker } from "@/types";
import { useNavigation, useRouter } from "expo-router";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useState,
} from "react";
import { useTranslation } from "react-i18next";
import { Platform, StyleSheet, View } from "react-native";
import DraggableFlatList from "react-native-draggable-flatlist";
import { RowItem } from "./components/RowItem";

export const TrackersList = () => {
  const { t } = useTranslation();
  const { theme } = useTheme();
  const navigation = useNavigation();
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { checkPremiumFeature } = usePremium();
  const { trackersFetchError } = useAppSelector((state) => state.trackersData);
  const sortedTrackers = useAppSelector(selectSortedTrackers);
  const [trackerToDelete, settrackerToDelete] = useState<TTracker | null>(null);

  // Create theme-aware styles (memoized for performance)
  const styles = useMemo(() => createStyles(theme), [theme]);

  useEffect(() => {
    dispatch(fetchTrackersDataThunk());
  }, [dispatch]);

  const handleCreateTracker = useCallback(() => {
    const navigateToForm = () => router.navigate("/tracker-form");
    if (sortedTrackers.length >= MAX_FREE_TRACKERS) {
      checkPremiumFeature(navigateToForm);
    } else {
      navigateToForm();
    }
  }, [router, checkPremiumFeature, sortedTrackers.length]);

  const handleDragEnd = (from: number, to: number) => {
    const fromId = sortedTrackers[from]?.id;
    const toId = sortedTrackers[to]?.id;
    if (!fromId || !toId || fromId === toId) return;
    dispatch(updateTrackersOrderThunk(fromId, toId));
  };

  const handleDeleteTracker = () => {
    if (trackerToDelete) {
      dispatch(deleteTrackerThunk(trackerToDelete));
      settrackerToDelete(null);
    }
  };

  const renderError = () => {
    return (
      <View style={styles.loadingContainer}>
        <Typography>{trackersFetchError}</Typography>
      </View>
    );
  };

  const renderHeaderLeftButton = useCallback(
    () => (
      <HeaderIconWrapper>
        <IconButton
          icon="settings"
          size="lg"
          variant="text"
          onPress={() => router.navigate("/settings")}
          autoSize
          iconColor="onBackground"
        />
      </HeaderIconWrapper>
    ),
    [router]
  );

  const renderHeaderTitle = useCallback(
    ({ tintColor }: HeaderTitleProps) => {
      return (
        <HeaderTitle style={styles.headerTitle} tintColor={tintColor}>
          {t("trackers.title")}
        </HeaderTitle>
      );
    },
    [styles, t]
  );

  useLayoutEffect(() => {
    navigation.setOptions({
      headerTitle: renderHeaderTitle,
      headerLeft: renderHeaderLeftButton,
    });
  }, [navigation, renderHeaderLeftButton, renderHeaderTitle]);

  const renderPlaceholder = () => {
    return (
      <Placeholder
        style={styles.placeholder}
        title={t("trackers.no_trackers_yet")}
        content={t("trackers.create_first_tracker")}
      />
    );
  };

  const renderConfirmationDialog = () => {
    if (!trackerToDelete) return null;
    return (
      <ConfirmationDialog
        visible={Boolean(trackerToDelete)}
        title={t("common.confirm_deletion")}
        content={t("trackers.delete_confirmation")}
        onClose={() => settrackerToDelete(null)}
        onConfirm={handleDeleteTracker}
      />
    );
  };

  const renderAddButton = () => {
    return (
      <View style={styles.addButton}>
        <IconButton icon="plus" size="xl" onPress={handleCreateTracker} />
      </View>
    );
  };

  const renderList = () => {
    if (sortedTrackers.length === 0) {
      return renderPlaceholder();
    }
    return (
      <DraggableFlatList
        data={sortedTrackers}
        keyExtractor={(item) => item.id}
        renderItem={({ item, drag }) => {
          return (
            <RowItem
              item={item}
              trackerId={item.id}
              drag={drag}
              onEdit={(tracker) => {
                router.navigate({
                  pathname: "/tracker-form",
                  params: { trackerId: tracker.id },
                });
              }}
              onDelete={settrackerToDelete}
            />
          );
        }}
        activationDistance={20}
        showsVerticalScrollIndicator={false}
        onDragEnd={({ from, to }) => handleDragEnd(from, to)}
      />
    );
  };

  const renderContent = () => {
    if (trackersFetchError) {
      return renderError();
    }
    return (
      <>
        {renderList()}
        {renderAddButton()}
        {renderConfirmationDialog()}
      </>
    );
  };

  return (
    <SafeView>
      <View style={styles.container}>{renderContent()}</View>
    </SafeView>
  );
};

const createStyles = (theme: TTheme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      paddingVertical: theme.layout.spacing.lg,
    },
    loadingContainer: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    placeholder: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
    },
    headerTitle: {
      paddingHorizontal: Platform.OS === "android" ? 16 : 0,
    },
    addButton: {
      position: "absolute",
      right: theme.layout.spacing.lg,
      bottom: theme.layout.spacing.lg,
    },
  });

export default TrackersList;
