import {
  TAB_BAR_CBT_LOG_BUTTON_PRESS,
  TAB_BAR_LOG_BUTTON_PRESS,
} from "@/appConstants";
import { useTheme } from "@/providers";
import { TOUCHABLE_ACTIVE_OPACITY, TTheme, withAlpha } from "@/theme";
import Feather, { FeatherIconName } from "@react-native-vector-icons/feather";
import { BottomTabBarProps } from "@react-navigation/bottom-tabs";
import { useMemo } from "react";
import { DeviceEventEmitter, StyleSheet, View } from "react-native";
import { LinearGradient } from "react-native-linear-gradient";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { CustomPressable } from "../CustomPressable/CustomPressable";
import { IconButton } from "../IconButton/IconButton";

const TAB_BAR_PADDING = 4;
const TAB_ITEM_SIZE = 56;
export const TAB_BAR_HEIGHT = TAB_ITEM_SIZE + TAB_BAR_PADDING * 2;
const ADD_BUTTON_SIZE = TAB_BAR_HEIGHT;

type TTabDataItem = {
  icon: FeatherIconName;
};

const TABS_DATA: Record<string, TTabDataItem> = {
  index: {
    icon: "home",
  },
  "cbt-logs": {
    icon: "edit-3",
  },
  settings: {
    icon: "settings",
  },
};

export const TabBar = ({
  state,
  descriptors,
  navigation,
}: BottomTabBarProps) => {
  const { theme, isDark } = useTheme();
  const insets = useSafeAreaInsets();

  const styles = useMemo(() => createStyles(theme, isDark), [theme, isDark]);

  const bottom = insets.bottom + theme.layout.spacing.xs;

  const tabPositionX = useSharedValue(0);

  const animatedStyle = useAnimatedStyle(() => {
    return {
      transform: [{ translateX: tabPositionX.value }],
    };
  });

  const showAddButton =
    state.routes[state.index]?.name === "index" ||
    state.routes[state.index]?.name === "cbt-logs";

  const throttledEmitEvent = useMemo(() => {
    let lastEmitTime = 0;
    return (eventName: string) => {
      const now = Date.now();
      if (now - lastEmitTime >= 500) {
        lastEmitTime = now;
        DeviceEventEmitter.emit(eventName);
      }
    };
  }, []);

  const handleLogButtonPress = () => {
    const eventName =
      state.routes[state.index]?.name === "index"
        ? TAB_BAR_LOG_BUTTON_PRESS
        : TAB_BAR_CBT_LOG_BUTTON_PRESS;
    throttledEmitEvent(eventName);
  };

  const renderTabs = () => {
    return (
      <View style={[styles.tabsContainer, styles.shadow]}>
        <Animated.View
          style={[
            animatedStyle,
            {
              position: "absolute",
              backgroundColor: theme.colors.secondaryContainer,
              borderRadius: TAB_ITEM_SIZE / 2,
              width: TAB_ITEM_SIZE,
              height: TAB_ITEM_SIZE,
              left: TAB_BAR_PADDING,
              zIndex: 1,
            },
          ]}
        />
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key]!;
          const tabData = TABS_DATA[route.name];
          if (!tabData) return null;
          const isFocused = state.index === index;
          const onPress = () => {
            tabPositionX.value = withSpring(
              (TAB_ITEM_SIZE + theme.layout.spacing.xs) * index,
              {
                damping: 70,
                stiffness: 900,
              },
            );
            const event = navigation.emit({
              type: "tabPress",
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name, route.params);
            }
          };
          const onLongPress = () => {
            navigation.emit({
              type: "tabLongPress",
              target: route.key,
            });
          };
          const bgColor = isFocused
            ? theme.colors.secondaryContainer
            : isDark
              ? theme.colors.surface
              : theme.colors.surfaceContainer;
          return (
            <View key={route.key}>
              <CustomPressable
                onPress={onPress}
                onLongPress={onLongPress}
                style={styles.tabItem}
                accessibilityState={isFocused ? { selected: true } : {}}
                accessibilityLabel={options.tabBarAccessibilityLabel}
                testID={options.tabBarButtonTestID}
                activeOpacity={TOUCHABLE_ACTIVE_OPACITY}
              >
                <Feather
                  size={20}
                  name={tabData.icon}
                  color={
                    isFocused
                      ? theme.colors.onPrimaryContainer
                      : theme.colors.onSurface
                  }
                />
              </CustomPressable>
              <View style={[styles.tabItemBg, { backgroundColor: bgColor }]} />
            </View>
          );
        })}
      </View>
    );
  };

  const renderAddButton = () => {
    if (!showAddButton) return null;
    return (
      <View style={[styles.addButton, styles.shadow]}>
        <IconButton
          icon="plus"
          size={ADD_BUTTON_SIZE}
          color="primary"
          iconColor="onPrimary"
          onPress={handleLogButtonPress}
          activeOpacity={1}
        />
      </View>
    );
  };

  return (
    <View style={[styles.container, { paddingBottom: bottom }]}>
      <View style={styles.content}>
        {renderTabs()}
        {renderAddButton()}
      </View>
      <LinearGradient
        colors={[withAlpha(theme.colors.surface, 0.1), theme.colors.surface]}
        start={{ x: 0, y: 0 }}
        end={{ x: 0, y: 1 }}
        style={[styles.gradient, { height: TAB_ITEM_SIZE + bottom }]}
        pointerEvents="none"
      />
    </View>
  );
};

const createStyles = (theme: TTheme, isDark: boolean) =>
  StyleSheet.create({
    container: {
      position: "absolute",
      paddingHorizontal: theme.layout.spacing.lg,
      bottom: 0,
      left: 0,
      right: 0,
      alignItems: "center",
    },
    content: {
      flexDirection: "row",
      justifyContent: "center",
      alignItems: "center",
      zIndex: 2,
    },
    tabsContainer: {
      backgroundColor: isDark
        ? theme.colors.surfaceContainer
        : theme.colors.surface,
      flexDirection: "row",
      alignItems: "center",
      height: TAB_BAR_HEIGHT,
      padding: TAB_BAR_PADDING,
      borderRadius: TAB_BAR_HEIGHT / 2,
      gap: theme.layout.spacing.xs,
    },
    tabItem: {
      alignItems: "center",
      justifyContent: "center",
      gap: theme.layout.spacing.xxs,
      height: TAB_ITEM_SIZE,
      width: TAB_ITEM_SIZE,
      borderRadius: TAB_ITEM_SIZE / 2,
      zIndex: 2,
    },
    tabItemBg: {
      position: "absolute",
      top: 0,
      left: 0,
      width: TAB_ITEM_SIZE,
      height: TAB_ITEM_SIZE,
      borderRadius: TAB_ITEM_SIZE / 2,
      zIndex: -1,
    },
    addButton: {
      position: "absolute",
      borderRadius: ADD_BUTTON_SIZE / 2,
      right: -ADD_BUTTON_SIZE - theme.layout.spacing.md,
      top: 0,
      zIndex: 3,
    },
    shadow: {
      shadowColor: theme.colors.shadow,
      shadowOffset: {
        width: 0,
        height: 0,
      },
      shadowRadius: 20,
      shadowOpacity: 0.25,
      elevation: 4,
    },
    gradient: {
      position: "absolute",
      left: 0,
      right: 0,
      bottom: 0,
      zIndex: 1,
    },
  });
